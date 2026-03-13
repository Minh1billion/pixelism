package pixelart.shop.features.auth.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import pixelart.shop.features.user.entity.User;

@Getter
public class UserRegisteredEvent extends ApplicationEvent {
    private final User user;
    private final boolean isNewUser;

    public UserRegisteredEvent(Object source, User user, boolean isNewUser) {
        super(source);
        this.user = user;
        this.isNewUser = isNewUser;
    }
}