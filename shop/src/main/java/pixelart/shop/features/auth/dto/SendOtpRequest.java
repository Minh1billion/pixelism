package pixelart.shop.features.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOtpRequest {
    @NotBlank(message = "Email can't be blank")
    @Email(message = "Email is invalid")
    private String email;
}
