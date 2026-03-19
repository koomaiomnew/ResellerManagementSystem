package com.rms.backend.orders.repository;

import com.rms.backend.orders.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Optional<OrderEntity> findByOrderNumber(String orderNumber);
    @Query("SELECT SUM(o.totalAmount) FROM OrderEntity o")
    BigDecimal sumTotalSales();

    @Query("SELECT SUM(o.resellerProfit) FROM OrderEntity o")
    BigDecimal sumTotalProfit();

    List<OrderEntity> findByShopId(Long shopId);
}