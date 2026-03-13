package pixelart.shop.features.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pixelart.shop.features.auth.dto.*;
import pixelart.shop.features.auth.event.UserRegisteredEvent;
import pixelart.shop.features.otp.OtpService;
import pixelart.shop.features.user.dto.UserDto;
import pixelart.shop.features.user.entity.RefreshToken;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.features.user.entity.UserAuthProvider;
import pixelart.shop.features.user.repository.RefreshTokenRepository;
import pixelart.shop.features.user.repository.UserAuthProviderRepository;
import pixelart.shop.features.user.repository.UserRepository;
import pixelart.shop.shared.exception.AppException;
import pixelart.shop.shared.util.JwtUtil;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserAuthProviderRepository providerRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${shop.jwt.refresh-expiration}")
    private long refreshExpiration;

    @Override
    public void sendRegistrationOtp(String email) {
        User existingUser = userRepository.findByEmail(email).orElse(null);

        if (existingUser != null) {
            List<UserAuthProvider> providers = providerRepository.findByUserId(existingUser.getId());

            boolean hasLocal = providers.stream()
                    .anyMatch(p -> p.getProvider() == UserAuthProvider.Provider.LOCAL);

            if (hasLocal) {
                throw AppException.conflict("Email already has local account. Please use reset password instead.");
            }

            List<String> oauthProviders = providers.stream()
                    .filter(p -> p.getProvider() != UserAuthProvider.Provider.LOCAL)
                    .map(p -> p.getProvider().name())
                    .collect(Collectors.toList());

            if (!oauthProviders.isEmpty()) {
                String providerList = String.join(", ", oauthProviders);
                throw new AppException(
                        HttpStatus.CONFLICT,
                        "OAUTH_ACCOUNT_EXISTS:" + providerList
                );
            }
        }

        otpService.sendRegistrationOtp(email);
    }

    @Override
    public void sendResetPasswordOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw AppException.notFound("Email not found");
        }
        otpService.sendResetPasswordOtp(email);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (!otpService.verifyRegistrationOtp(request.getEmail(), request.getOtp())) {
            throw AppException.badRequest("Invalid or expired OTP");
        }

        User existingUser = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (existingUser != null) {

            boolean hasLocal = providerRepository
                    .existsByUserIdAndProvider(
                            existingUser.getId(),
                            UserAuthProvider.Provider.LOCAL
                    );

            if (hasLocal) {
                throw AppException.conflict("Email already has local account");
            }

            existingUser.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );
            existingUser.setFullName(request.getFullName());
            userRepository.save(existingUser);

            UserAuthProvider localProvider =
                    UserAuthProvider.builder()
                            .user(existingUser)
                            .provider(UserAuthProvider.Provider.LOCAL)
                            .providerId(existingUser.getEmail())
                            .build();

            providerRepository.save(localProvider);

            eventPublisher.publishEvent(new UserRegisteredEvent(this, existingUser, true));

            return buildAuthResponse(existingUser);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw AppException.conflict("Username already taken");
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.Role.USER)
                .isVerified(true)
                .build();

        User savedUser = userRepository.save(user);

        UserAuthProvider localProvider =
                UserAuthProvider.builder()
                        .user(savedUser)
                        .provider(UserAuthProvider.Provider.LOCAL)
                        .providerId(savedUser.getEmail())
                        .build();

        providerRepository.save(localProvider);

        eventPublisher.publishEvent(new UserRegisteredEvent(this, savedUser, true));

        return buildAuthResponse(savedUser);
    }

    @Override
    public AuthResponse resetPassword(ResetPasswordRequest request) {

        if (!otpService.verifyResetPasswordOtp(request.getEmail(), request.getOtp())) {
            throw AppException.badRequest("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        AppException.notFound("Email not found")
                );

        boolean hasLocal = providerRepository
                .existsByUserIdAndProvider(
                        user.getId(),
                        UserAuthProvider.Provider.LOCAL
                );

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        if (!hasLocal) {
            UserAuthProvider localProvider =
                    UserAuthProvider.builder()
                            .user(user)
                            .provider(UserAuthProvider.Provider.LOCAL)
                            .providerId(user.getEmail())
                            .build();

            providerRepository.save(localProvider);

            eventPublisher.publishEvent(new UserRegisteredEvent(this, user, true));
        }

        userRepository.save(user);

        return buildAuthResponse(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new AppException(HttpStatus.UNAUTHORIZED, "Invalid credentials")
                );

        List<UserAuthProvider> providers =
                providerRepository.findByUserId(user.getId());

        boolean hasLocal = providers.stream()
                .anyMatch(p -> p.getProvider() == UserAuthProvider.Provider.LOCAL);

        boolean hasOAuth = providers.stream()
                .anyMatch(p -> p.getProvider() != UserAuthProvider.Provider.LOCAL);

        if (!hasLocal && hasOAuth) {
            throw new AppException(
                    HttpStatus.BAD_REQUEST,
                    "This account was created using social login. Please sign in with Google/GitHub or set a password."
            );
        }

        if (!hasLocal) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (!user.isVerified()) {
            throw AppException.forbidden("Please verify your email first");
        }

        return buildAuthResponse(user);
    }

    @Override
    public UserDto setupPassword(User currentUser, String password) {

        boolean hasLocal = providerRepository
                .existsByUserIdAndProvider(
                        currentUser.getId(),
                        UserAuthProvider.Provider.LOCAL
                );

        if (hasLocal) {
            throw AppException.conflict("Password already set. Use reset password to change it.");
        }

        currentUser.setPassword(passwordEncoder.encode(password));
        userRepository.save(currentUser);

        UserAuthProvider localProvider = UserAuthProvider.builder()
                .user(currentUser)
                .provider(UserAuthProvider.Provider.LOCAL)
                .providerId(currentUser.getEmail())
                .build();

        providerRepository.save(localProvider);

        return UserDto.from(currentUser);
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        if (!jwtUtil.isTokenValid(token)) {
            throw AppException.unauthorized("Token is invalid");
        }

        RefreshToken storedToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> AppException.unauthorized("Token doesn't exist"));

        if (storedToken.isRevoked()) {
            refreshTokenRepository.revokeAllByUserId(storedToken.getUser().getId());
            throw AppException.unauthorized("Token has been revoked. Please login again");
        }

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw AppException.unauthorized("Token has expired. Please login again");
        }

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        return buildAuthResponse(storedToken.getUser());
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    public AuthResponse buildAuthResponse(User user) {
        String accessToken       = jwtUtil.generateAccessToken(user);
        String refreshTokenValue = jwtUtil.generateRefreshToken(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenValue)
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpiration / 1000))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .tokenType("Bearer")
                .expiresIn(900)
                .user(UserDto.from(user))
                .build();
    }
}