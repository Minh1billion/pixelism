package pixelart.shop.features.oauth2;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import pixelart.shop.features.user.entity.User;

import java.util.Collection;
import java.util.Map;

@Getter
public class CustomUserPrincipal implements OAuth2User {

    private final User user;
    private final Map<String, Object> attributes;
    private final boolean needsPasswordSetup;

    public CustomUserPrincipal(User user, Map<String, Object> attributes, boolean needsPasswordSetup) {
        this.user = user;
        this.attributes = attributes;
        this.needsPasswordSetup = needsPasswordSetup;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getAuthorities();
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}