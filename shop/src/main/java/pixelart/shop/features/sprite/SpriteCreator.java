package pixelart.shop.features.sprite;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.category.repository.CategoryRepository;
import pixelart.shop.features.resource.entity.SpriteResource;
import pixelart.shop.features.sprite.dto.SpriteRequest;
import pixelart.shop.features.sprite.dto.SpriteResponse;
import pixelart.shop.features.sprite.repository.SpriteRepository;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.shared.exception.AppException;
import pixelart.shop.shared.infrastructure.storage.UploadResult;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SpriteCreator {

    private final SpriteRepository spriteRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    @CacheEvict(value = {"sprites", "sprites:user"}, allEntries = true)
    public SpriteResponse execute(SpriteRequest request, UploadResult uploadResult, User currentUser) {
        List<Category> categories = categoryRepository.findAllById(request.categoryIds());
        if (categories.isEmpty()) throw AppException.badRequest("At least one category is required");

        SpriteResource sprite = SpriteResource.builder()
                .name(request.name())
                .slug(generateUniqueSlug(request.name()))
                .imageUrl(uploadResult.url())
                .cloudinaryId(uploadResult.publicId())
                .categories(categories)
                .createdBy(currentUser)
                .isPublic(request.isPublic())
                .build();

        return SpriteResponse.from(spriteRepository.save(sprite));
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");

        return baseSlug + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
}