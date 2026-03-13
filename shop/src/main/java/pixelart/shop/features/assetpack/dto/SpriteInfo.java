package pixelart.shop.features.assetpack.dto;

import pixelart.shop.features.sprite.entity.Sprite;

import java.util.UUID;

public record SpriteInfo(
        UUID id,
        String name,
        String imageUrl
) {
    public static SpriteInfo from(Sprite sprite) {
        return new SpriteInfo(
                sprite.getId(),
                sprite.getName(),
                sprite.getImageUrl()
        );
    }
}