package pixelart.shop.features.auth;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pixelart.shop.features.auth.dto.*;
import pixelart.shop.features.user.dto.UserDto;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.shared.response.ApiResponse;
import pixelart.shop.shared.util.CookieUtil;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @PostMapping("/register/send-otp")
    public ResponseEntity<ApiResponse<String>> sendRegistrationOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendRegistrationOtp(request.getEmail());

        return ResponseEntity.ok(
                ApiResponse.success("OTP sent. Valid for 5 minutes.")
        );
    }

    @PostMapping("/reset-password/send-otp")
    public ResponseEntity<ApiResponse<String>> sendResetPasswordOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendResetPasswordOtp(request.getEmail());

        return ResponseEntity.ok(
                ApiResponse.success("OTP sent. Valid for 5 minutes.")
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.register(request);

        cookieUtil.addAuthCookies(
                response,
                authResponse.getAccessToken(),
                authResponse.getRefreshToken()
        );

        return ResponseEntity.status(201)
                .body(ApiResponse.success(
                        "Registration successful.",
                        authResponse.getUser()
                ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<UserDto>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.resetPassword(request);

        cookieUtil.addAuthCookies(
                response,
                authResponse.getAccessToken(),
                authResponse.getRefreshToken()
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Password reset successful.",
                        authResponse.getUser()
                )
        );
    }

    @PostMapping("/setup-password")
    public ResponseEntity<ApiResponse<UserDto>> setupPassword(
            @Valid @RequestBody SetupPasswordRequest request,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        UserDto userDto = authService.setupPassword(currentUser, request.getPassword());

        return ResponseEntity.ok(
                ApiResponse.success("Password set successfully.", userDto)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.login(request);

        cookieUtil.addAuthCookies(
                response,
                authResponse.getAccessToken(),
                authResponse.getRefreshToken()
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful.",
                        authResponse.getUser()
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refresh(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null) {
                return ResponseEntity.status(401)
                        .body(ApiResponse.error("No refresh token found"));
        }

        AuthResponse authResponse =
                authService.refreshToken(new RefreshTokenRequest(refreshToken));

        cookieUtil.addAuthCookies(
                response,
                authResponse.getAccessToken(),
                authResponse.getRefreshToken()
        );

        return ResponseEntity.ok(
                ApiResponse.success("Token refreshed.")
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken != null) {
            authService.logout(refreshToken);
        }

        cookieUtil.clearAuthCookies(response);

        return ResponseEntity.ok(
                ApiResponse.success("Logout successful.")
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> me(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                ApiResponse.success(UserDto.from(user))
        );
    }
}