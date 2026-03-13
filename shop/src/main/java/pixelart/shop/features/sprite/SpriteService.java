package pixelart.shop.features.sprite;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.sprite.dto.SpriteFilterRequest;
import pixelart.shop.features.sprite.dto.SpriteListResponse;
import pixelart.shop.features.sprite.dto.SpriteRequest;
import pixelart.shop.features.sprite.dto.SpriteResponse;
import pixelart.shop.features.user.entity.User;

import java.io.IOException;
import java.util.UUID;

public interface SpriteService {

    Page<SpriteListResponse> getAll(SpriteFilterRequest filter, int page, int size);

    Page<SpriteListResponse> getByUser(SpriteFilterRequest filter, int page, int size, User currentUser);

    Page<SpriteListResponse> getByUserId(SpriteFilterRequest filter, int page, int size, UUID userId);

    Page<SpriteListResponse> getTrash(int page, int size, User currentUser, boolean isAdmin);

    SpriteResponse getById(UUID id);

    SpriteResponse create(SpriteRequest request, MultipartFile image, User currentUser) throws IOException;

    SpriteResponse update(UUID id, SpriteRequest request, MultipartFile image) throws IOException;

    void delete(UUID id) throws IOException;

    void hardDelete(UUID id) throws IOException;

    SpriteResponse restore(UUID id);
}