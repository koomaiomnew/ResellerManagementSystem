package com.rms.backend.orders.repository;

import com.rms.backend.orders.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    Optional<OrderEntity> findByOrderNumber(String orderNumber);

    @Query("SELECT SUM(o.totalAmount) FROM OrderEntity o")
    BigDecimal sumTotalSales();

    @Query("SELECT SUM(o.resellerProfit) FROM OrderEntity o")
    BigDecimal sumTotalProfit();

    @Query("SELECT o FROM OrderEntity o WHERE o.shopId = :shopId " +
            "AND UPPER(o.status) NOT IN ('COMPLETED', 'FAILED', 'CANCELLED', 'FALSE', 'สำเร็จ', 'ยกเลิก', 'โยนทิ้ง') " +
            "ORDER BY o.createdAt DESC")
    List<OrderEntity> findActiveOrdersByShopId(@Param("shopId") Long shopId);

    List<OrderEntity> findByShopId(Long shopId);

    List<OrderEntity> findByStatusNotInOrderByCreatedAtDesc(List<String> statuses);
}