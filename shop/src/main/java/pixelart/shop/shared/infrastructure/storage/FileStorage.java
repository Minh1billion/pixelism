package pixelart.shop.shared.infrastructure.storage;

import java.io.IOException;

public interface FileStorage {
    UploadResult upload(byte[] bytes, String folder) throws IOException;
    void delete(String publicId) throws IOException;
}
