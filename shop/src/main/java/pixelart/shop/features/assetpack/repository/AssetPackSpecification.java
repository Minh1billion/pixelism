package pixelart.shop.features.assetpack.repository;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import pixelart.shop.features.assetpack.entity.AssetPack;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.sprite.entity.Sprite;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class AssetPackSpecification {

    public static Specification<AssetPack> filter(
            String keyword,
            List<UUID> categoryIds,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        return (root, query, cb) -> {

            Predicate predicate = cb.conjunction();

            predicate = cb.and(predicate, cb.isNull(root.get("deletedAt")));

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                predicate = cb.and(predicate, cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            // Price range
            if (minPrice != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicate = cb.and(predicate,
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (categoryIds != null && !categoryIds.isEmpty()) {
                Subquery<Category> subquery = query.subquery(Category.class);
                Root<AssetPack> subRoot = subquery.correlate(root);
                Join<AssetPack, Sprite> spriteJoin = subRoot.join("sprites");
                Join<Sprite, Category> catJoin = spriteJoin.join("categories");

                subquery.select(catJoin)
                        .where(catJoin.get("id").in(categoryIds));

                predicate = cb.and(predicate, cb.exists(subquery));
            }

            return predicate;
        };
    }
}