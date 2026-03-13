package pixelart.shop.features.assetpack;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.assetpack.dto.AssetPackFilterRequest;
import pixelart.shop.features.assetpack.dto.AssetPackRequest;
import pixelart.shop.features.assetpack.dto.AssetPackResponse;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.shared.response.ApiResponse;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/asset-packs")
@RequiredArgsConstructor
public class AssetPackController {

    private final AssetPackService assetPackService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AssetPackResponse>>> getAll(
            AssetPackFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(assetPackService.getAll(filter, page, size))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetPackResponse>> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(assetPackService.getById(id))
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AssetPackResponse>> create(
            @RequestPart("data") AssetPackRequest request,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User currentUser
    ) throws IOException {
        return ResponseEntity.ok(
                ApiResponse.success(assetPackService.create(request, image, currentUser))
        );
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AssetPackResponse>> update(
            @PathVariable UUID id,
            @RequestPart("data") AssetPackRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        return ResponseEntity.ok(
                ApiResponse.success(assetPackService.update(id, request, image))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id
    ) {
        assetPackService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}