package pixelart.shop.features.category.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank(message = "Category name can't be blank")
        String name,
        String description
) {}
