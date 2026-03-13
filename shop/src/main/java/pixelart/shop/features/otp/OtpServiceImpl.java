package pixelart.shop.features.otp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pixelart.shop.shared.infrastructure.cache.OtpStore;
import pixelart.shop.shared.infrastructure.email.EmailSender;
import pixelart.shop.shared.infrastructure.email.template.EmailRequest;

import java.security.SecureRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpStore otpStore;
    private final EmailSender emailSender;

    @Value("${shop.otp.expiration}")
    private long otpExpirationSeconds;

    @Value("${shop.otp.length}")
    private int otpLength;

    private static final String OTP_REGISTER_PREFIX       = "otp:register:";
    private static final String OTP_RESET_PASSWORD_PREFIX = "otp:reset-password:";

    @Override
    public void sendRegistrationOtp(String email) {
        String otp = generateOtp();
        saveToRedis(OTP_REGISTER_PREFIX + email, otp);
        emailSender.send(EmailRequest.registrationOtp(email, otp));
        log.info("Created registration OTP for: {}", email);
    }

    @Override
    public void sendResetPasswordOtp(String email) {
        String otp = generateOtp();
        saveToRedis(OTP_RESET_PASSWORD_PREFIX + email, otp);
        emailSender.send(EmailRequest.resetPasswordOtp(email, otp));
        log.info("Created reset password OTP for: {}", email);
    }

    @Override
    public boolean verifyRegistrationOtp(String email, String otp) {
        return verifyAndDelete(OTP_REGISTER_PREFIX + email, otp);
    }

    @Override
    public boolean verifyResetPasswordOtp(String email, String otp) {
        return verifyAndDelete(OTP_RESET_PASSWORD_PREFIX + email, otp);
    }

    private void saveToRedis(String key, String otp) {
        otpStore.save(key, otp, otpExpirationSeconds);
    }

    private boolean verifyAndDelete(String key, String otp) {
        String storedOtp = otpStore.get(key);

        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStore.delete(key);
            return true;
        }

        log.warn("OTP is invalid or expired for key: {}", key);
        return false;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
