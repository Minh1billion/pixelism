package pixelart.shop.features.category.dto;

import pixelart.shop.features.category.entity.Category;

import java.time.LocalDateTime;
import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        String slug,
        String description,
        LocalDateTime createdAt
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug(),
                c.getDescription(), c.getCreatedAt());
    }
}
