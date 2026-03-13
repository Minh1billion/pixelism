package pixelart.shop.shared.infrastructure.cache;

public interface OtpStore {
    void save(String key, String otp, long ttl);
    String get(String key);
    void delete(String key);
}
