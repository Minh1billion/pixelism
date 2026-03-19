package pixelart.shop.features.sprite.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.resource.entity.SpriteResource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
public class SpriteResponse {

    private final UUID id;
    private final String name;
    private final String slug;
    private final String imageUrl;
    private final List<UUID> categoryIds;
    private final List<String> categoryNames;
    private final boolean isPublic;
    private final String createdBy;
    private final LocalDateTime createdAt;

    @JsonCreator
    public SpriteResponse(
            @JsonProperty("id") UUID id,
            @JsonProperty("name") String name,
            @JsonProperty("slug") String slug,
            @JsonProperty("imageUrl") String imageUrl,
            @JsonProperty("categoryIds") List<UUID> categoryIds,
            @JsonProperty("categoryNames") List<String> categoryNames,
            @JsonProperty("isPublic") boolean isPublic,
            @JsonProperty("createdBy") String createdBy,
            @JsonProperty("createdAt") LocalDateTime createdAt
    ) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.imageUrl = imageUrl;
        this.categoryIds = categoryIds;
        this.categoryNames = categoryNames;
        this.isPublic = isPublic;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public static SpriteResponse from(SpriteResource s) {
        return new SpriteResponse(
                s.getId(),
                s.getName(),
                s.getSlug(),
                s.getImageUrl(),
                s.getCategories().stream().map(Category::getId).toList(),
                s.getCategories().stream().map(Category::getName).toList(),
                s.isPublic(),
                s.getCreatedBy().getNickname(),
                s.getCreatedAt()
        );
    }
}