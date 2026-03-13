package pixelart.shop.features.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import pixelart.shop.features.auth.AuthService;
import pixelart.shop.features.auth.dto.AuthResponse;
import pixelart.shop.features.user.entity.UserAuthProvider;
import pixelart.shop.features.user.repository.UserAuthProviderRepository;
import pixelart.shop.shared.util.CookieUtil;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;
    private final UserAuthProviderRepository providerRepository;
    private final CookieUtil cookieUtil;

    @Value("${shop.frontend.redirect-uri}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();

        log.info("OAuth2 authentication successful for user: {}", principal.getUser().getEmail());

        AuthResponse authResponse = authService.buildAuthResponse(principal.getUser());
        cookieUtil.addAuthCookies(response, authResponse.getAccessToken(), authResponse.getRefreshToken());

        String targetUrl;

        if (principal.isNeedsPasswordSetup()) {
            String providerName = detectCurrentProvider(principal);

            targetUrl = UriComponentsBuilder
                    .fromUriString(frontendUrl + "/")
                    .queryParam("mode", "setup-password")
                    .queryParam("provider", providerName)
                    .build()
                    .toUriString();

            log.info("Redirecting to setup-password for user: {}", principal.getUser().getEmail());
        } else {
            targetUrl = UriComponentsBuilder
                    .fromUriString(frontendUrl + "/kingdom")
                    .build()
                    .toUriString();
        }

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String detectCurrentProvider(CustomUserPrincipal principal) {
        List<UserAuthProvider> providers =
                providerRepository.findByUserId(principal.getUser().getId());

        return providers.stream()
                .filter(p -> p.getProvider() != UserAuthProvider.Provider.LOCAL)
                .map(p -> p.getProvider().name())
                .findFirst()
                .orElse("OAUTH");
    }
}