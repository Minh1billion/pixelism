package pixelart.shop.features.auth;

import pixelart.shop.features.auth.dto.*;
import pixelart.shop.features.user.dto.UserDto;
import pixelart.shop.features.user.entity.User;

public interface AuthService {
    void sendRegistrationOtp(String email);
    void sendResetPasswordOtp(String email);
    AuthResponse register(RegisterRequest request);
    AuthResponse resetPassword(ResetPasswordRequest request);
    UserDto setupPassword(User currentUser, String password);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshToken);
    AuthResponse buildAuthResponse(User user);
}
