package pixelart.shop.features.resource.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "sprite_resources")
@DiscriminatorValue("SPRITE")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class SpriteResource extends Resource {

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private String cloudinaryId;
}