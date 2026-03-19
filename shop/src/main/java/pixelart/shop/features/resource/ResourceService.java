package pixelart.shop.features.resource;

import org.springframework.data.domain.Page;
import pixelart.shop.features.resource.dto.ResourceFilterRequest;
import pixelart.shop.features.resource.dto.ResourceListResponse;

public interface ResourceService {
    Page<ResourceListResponse> getAll(ResourceFilterRequest filter, int page, int size);
}