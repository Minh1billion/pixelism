package pixelart.shop.features.sprite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pixelart.shop.features.resource.entity.SpriteResource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpriteRepository extends JpaRepository<SpriteResource, UUID>, JpaSpecificationExecutor<SpriteResource> {

    @Query("SELECT s FROM SpriteResource s WHERE s.deletedAt IS NOT NULL AND s.deletedAt < :cutoffDate")
    List<SpriteResource> findInactiveBefore(LocalDateTime cutoffDate);

    @EntityGraph(attributePaths = {"categories", "createdBy"})
    @Query("SELECT s FROM SpriteResource s WHERE s.id = :id")
    Optional<SpriteResource> findWithDetailsById(UUID id);

    long countByDeletedAtIsNull();

    Page<SpriteResource> findAll(Specification<SpriteResource> spec, Pageable pageable);
}