package pixelart.shop.features.resource;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pixelart.shop.features.resource.dto.ResourceFilterRequest;
import pixelart.shop.features.resource.dto.ResourceListResponse;
import pixelart.shop.shared.response.ApiResponse;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ResourceListResponse>>> getAll(
            ResourceFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "42") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                resourceService.getAll(filter, page, size)
        ));
    }
}