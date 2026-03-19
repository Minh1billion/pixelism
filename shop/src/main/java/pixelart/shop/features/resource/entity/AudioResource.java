package pixelart.shop.features.resource.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "audio_resources")
@DiscriminatorValue("AUDIO")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class AudioResource extends Resource {
    private Integer durationSeconds;
    private Integer sampleRate;
    private String format; // mp3, wav, ogg
    private String cloudinaryId;
    private String fileUrl;
}