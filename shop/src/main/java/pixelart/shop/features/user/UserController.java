package pixelart.shop.features.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.user.dto.UpdateProfileRequest;
import pixelart.shop.features.user.dto.UserDto;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.shared.response.ApiResponse;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(userService.getAll(keyword, page, size))
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        UserDto updated = userService.updateProfile(currentUser, request);
        return ResponseEntity.ok(
                ApiResponse.success("Profile updated.", updated)
        );
    }

    @PatchMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserDto>> updateAvatar(
            @RequestPart("file") MultipartFile file,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        UserDto updated = userService.updateAvatar(currentUser, file);
        return ResponseEntity.ok(
                ApiResponse.success("Avatar updated.", updated)
        );
    }
}