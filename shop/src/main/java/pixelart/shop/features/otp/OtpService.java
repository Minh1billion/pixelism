package pixelart.shop.features.otp;

public interface OtpService {

    void sendRegistrationOtp(String email);
    boolean verifyRegistrationOtp(String email, String otp);

    void sendResetPasswordOtp(String email);
    boolean verifyResetPasswordOtp(String email, String otp);
}