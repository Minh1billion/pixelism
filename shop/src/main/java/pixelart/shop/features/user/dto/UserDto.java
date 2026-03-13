package pixelart.shop.features.user.dto;

import pixelart.shop.features.user.entity.User;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String username,
        String fullName,
        String avatarUrl,
        String role,
        boolean isVerified,
        LocalDateTime createdAt
) {
    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getRole().name(),
                user.isVerified(),
                user.getCreatedAt()
        );
    }
}

