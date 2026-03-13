package pixelart.shop.shared.sse;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class SseService {

    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SseEmitter connect(String userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError(e -> emitters.remove(userId));

        emitters.put(userId, emitter);
        log.info("SSE connected: {}", userId);
        return emitter;
    }

    public void send(String userId, Map<String, Object> data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter == null) return;

        try {
            String json = objectMapper.writeValueAsString(data);
            emitter.send(SseEmitter.event().data(json));
        } catch (Exception e) {
            log.warn("SSE send failed for {}: {}", userId, e.getMessage());
            emitters.remove(userId);
        }
    }
}