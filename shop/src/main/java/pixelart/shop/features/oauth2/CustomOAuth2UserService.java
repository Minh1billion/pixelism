package pixelart.shop.features.oauth2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pixelart.shop.features.auth.event.UserRegisteredEvent;
import pixelart.shop.features.oauth2.dto.OAuthUserInfo;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.features.user.entity.UserAuthProvider;
import pixelart.shop.features.user.repository.UserAuthProviderRepository;
import pixelart.shop.features.user.repository.UserRepository;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final UserAuthProviderRepository providerRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request)
            throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(request);
        String registrationId = request.getClientRegistration().getRegistrationId();

        log.info("OAuth2 login via {}", registrationId);
        log.debug("Attributes: {}", oAuth2User.getAttributes());

        OAuthUserInfo userInfo = extractUserInfo(request, oAuth2User);

        if (userInfo.getEmail() == null || userInfo.getEmail().isBlank()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth provider");
        }

        UserAuthProvider.Provider provider = mapProvider(registrationId);

        var existingProvider = providerRepository.findByProviderAndProviderId(
                provider, userInfo.getProviderId()
        );

        if (existingProvider.isPresent()) {
            log.info("Existing OAuth2 user found: {}", userInfo.getEmail());
            User user = existingProvider.get().getUser();
            updateUserIfNeeded(user, userInfo);

            boolean hasLocal = providerRepository.existsByUserIdAndProvider(
                    user.getId(), UserAuthProvider.Provider.LOCAL
            );

            return new CustomUserPrincipal(user, oAuth2User.getAttributes(), !hasLocal);
        }

        User existingUser = userRepository.findByEmail(userInfo.getEmail()).orElse(null);
        boolean isNewUser = existingUser == null;

        User user;
        if (existingUser != null) {
            log.info("Linking {} account to existing user: {}", provider, existingUser.getEmail());
            user = existingUser;
            updateUserIfNeeded(user, userInfo);
        } else {
            log.info("Creating new user from OAuth2: {}", userInfo.getEmail());
            user = createNewUser(userInfo.getEmail(), userInfo.getName(), userInfo.getAvatarUrl());
        }

        try {
            UserAuthProvider link = UserAuthProvider.builder()
                    .user(user)
                    .provider(provider)
                    .providerId(userInfo.getProviderId())
                    .build();
            providerRepository.save(link);
            log.info("Successfully linked {} account to user {}", provider, user.getEmail());
        } catch (Exception e) {
            log.error("Failed to link OAuth provider: {}", e.getMessage());
        }

        if (isNewUser) {
            eventPublisher.publishEvent(new UserRegisteredEvent(this, user, true));
        }

        boolean hasLocal = providerRepository.existsByUserIdAndProvider(
                user.getId(), UserAuthProvider.Provider.LOCAL
        );
        boolean needsPasswordSetup = !hasLocal;

        return new CustomUserPrincipal(user, oAuth2User.getAttributes(), needsPasswordSetup);
    }

    private void updateUserIfNeeded(User user, OAuthUserInfo userInfo) {
        boolean updated = false;

        if ((user.getAvatarUrl() == null || user.getAvatarUrl().isBlank())
                && userInfo.getAvatarUrl() != null) {
            user.setAvatarUrl(userInfo.getAvatarUrl());
            updated = true;
        }

        if ((user.getFullName() == null || user.getFullName().isBlank())
                && userInfo.getName() != null) {
            user.setFullName(userInfo.getName());
            updated = true;
        }

        if (updated) {
            userRepository.save(user);
            log.info("Updated user info for: {}", user.getEmail());
        }
    }

    private OAuthUserInfo extractUserInfo(OAuth2UserRequest request, OAuth2User oAuth2User) {
        String registrationId = request.getClientRegistration().getRegistrationId();

        if ("google".equals(registrationId)) {
            String email      = oAuth2User.getAttribute("email");
            String name       = oAuth2User.getAttribute("name");
            String avatar     = oAuth2User.getAttribute("picture");
            String providerId = oAuth2User.getAttribute("sub");

            if (providerId == null) {
                throw new OAuth2AuthenticationException("Google ID missing");
            }
            return new OAuthUserInfo(email, name, avatar, providerId);
        }

        if ("github".equals(registrationId)) {
            Object idObj = oAuth2User.getAttribute("id");
            if (idObj == null) {
                throw new OAuth2AuthenticationException("GitHub ID missing");
            }

            String providerId = idObj.toString();
            String name       = oAuth2User.getAttribute("name");
            String avatar     = oAuth2User.getAttribute("avatar_url");
            String email      = oAuth2User.getAttribute("email");

            if (email == null) {
                email = fetchGithubPrimaryEmail(request.getAccessToken().getTokenValue());
            }
            return new OAuthUserInfo(email, name, avatar, providerId);
        }

        throw new OAuth2AuthenticationException("Unsupported OAuth provider: " + registrationId);
    }

    private String fetchGithubPrimaryEmail(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            if (response.getBody() == null) return null;

            for (Map<String, Object> emailObj : response.getBody()) {
                Boolean primary  = (Boolean) emailObj.get("primary");
                Boolean verified = (Boolean) emailObj.get("verified");
                if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified)) {
                    return (String) emailObj.get("email");
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch GitHub email: {}", e.getMessage());
        }
        return null;
    }

    private User createNewUser(String email, String name, String avatarUrl) {
        String base = buildSafeUsername(name);

        String username = base;
        int suffix = 1;
        while (userRepository.existsByUsername(username)) {
            username = base + suffix++;
        }

        User user = User.builder()
                .email(email)
                .username(username)
                .fullName(name != null ? name : username)
                .avatarUrl(avatarUrl)
                .isVerified(true)
                .build();

        return userRepository.save(user);
    }

    private String buildSafeUsername(String name) {
        if (name == null || name.isBlank()) {
            return randomFallback();
        }

        String normalized = java.text.Normalizer
                .normalize(name, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        StringBuilder sb = new StringBuilder();
        for (char c : normalized.toCharArray()) {
            if (Character.isLetterOrDigit(c) && c < 128) {
                sb.append(c);
            } else if (c == ' ' || c == '_' || c == '-') {
            } else if (!Character.isWhitespace(c)) {
                sb.append((char) ('a' + (int) (Math.random() * 26)));
            }
        }

        String result = sb.toString().toLowerCase();

        return result.length() >= 3 ? result : randomFallback();
    }

    private String randomFallback() {
        String letters = "abcdefghijklmnopqrstuvwxyz";
        StringBuilder sb = new StringBuilder("user");
        for (int i = 0; i < 4; i++) {
            sb.append(letters.charAt((int) (Math.random() * letters.length())));
        }
        return sb.toString();
    }

    private UserAuthProvider.Provider mapProvider(String registrationId) {
        return switch (registrationId) {
            case "google" -> UserAuthProvider.Provider.GOOGLE;
            case "github" -> UserAuthProvider.Provider.GITHUB;
            default -> throw new IllegalArgumentException("Unknown provider: " + registrationId);
        };
    }
}