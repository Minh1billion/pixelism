package pixelart.shop.features.sprite.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import pixelart.shop.features.sprite.entity.Sprite;
import pixelart.shop.features.sprite.entity.SpriteStatus;
import pixelart.shop.features.sprite.repository.SpriteRepository;
import pixelart.shop.shared.sse.SseService;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class SpriteCreatedListener {

    private final SpriteRepository spriteRepository;
    private final SseService sseService;
    private final RestTemplate restTemplate;
    private final StringRedisTemplate redisTemplate;

    @Value("${shop.classifier.url}")
    private String classifierUrl;

    @Async
    @EventListener
    public void onSpriteCreated(SpriteCreatedEvent event) {
        UUID spriteId = event.getSpriteId();
        String userId = event.getUserId().toString();

        try {
            var request = Map.of(
                    "sprite_id", spriteId.toString(),
                    "image_url", event.getImageUrl()
            );

            var response = restTemplate.postForObject(
                    classifierUrl + "/classify",
                    request,
                    Map.class
            );

            boolean isPixelart = Boolean.TRUE.equals(response.get("is_pixelart"));
            double confidence = ((Number) response.get("confidence")).doubleValue();

            Sprite sprite = spriteRepository.findById(spriteId)
                    .orElseThrow(() -> new RuntimeException("Sprite not found: " + spriteId));

            if (isPixelart) {
                sprite.setStatus(SpriteStatus.ACTIVE);
                spriteRepository.save(sprite);
                log.info("[{}] ACTIVE confidence={}", spriteId, confidence);
                sseService.send(userId, Map.of(
                        "type", "SPRITE_READY",
                        "spriteId", spriteId.toString(),
                        "spriteName", sprite.getName(),
                        "confidence", confidence
                ));
            } else {
                sprite.softDelete();
                sprite.setStatus(SpriteStatus.REJECTED);
                spriteRepository.save(sprite);
                log.info("[{}] REJECTED confidence={}", spriteId, confidence);
                sseService.send(userId, Map.of(
                        "type", "SPRITE_REJECTED",
                        "spriteId", spriteId.toString(),
                        "spriteName", sprite.getName(),
                        "confidence", confidence
                ));
            }

        } catch (Exception e) {
            log.error("Classification failed for sprite {}: {}", spriteId, e.getMessage());
            sseService.send(userId, Map.of(
                    "type", "SPRITE_ERROR",
                    "spriteId", spriteId.toString()
            ));
        } finally {
            evictSpriteCache();
        }
    }

    private void evictSpriteCache() {
        try {
            Set<String> spriteKeys = redisTemplate.keys("sprites::*");
            Set<String> userKeys = redisTemplate.keys("sprites-user::*");
            if (spriteKeys != null && !spriteKeys.isEmpty()) redisTemplate.delete(spriteKeys);
            if (userKeys != null && !userKeys.isEmpty()) redisTemplate.delete(userKeys);
        } catch (Exception e) {
            log.warn("Cache evict failed: {}", e.getMessage());
        }
    }
}