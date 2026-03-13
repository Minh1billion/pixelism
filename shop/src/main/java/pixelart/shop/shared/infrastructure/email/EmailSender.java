package pixelart.shop.shared.infrastructure.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import pixelart.shop.shared.infrastructure.email.template.EmailRequest;
import pixelart.shop.shared.infrastructure.email.template.EmailTemplateEngine;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailSender {

    private final JavaMailSender mailSender;
    private final EmailTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void send(EmailRequest request) {
        try {
            String subject = request.getTemplate().formatSubject(request.getSubjectArgs());
            String content = templateEngine.buildContent(request.getTemplate(), request.getData());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(request.getTo());
            helper.setSubject(subject);
            helper.setText(content, true); // true = isHtml

            mailSender.send(message);
            log.info("Email [{}] sent to {} successfully", request.getTemplate(), request.getTo());

        } catch (MessagingException e) {
            log.error("Error sending email [{}] to {}: {}",
                    request.getTemplate(), request.getTo(), e.getMessage());
        }
    }
}