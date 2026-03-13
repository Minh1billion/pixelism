package pixelart.shop.features.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Email can't be blank")
    @Email(message = "Email is invalid")
    private String email;

    @NotBlank(message = "OTP can't be blank")
    private String otp;

    @NotBlank(message = "New password can't be blank")
    @Min(value = 6, message = "Password must be at least 6 characters long")
    private String newPassword;
}