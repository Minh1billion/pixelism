package pixelart.shop.features.sprite.repository;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.sprite.entity.Sprite;
import pixelart.shop.features.sprite.entity.SpriteStatus;
import pixelart.shop.features.user.entity.User;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SpriteSpecification {

    public static Specification<Sprite> filter(
            List<UUID> categoryIds,
            String keyword,
            User createdBy,
            Boolean isPublic
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isNull(root.get("deletedAt")));

            if (createdBy != null) {
                predicates.add(cb.equal(root.get("createdBy"), createdBy));
            }
            if (keyword != null && !keyword.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }
            if (categoryIds != null && !categoryIds.isEmpty()) {
                Join<Sprite, Category> categoryJoin = root.join("categories", JoinType.INNER);
                predicates.add(categoryJoin.get("id").in(categoryIds));
                query.distinct(true);
            }
            if (isPublic != null) {
                predicates.add(cb.equal(root.get("isPublic"), isPublic));
            }

            predicates.add(cb.equal(root.get("status"), SpriteStatus.ACTIVE));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Sprite> trash(User createdBy) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isNotNull(root.get("deletedAt")));
            predicates.add(cb.notEqual(root.get("status"), SpriteStatus.REJECTED));

            if (createdBy != null) {
                predicates.add(cb.equal(root.get("createdBy"), createdBy));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}