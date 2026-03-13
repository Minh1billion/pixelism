package pixelart.shop.features.category;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pixelart.shop.features.category.dto.CategoryRequest;
import pixelart.shop.features.category.dto.CategoryResponse;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.category.repository.CategoryRepository;
import pixelart.shop.shared.exception.AppException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Category does not exist"));
        return CategoryResponse.from(category);
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw AppException.conflict("Category name already exists.");
        }

        Category category = Category.builder()
                .name(request.name())
                .slug(generateSlug(request.name()))
                .description(request.description())
                .createdAt(LocalDateTime.now())
                .build();

        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Category does not exist"));

        category.setName(request.name());
        category.setSlug(generateSlug(request.name()));
        category.setDescription(request.description());

        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Override
    public void delete(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw AppException.notFound("Category does not exist");
        }
        categoryRepository.deleteById(id);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");
    }
}