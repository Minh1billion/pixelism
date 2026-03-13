package pixelart.shop.features.auth.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import pixelart.shop.shared.infrastructure.email.EmailSender;
import pixelart.shop.shared.infrastructure.email.template.EmailRequest;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserRegisteredListener {

    private final EmailSender emailSender;

    @Async
    @EventListener
    public void handleUserRegistered(UserRegisteredEvent event) {
        if (event.isNewUser()) {
            try {
                emailSender.send(EmailRequest.welcome(
                        event.getUser().getEmail(),
                        event.getUser().getUsername()
                ));
                log.info("Welcome email sent to {}", event.getUser().getEmail());
            } catch (Exception e) {
                log.error("Failed to send welcome email to {}", event.getUser().getEmail(), e);
            }
        }
    }
}