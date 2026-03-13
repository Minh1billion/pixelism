package pixelart.shop.shared.infrastructure.cache;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisOtpStore implements OtpStore {

    private final StringRedisTemplate redisTemplate;

    @Override
    public void save(String key, String otp, long ttlSeconds) {
        redisTemplate.opsForValue()
                .set(key, otp, ttlSeconds, TimeUnit.SECONDS);
    }

    @Override
    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void delete(String key) {
        redisTemplate.delete(key);
    }
}

