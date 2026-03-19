package pixelart.shop.features.resource;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pixelart.shop.features.resource.dto.ResourceFilterRequest;
import pixelart.shop.features.resource.dto.ResourceListResponse;
import pixelart.shop.features.resource.entity.Resource;
import pixelart.shop.features.resource.repository.ResourceRepository;
import pixelart.shop.features.resource.repository.ResourceSpecification;
import pixelart.shop.shared.dto.RestPage;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    @Cacheable(
            value = "resources",
            key = "{#filter.type, #filter.keyword, #filter.categoryIds, #filter.sortBy, #filter.sortOrder, #page, #size}"
    )
    public Page<ResourceListResponse> getAll(ResourceFilterRequest filter, int page, int size) {
        Pageable pageable = buildPageable(filter, page, size);
        Specification<Resource> spec = ResourceSpecification.filter(
                filter.type(),
                filter.categoryIds(),
                filter.keyword(),
                null,
                true
        );
        Page<ResourceListResponse> result = resourceRepository.findAll(spec, pageable)
                .map(ResourceListResponse::from);
        return new RestPage<>(result.getContent(), result.getNumber(), result.getSize(), result.getTotalElements());
    }

    private Pageable buildPageable(ResourceFilterRequest filter, int page, int size) {
        String sortBy = (filter.sortBy() != null && !filter.sortBy().isBlank()) ? filter.sortBy() : "createdAt";
        Sort.Direction direction = "asc".equalsIgnoreCase(filter.sortOrder())
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }
}