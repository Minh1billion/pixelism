package pixelart.shop.features.assetpack.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record AssetPackFilterRequest(

        String keyword,
        List<UUID> categoryIds,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String sortBy,
        String sortOrder
) {
    public AssetPackFilterRequest {
        if (categoryIds == null) categoryIds = List.of();
    }
}