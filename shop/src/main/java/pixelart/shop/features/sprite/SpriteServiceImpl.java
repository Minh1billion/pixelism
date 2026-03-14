package pixelart.shop.features.sprite;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.category.repository.CategoryRepository;
import pixelart.shop.features.sprite.dto.SpriteFilterRequest;
import pixelart.shop.features.sprite.dto.SpriteListResponse;
import pixelart.shop.features.sprite.dto.SpriteRequest;
import pixelart.shop.features.sprite.dto.SpriteResponse;
import pixelart.shop.features.sprite.entity.Sprite;
import pixelart.shop.features.sprite.entity.SpriteStatus;
import pixelart.shop.features.sprite.event.SpriteCreatedEvent;
import pixelart.shop.features.sprite.repository.SpriteRepository;
import pixelart.shop.features.sprite.repository.SpriteSpecification;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.features.user.repository.UserRepository;
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
public class SpriteServiceImpl implements SpriteService {

    private final UserRepository userRepository;
    private final SpriteRepository spriteRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorage fileStorage;
    private final SpriteCreator spriteCreator;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(
            value = "sprites",
            key = "{#filter.keyword, #filter.categoryIds, #filter.sortBy, #filter.sortOrder, #page, #size}"
    )
    public Page<SpriteListResponse> getAll(SpriteFilterRequest filter, int page, int size) {
        Pageable pageable = buildPageable(filter, page, size);
        Specification<Sprite> spec = SpriteSpecification.filter(filter.categoryIds(), filter.keyword(), null, true);
        Page<SpriteListResponse> result = spriteRepository.findAll(spec, pageable).map(SpriteListResponse::from);
        return new RestPage<>(result.getContent(), result.getNumber(), result.getSize(), result.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(
            value = "sprites-detail",
            key = "#id"
    )
    public SpriteResponse getById(UUID id) {
        return spriteRepository
                .findWithDetailsById(id)
                .filter(Sprite::isActive)
                .map(SpriteResponse::from)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(
            value = "sprites-user",
            key = "{#currentUser.id, #filter.keyword, #filter.categoryIds, #filter.sortBy, #filter.sortOrder, #page, #size}"
    )
    public Page<SpriteListResponse> getByUser(SpriteFilterRequest filter, int page, int size, User currentUser) {
        Pageable pageable = buildPageable(filter, page, size);
        Specification<Sprite> spec = SpriteSpecification.filter(filter.categoryIds(), filter.keyword(), currentUser, null);
        Page<SpriteListResponse> result = spriteRepository.findAll(spec, pageable).map(SpriteListResponse::from);
        return new RestPage<>(result.getContent(), result.getNumber(), result.getSize(), result.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpriteListResponse> getByUserId(SpriteFilterRequest filter, int page, int size, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AppException.notFound("User does not exist"));
        Pageable pageable = buildPageable(filter, page, size);
        Specification<Sprite> spec = SpriteSpecification.filter(filter.categoryIds(), filter.keyword(), user, null);
        return spriteRepository.findAll(spec, pageable).map(SpriteListResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpriteListResponse> getTrash(int page, int size, User currentUser, boolean isAdmin) {
        User filterUser = isAdmin ? null : currentUser;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        Specification<Sprite> spec = SpriteSpecification.trash(filterUser);
        return spriteRepository.findAll(spec, pageable).map(SpriteListResponse::from);
    }

    @Override
    public SpriteResponse create(SpriteRequest request, MultipartFile image, User currentUser) throws IOException {
        UploadResult uploadResult = uploadImage(image);
        try {
            SpriteResponse response = spriteCreator.execute(request, uploadResult, currentUser);
            eventPublisher.publishEvent(new SpriteCreatedEvent(
                    this,
                    response.getId(),
                    response.getImageUrl(),
                    currentUser.getId()
            ));
            return response;
        } catch (Exception e) {
            deleteImage(uploadResult.publicId());
            throw e;
        }
    }

    @Override
    @CacheEvict(value = {"sprites", "sprites-detail", "sprites-user"}, allEntries = true)
    public SpriteResponse update(UUID id, SpriteRequest request) {
        Sprite sprite = spriteRepository
                .findWithDetailsById(id)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));

        List<Category> allCategories = categoryRepository.findAll();
        List<Category> categories = allCategories.stream()
                .filter(c -> request.categoryIds().contains(c.getId()))
                .toList();

        if (categories.isEmpty()) {
            throw AppException.badRequest("At least one category is required");
        }
        
        sprite.setName(request.name());
        sprite.setCategories(categories);
        sprite.setPublic(request.isPublic());

        return SpriteResponse.from(spriteRepository.save(sprite));
    }

    @Override
    @CacheEvict(value = {"sprites", "sprites-detail", "sprites-user"}, allEntries = true)
    public void delete(UUID id) throws IOException {
        Sprite sprite = spriteRepository
                .findById(id)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));
        sprite.softDelete();
        spriteRepository.save(sprite);
    }

    @Override
    @CacheEvict(value = {"sprites", "sprites-detail", "sprites-user"}, allEntries = true)
    public void hardDelete(UUID id) throws IOException {
        Sprite sprite = spriteRepository
                .findById(id)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));

        if (sprite.isActive()) {
            throw AppException.badRequest("Move sprite to trash before permanently deleting");
        }

        if (sprite.getCloudinaryId() != null) {
            deleteImage(sprite.getCloudinaryId());
        }

        spriteRepository.delete(sprite);
    }

    @Override
    @CacheEvict(value = {"sprites", "sprites-detail", "sprites-user"}, allEntries = true)
    public SpriteResponse restore(UUID id) {
        Sprite sprite = spriteRepository
                .findWithDetailsById(id)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));

        if (sprite.isActive()) {
            throw AppException.badRequest("Sprite is not in trash");
        }

        sprite.restore();
        return SpriteResponse.from(spriteRepository.save(sprite));
    }

    private UploadResult uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw AppException.badRequest("Image is required");
        }
        return fileStorage.upload(file.getBytes(), "sprites");
    }

    private void deleteImage(String publicId) {
        try {
            fileStorage.delete(publicId);
        } catch (IOException e) {
            log.warn("Unable to delete image ({}): {}", publicId, e.getMessage());
        }
    }

    private Pageable buildPageable(SpriteFilterRequest filter, int page, int size) {
        String sortBy = (filter.sortBy() != null && !filter.sortBy().isBlank())
                ? filter.sortBy()
                : "createdAt";
        Sort.Direction direction = "asc".equalsIgnoreCase(filter.sortOrder())
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }
}