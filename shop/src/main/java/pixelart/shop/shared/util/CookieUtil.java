package pixelart.shop.shared.util;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    @Value("${app.cookie.secure:true}")
    private boolean cookieSecure;

    private static final int ACCESS_TOKEN_MAX_AGE  = 15 * 60;
    private static final int REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

    public void addAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        response.addHeader("Set-Cookie", buildCookie("access_token",  accessToken,  ACCESS_TOKEN_MAX_AGE).toString());
        response.addHeader("Set-Cookie", buildCookie("refresh_token", refreshToken, REFRESH_TOKEN_MAX_AGE).toString());
    }

    public void clearAuthCookies(HttpServletResponse response) {
        response.addHeader("Set-Cookie", buildCookie("access_token",  "", 0).toString());
        response.addHeader("Set-Cookie", buildCookie("refresh_token", "", 0).toString());
    }

    private ResponseCookie buildCookie(String name, String value, long maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .sameSite(cookieSecure ? "None" : "Lax")
                .secure(cookieSecure)
                .path("/")
                .maxAge(maxAge)
                .build();
    }
}