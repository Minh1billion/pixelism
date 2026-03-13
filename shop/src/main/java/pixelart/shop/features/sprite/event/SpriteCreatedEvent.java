package pixelart.shop.features.sprite.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class SpriteCreatedEvent extends ApplicationEvent {
    private final UUID spriteId;
    private final String imageUrl;
    private final UUID userId;

    public SpriteCreatedEvent(Object source, UUID spriteId, String imageUrl, UUID userId) {
        super(source);
        this.spriteId = spriteId;
        this.imageUrl = imageUrl;
        this.userId = userId;
    }
}