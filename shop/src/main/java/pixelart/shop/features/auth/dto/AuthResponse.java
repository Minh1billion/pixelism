package pixelart.shop.features.auth.dto;

import lombok.Builder;
import lombok.Data;
import pixelart.shop.features.user.dto.UserDto;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private long expiresIn;
    private UserDto user;
}