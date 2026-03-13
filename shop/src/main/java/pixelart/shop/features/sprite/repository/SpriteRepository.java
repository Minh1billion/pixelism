package pixelart.shop.features.sprite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pixelart.shop.features.sprite.entity.Sprite;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpriteRepository extends JpaRepository<Sprite, UUID>, JpaSpecificationExecutor<Sprite> {

    @Query("SELECT s FROM Sprite s WHERE s.deletedAt IS NOT NULL AND s.deletedAt < :cutoffDate")
    List<Sprite> findInactiveBefore(LocalDateTime cutoffDate);

    @EntityGraph(attributePaths = {"categories", "createdBy"})
    @Query("SELECT s FROM Sprite s WHERE s.id = :id")
    Optional<Sprite> findWithDetailsById(UUID id);

    long countByDeletedAtIsNull();

    Page<Sprite> findAll(Specification<Sprite> spec, Pageable pageable);
}