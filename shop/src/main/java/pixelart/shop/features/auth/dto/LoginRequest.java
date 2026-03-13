package pixelart.shop.features.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email can't be blank")
    @Email(message = "Email is invalid")
    private String email;

    @NotBlank(message = "Password can't be blank")
    @Min(value = 6, message = "Password must be at least 6 characters long")
    private String password;
}
