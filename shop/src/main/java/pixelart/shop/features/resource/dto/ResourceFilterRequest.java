package pixelart.shop.features.resource.dto;

import pixelart.shop.features.resource.entity.ResourceType;

import java.util.List;
import java.util.UUID;

public record ResourceFilterRequest(
        ResourceType type,
        List<UUID> categoryIds,
        String keyword,
        String sortBy,
        String sortOrder
) {
    public ResourceFilterRequest {
        if (categoryIds == null) categoryIds = List.of();
    }
}