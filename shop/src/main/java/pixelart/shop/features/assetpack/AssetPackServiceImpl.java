package pixelart.shop.features.assetpack;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.assetpack.dto.AssetPackFilterRequest;
import pixelart.shop.features.assetpack.dto.AssetPackRequest;
import pixelart.shop.features.assetpack.dto.AssetPackResponse;
import pixelart.shop.features.assetpack.entity.AssetPack;
import pixelart.shop.features.assetpack.repository.AssetPackRepository;
import pixelart.shop.features.assetpack.repository.AssetPackSpecification;
import pixelart.shop.features.sprite.entity.Sprite;
import pixelart.shop.features.sprite.repository.SpriteRepository;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.shared.dto.RestPage;
import pixelart.shop.shared.exception.AppException;
import pixelart.shop.shared.infrastructure.storage.FileStorage;
import pixelart.shop.shared.infrastructure.storage.UploadResult;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AssetPackServiceImpl implements AssetPackService {

    private final AssetPackRepository assetPackRepository;
    private final SpriteRepository spriteRepository;
    private final FileStorage fileStorage;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(
            value = "asset-packs",
            key = "{#filter.keyword, #filter.categoryIds, #filter.minPrice, #filter.maxPrice, #filter.sortBy, #filter.sortOrder, #page, #size}"
    )
    public Page<AssetPackResponse> getAll(AssetPackFilterRequest filter, int page, int size) {
        Sort sort = Sort.unsorted();
        if (filter.sortBy() != null && !filter.sortBy().isBlank()) {
            Sort.Direction direction = "desc".equalsIgnoreCase(filter.sortOrder())
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            sort = Sort.by(direction, filter.sortBy());
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<AssetPack> spec = AssetPackSpecification.filter(
                filter.keyword(),
                filter.categoryIds(),
                filter.minPrice(),
                filter.maxPrice()
        );

        Page<AssetPackResponse> result = assetPackRepository.findAll(spec, pageable)
                .map(AssetPackResponse::from);
        return new RestPage<>(result.getContent(), result.getNumber(), result.getSize(), result.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(
            value = "asset-packs:detail",
            key = "#id"
    )
    public AssetPackResponse getById(UUID id) {
        return assetPackRepository
                .findByIdAndActive(id)
                .map(AssetPackResponse::from)
                .orElseThrow(() -> AppException.notFound("Asset pack does not exist"));
    }

    @Override
    @CacheEvict(value = {"asset-packs", "asset-packs:detail"}, allEntries = true)
    public AssetPackResponse create(AssetPackRequest request, MultipartFile image, User currentUser) throws IOException {
        List<Sprite> sprites = resolveSprites(request.spriteIds());

        UploadResult uploadResult = uploadImage(image);

        AssetPack pack = AssetPack.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .imageUrl(uploadResult.url())
                .cloudinaryId(uploadResult.publicId())
                .sprites(sprites)
                .createdBy(currentUser)
                .build();

        return AssetPackResponse.from(assetPackRepository.save(pack));
    }

    @Override
    @CacheEvict(value = {"asset-packs", "asset-packs:detail"}, allEntries = true)
    public AssetPackResponse update(UUID id, AssetPackRequest request, MultipartFile image) throws IOException {
        AssetPack pack = assetPackRepository
                .findById(id)
                .orElseThrow(() -> AppException.notFound("Asset pack does not exist"));

        List<Sprite> sprites = resolveSprites(request.spriteIds());

        if (image != null && !image.isEmpty()) {
            if (pack.getCloudinaryId() != null) {
                deleteImage(pack.getCloudinaryId());
            }
            UploadResult uploadResult = uploadImage(image);
            pack.setImageUrl(uploadResult.url());
            pack.setCloudinaryId(uploadResult.publicId());
        }

        pack.setName(request.name());
        pack.setDescription(request.description());
        pack.setPrice(request.price());
        pack.setSprites(sprites);

        return AssetPackResponse.from(assetPackRepository.save(pack));
    }

    @Override
    @CacheEvict(value = {"asset-packs", "asset-packs:detail"}, allEntries = true)
    public void delete(UUID id) {
        AssetPack pack = assetPackRepository
                .findById(id)
                .orElseThrow(() -> AppException.notFound("Asset pack does not exist"));
        pack.softDelete();
        assetPackRepository.save(pack);
    }

    private List<Sprite> resolveSprites(List<UUID> spriteIds) {
        if (spriteIds == null || spriteIds.isEmpty()) {
            throw AppException.badRequest("At least one sprite is required");
        }
        List<Sprite> sprites = spriteRepository.findAllById(spriteIds);
        if (sprites.isEmpty()) {
            throw AppException.badRequest("No valid sprites found for the given IDs");
        }
        return sprites;
    }

    private UploadResult uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw AppException.badRequest("Image is required");
        }
        return fileStorage.upload(file.getBytes(), "asset-packs");
    }

    private void deleteImage(String publicId) {
        try {
            fileStorage.delete(publicId);
        } catch (IOException e) {
            log.warn("Unable to delete image ({}): {}", publicId, e.getMessage());
        }
    }
}