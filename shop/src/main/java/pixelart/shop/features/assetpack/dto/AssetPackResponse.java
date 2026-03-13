package pixelart.shop.features.assetpack.dto;

import pixelart.shop.features.assetpack.entity.AssetPack;
import pixelart.shop.features.category.entity.Category;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record AssetPackResponse(
        UUID id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        int spriteCount,
        List<SpriteInfo> sprites,
        List<UUID> categoryIds,
        List<String> categoryNames,
        String createdBy,
        LocalDateTime createdAt
) {
    public static AssetPackResponse from(AssetPack pack) {
        List<Category> distinctCategories = pack.getSprites().stream()
                .flatMap(s -> s.getCategories().stream())
                .distinct()
                .toList();

        return new AssetPackResponse(
                pack.getId(),
                pack.getName(),
                pack.getDescription(),
                pack.getPrice(),
                pack.getImageUrl(),
                pack.getSprites().size(),
                pack.getSprites().stream().map(SpriteInfo::from).toList(),
                distinctCategories.stream().map(Category::getId).toList(),
                distinctCategories.stream().map(Category::getName).toList(),
                pack.getCreatedBy().getNickname(),
                pack.getCreatedAt()
        );
    }
}