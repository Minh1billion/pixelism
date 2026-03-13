package pixelart.shop.shared.infrastructure.email.template;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;


@Getter
@Builder
public class EmailRequest {

    private final String to;
    private final EmailTemplate template;
    private final Map<String, Object> data;

    @Builder.Default
    private final Object[] subjectArgs = new Object[0];

    public static EmailRequest registrationOtp(String to, String otp) {
        return EmailRequest.builder()
                .to(to)
                .template(EmailTemplate.OTP_REGISTRATION)
                .data(Map.of("otp", otp))
                .build();
    }

    public static EmailRequest resetPasswordOtp(String to, String otp) {
        return EmailRequest.builder()
                .to(to)
                .template(EmailTemplate.OTP_RESET_PASSWORD)
                .data(Map.of("otp", otp))
                .build();
    }

    public static EmailRequest welcome(String to, String username) {
        return EmailRequest.builder()
                .to(to)
                .template(EmailTemplate.WELCOME)
                .data(Map.of("username", username))
                .build();
    }
}