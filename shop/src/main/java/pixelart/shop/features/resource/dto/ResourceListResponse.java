package pixelart.shop.features.resource.dto;

import pixelart.shop.features.resource.entity.AudioResource;
import pixelart.shop.features.resource.entity.Resource;
import pixelart.shop.features.resource.entity.ResourceType;
import pixelart.shop.features.resource.entity.SpriteResource;

import java.time.LocalDateTime;
import java.util.UUID;

public record ResourceListResponse(
        UUID id,
        String name,
        String slug,
        ResourceType type,
        boolean isPublic,
        LocalDateTime createdAt,
        String imageUrl,
        Integer durationSeconds,
        String format
) {
    public static ResourceListResponse from(Resource r) {
        if (r instanceof SpriteResource s) {
            return new ResourceListResponse(
                    s.getId(), s.getName(), s.getSlug(),
                    ResourceType.SPRITE, s.isPublic(), s.getCreatedAt(),
                    s.getImageUrl(), null, null
            );
        }
        if (r instanceof AudioResource a) {
            return new ResourceListResponse(
                    a.getId(), a.getName(), a.getSlug(),
                    ResourceType.AUDIO, a.isPublic(), a.getCreatedAt(),
                    null, a.getDurationSeconds(), a.getFormat()
            );
        }
        return new ResourceListResponse(
                r.getId(), r.getName(), r.getSlug(),
                ResourceType.FILE, r.isPublic(), r.getCreatedAt(),
                null, null, null
        );
    }
}