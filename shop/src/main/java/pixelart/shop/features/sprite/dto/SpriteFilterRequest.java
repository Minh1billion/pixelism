package pixelart.shop.features.sprite.dto;

import java.util.List;
import java.util.UUID;

public record SpriteFilterRequest(

        List<UUID> categoryIds,
        String keyword,
        String sortBy,
        String sortOrder
) {
    public SpriteFilterRequest {
        if (categoryIds == null) categoryIds = List.of();
    }
}