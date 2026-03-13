package pixelart.shop.features.oauth2.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OAuthUserInfo {

    private String email;
    private String name;
    private String avatarUrl;
    private String providerId;
}
