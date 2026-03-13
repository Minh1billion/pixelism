package pixelart.shop.features.user.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pixelart.shop.features.user.entity.UserAuthProvider;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAuthProviderRepository extends JpaRepository<UserAuthProvider, UUID> {
    boolean existsByUserIdAndProvider(UUID userId, UserAuthProvider.Provider provider);
    List<UserAuthProvider> findByUserId(UUID userId);
    @Query("SELECT uap FROM UserAuthProvider uap JOIN FETCH uap.user WHERE uap.provider = :provider AND uap.providerId = :providerId")
    Optional<UserAuthProvider> findByProviderAndProviderId(
            @Param("provider") UserAuthProvider.Provider provider,
            @Param("providerId") String providerId
    );
}
