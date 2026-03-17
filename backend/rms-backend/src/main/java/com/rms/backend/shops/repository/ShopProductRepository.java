package com.rms.backend.shops.repository;

import com.rms.backend.shops.entity.ShopProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ShopProductRepository extends JpaRepository<ShopProductEntity, Long> {
    List<ShopProductEntity> findByShopId(Long shopId);
    Optional<ShopProductEntity> findByShopIdAndProductId(Long shopId, Long productId);
}