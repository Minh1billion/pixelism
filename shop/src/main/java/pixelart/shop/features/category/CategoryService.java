package pixelart.shop.features.category;

import pixelart.shop.features.category.dto.CategoryRequest;
import pixelart.shop.features.category.dto.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {

    List<CategoryResponse> getAll();
    CategoryResponse getById(UUID id);
    CategoryResponse create(CategoryRequest request);
    CategoryResponse update(UUID id, CategoryRequest request);
    void delete(UUID id);
}
