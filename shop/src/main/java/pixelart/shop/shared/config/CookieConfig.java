package pixelart.shop.shared.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CookieConfig {

    private static String cookieSecure;

    @Value("${app.cookie.secure:true}")
    public void setCookieSecure(String cookieSecure) {
        CookieConfig.cookieSecure = cookieSecure;
    }

    @PostConstruct
    public void init() {
        System.setProperty("jakarta.servlet.request.cookie_secure", cookieSecure);
    }
}