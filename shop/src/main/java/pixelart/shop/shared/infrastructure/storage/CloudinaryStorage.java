package pixelart.shop.shared.infrastructure.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryStorage implements FileStorage {

    private final Cloudinary cloudinary;

    @Override
    public UploadResult upload(byte[] bytes, String folder) throws IOException {

        Map<?, ?> result = cloudinary.uploader().upload(
                bytes,
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "image",
                        "transformation", "q_auto,f_auto"
                )
        );

        return new UploadResult(
                (String) result.get("secure_url"),
                (String) result.get("public_id")
        );
    }

    @Override
    public void delete(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
