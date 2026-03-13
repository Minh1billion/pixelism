package pixelart.shop.features.assetpack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record AssetPackRequest(

        @NotBlank(message = "Asset pack name can't be blank")
        String name,

        String description,

        @NotNull(message = "Price can't be null")
        @PositiveOrZero(message = "Price must be >= 0")
        BigDecimal price,

        @NotNull(message = "Sprites can't be null")
        List<UUID> spriteIds
) {}