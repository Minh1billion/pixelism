package pixelart.shop.features.user;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.user.dto.UpdateProfileRequest;
import pixelart.shop.features.user.dto.UserDto;
import pixelart.shop.features.user.entity.User;

public interface UserService {
    Page<UserDto> getAll(String keyword, int page, int size);
    UserDto updateProfile(User currentUser, UpdateProfileRequest request);
    UserDto updateAvatar(User currentUser, MultipartFile file);
}