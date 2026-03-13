package pixelart.shop.features.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenRequest {
    @NotBlank(message = "Refresh token can't be blank")
    private String refreshToken;
}
