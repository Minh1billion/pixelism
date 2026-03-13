package pixelart.shop.features.assetpack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import pixelart.shop.features.sprite.entity.Sprite;
import pixelart.shop.features.user.entity.User;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "asset_pack")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class AssetPack implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private String cloudinaryId;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "asset_pack_sprites",
            joinColumns = @JoinColumn(name = "asset_pack_id"),
            inverseJoinColumns = @JoinColumn(name = "sprite_id")
    )
    @Builder.Default
    private List<Sprite> sprites = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column
    private LocalDateTime deletedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PreRemove
    private void removeFromSprites() {
        for (Sprite sprite : sprites) {
            sprite.getAssetPacks().remove(this);
        }
    }

    public boolean isActive() {
        return deletedAt == null;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}