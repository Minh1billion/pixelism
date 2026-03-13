package pixelart.shop.features.sprite.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pixelart.shop.features.sprite.SpriteServiceImpl;
import pixelart.shop.features.sprite.entity.Sprite;
import pixelart.shop.features.sprite.repository.SpriteRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SpriteCleanupScheduler {

    private final SpriteRepository spriteRepository;
    private final SpriteServiceImpl spriteService;

    @Scheduled(cron = "0 0 2 * * *")
    public void cleanupOldDeletedSprites() {

        log.info("Starting cleanup job for old deleted sprites...");

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);

        List<Sprite> oldDeletedSprites =
                spriteRepository.findInactiveBefore(cutoffDate);

        int successCount = 0;
        int failureCount = 0;

        for (Sprite sprite : oldDeletedSprites) {
            try {
                spriteService.hardDelete(sprite.getId());
                successCount++;
            } catch (IOException e) {
                log.error(
                        "Failed to permanently delete sprite: {} (ID: {})",
                        sprite.getName(),
                        sprite.getId(),
                        e
                );
                failureCount++;
            }
        }

        log.info(
                "Cleanup job completed. Success: {}, Failed: {}, Total: {}",
                successCount,
                failureCount,
                oldDeletedSprites.size()
        );
    }

    public void manualCleanup(int daysOld) {

        log.info("Starting manual cleanup for sprites older than {} days...", daysOld);

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);

        List<Sprite> oldDeletedSprites =
                spriteRepository.findInactiveBefore(cutoffDate);

        log.info("Found {} sprites to cleanup", oldDeletedSprites.size());

        for (Sprite sprite : oldDeletedSprites) {
            try {
                spriteService.hardDelete(sprite.getId());
                log.info("Cleaned up sprite: {} (ID: {})", sprite.getName(), sprite.getId());
            } catch (IOException e) {
                log.error("Failed to cleanup sprite: {}", sprite.getId(), e);
            }
        }
    }
}