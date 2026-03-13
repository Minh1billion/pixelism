package pixelart.shop.features.assetpack.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pixelart.shop.features.assetpack.entity.AssetPack;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetPackRepository extends JpaRepository<AssetPack, UUID>, JpaSpecificationExecutor<AssetPack> {

    @EntityGraph(attributePaths = {"sprites", "sprites.categories", "createdBy"})
    @Query("SELECT a FROM AssetPack a WHERE a.id = :id AND a.deletedAt IS NULL")
    Optional<AssetPack> findByIdAndActive(UUID id);

    Page<AssetPack> findAll(Specification<AssetPack> spec, Pageable pageable);

    long countByDeletedAtIsNull();
}