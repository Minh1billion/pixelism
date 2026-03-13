package pixelart.shop.shared.infrastructure.email.template;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EmailTemplate {
    OTP_REGISTRATION(
            "🎮 Registration OTP - Pixel Art Shop"
    ),
    OTP_RESET_PASSWORD(
            "🔑 Reset password OTP - Pixel Art Shop"
    ),
    WELCOME(
            "🎉 Welcome to Pixel Art Shop!"
    ),

    ADMIN_NEW_USER_NOTIFICATION(
            "👤 New user registration - Pixel Art Shop"
    );

    private final String subjectTemplate;

    public String formatSubject(Object... args) {
        if (args.length == 0) return subjectTemplate;
        try {
            return String.format(subjectTemplate, args);
        } catch (Exception e) {
            return subjectTemplate;
        }
    }
}