package pixelart.shop.features.sprite.dto;

import pixelart.shop.features.sprite.entity.Sprite;

import java.time.LocalDateTime;
import java.util.UUID;

public record SpriteListResponse(
        UUID id,
        String name,
        String slug,
        String imageUrl,
        boolean isPublic,
        LocalDateTime createdAt,
        LocalDateTime deletedAt
) {
    public static SpriteListResponse from(Sprite s) {
        return new SpriteListResponse(
                s.getId(),
                s.getName(),
                s.getSlug(),
                s.getImageUrl(),
                s.isPublic(),
                s.getCreatedAt(),
                s.getDeletedAt()
        );
    }
}
