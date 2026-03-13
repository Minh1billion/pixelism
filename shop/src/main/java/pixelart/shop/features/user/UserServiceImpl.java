package pixelart.shop.features.user;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.user.dto.UpdateProfileRequest;
import pixelart.shop.features.user.dto.UserDto;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.features.user.repository.UserRepository;
import pixelart.shop.shared.exception.AppException;
import pixelart.shop.shared.infrastructure.storage.FileStorage;
import pixelart.shop.shared.infrastructure.storage.UploadResult;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FileStorage fileStorage;

    @Override
    public Page<UserDto> getAll(String keyword, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return userRepository.searchByKeyword(keyword, pageable).map(UserDto::from);
    }

    @Override
    @Transactional
    public UserDto updateProfile(User currentUser, UpdateProfileRequest request) {
        String newUsername = request.getUsername().trim();

        boolean usernameTaken = userRepository.existsByUsername(newUsername)
                && !newUsername.equals(currentUser.getNickname());

        if (usernameTaken) {
            throw AppException.conflict("Username already taken");
        }

        currentUser.setUsername(newUsername);
        currentUser.setFullName(request.getFullName().trim());

        User saved = userRepository.save(currentUser);
        return UserDto.from(saved);
    }

    @Override
    @Transactional
    public UserDto updateAvatar(User currentUser, MultipartFile file) {
        if (file.isEmpty()) {
            throw AppException.badRequest("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw AppException.badRequest("Only image files are allowed");
        }

        try {
            byte[] bytes = file.getBytes();
            UploadResult result = fileStorage.upload(bytes, "avatars");
            currentUser.setAvatarUrl(result.url());
            User saved = userRepository.save(currentUser);
            return UserDto.from(saved);
        } catch (IOException e) {
            throw AppException.badRequest("Failed to upload avatar: " + e.getMessage());
        }
    }
}