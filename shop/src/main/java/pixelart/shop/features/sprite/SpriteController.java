package pixelart.shop.features.sprite;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.sprite.dto.SpriteFilterRequest;
import pixelart.shop.features.sprite.dto.SpriteListResponse;
import pixelart.shop.features.sprite.dto.SpriteRequest;
import pixelart.shop.features.sprite.dto.SpriteResponse;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.shared.response.ApiResponse;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sprites")
@RequiredArgsConstructor
public class SpriteController {

    private final SpriteService spriteService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SpriteListResponse>>> getAll(
            SpriteFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "42") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                spriteService.getAll(filter, page, size)
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Page<SpriteListResponse>>> getMySprites(
            SpriteFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "42") int size,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                spriteService.getByUser(filter, page, size, currentUser)
        ));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<SpriteListResponse>>> getSpritesByUser(
            SpriteFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "42") int size,
            @PathVariable UUID userId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                spriteService.getByUserId(filter, page, size, userId)
        ));
    }

    @GetMapping("/trash")
    public ResponseEntity<ApiResponse<Page<SpriteListResponse>>> getTrash(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(ApiResponse.success(
                spriteService.getTrash(page, size, currentUser, isAdmin)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SpriteResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(spriteService.getById(id)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<SpriteResponse>> create(
            @RequestPart("data") SpriteRequest request,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User currentUser
    ) throws IOException {
        return ResponseEntity.ok(ApiResponse.success(
                spriteService.create(request, image, currentUser)
        ));
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ApiResponse<SpriteResponse>> update(
            @PathVariable UUID id,
            @RequestPart("data") SpriteRequest request
    ) throws IOException {
        return ResponseEntity.ok(ApiResponse.success(
                spriteService.update(id, request)
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) throws IOException {
        spriteService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<SpriteResponse>> restore(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(spriteService.restore(id)));
    }
    
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse<Void>> permanentDelete(@PathVariable UUID id) throws IOException {
        spriteService.hardDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}