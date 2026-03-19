package pixelart.shop.features.resource.repository;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.resource.entity.Resource;
import pixelart.shop.features.resource.entity.ResourceStatus;
import pixelart.shop.features.resource.entity.ResourceType;
import pixelart.shop.features.user.entity.User;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ResourceSpecification {

    public static Specification<Resource> filter(
            ResourceType type,
            List<UUID> categoryIds,
            String keyword,
            User createdBy,
            Boolean isPublic
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isNull(root.get("deletedAt")));
            predicates.add(cb.equal(root.get("status"), ResourceStatus.ACTIVE));

            // filter by dtype (discriminator)
            if (type != null) {
                predicates.add(cb.equal(root.get("dtype"), type.name()));
            }
            if (createdBy != null) {
                predicates.add(cb.equal(root.get("createdBy"), createdBy));
            }
            if (keyword != null && !keyword.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }
            if (categoryIds != null && !categoryIds.isEmpty()) {
                Join<Resource, Category> categoryJoin = root.join("categories", JoinType.INNER);
                predicates.add(categoryJoin.get("id").in(categoryIds));
                query.distinct(true);
            }
            if (isPublic != null) {
                predicates.add(cb.equal(root.get("isPublic"), isPublic));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}