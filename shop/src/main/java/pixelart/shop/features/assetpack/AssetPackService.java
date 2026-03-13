package pixelart.shop.features.assetpack;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.assetpack.dto.AssetPackFilterRequest;
import pixelart.shop.features.assetpack.dto.AssetPackRequest;
import pixelart.shop.features.assetpack.dto.AssetPackResponse;
import pixelart.shop.features.user.entity.User;

import java.io.IOException;
import java.util.UUID;

public interface AssetPackService {

    Page<AssetPackResponse> getAll(AssetPackFilterRequest filter, int page, int size);

    AssetPackResponse getById(UUID id);

    AssetPackResponse create(AssetPackRequest request, MultipartFile image, User currentUser) throws IOException;

    AssetPackResponse update(UUID id, AssetPackRequest request, MultipartFile image) throws IOException;

    void delete(UUID id);
}