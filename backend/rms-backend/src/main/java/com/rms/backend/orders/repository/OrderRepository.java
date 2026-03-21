package com.rms.backend.orders.repository;

import com.rms.backend.orders.entity.OrderEntity;
import jakarta.persistence.QueryHint;
import org.hibernate.jpa.HibernateHints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    Optional<OrderEntity> findByOrderNumber(String orderNumber); // แก้ไขจาก Object เป็น OrderEntity ให้แล้วครับ

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

    public interface MonthlyStats {
        String getMonthName();
        BigDecimal getTotalSales();
        BigDecimal getTotalProfit();
    }

    // 🌟 แก้ไขเฉพาะจุดนี้: เปลี่ยนชื่อ Column ให้ตรงกับ Entity (total_amount, reseller_profit)
    @Query(value = "SELECT " +
            "TO_CHAR(created_at, 'Mon') AS monthName, " +
            "SUM(total_amount) AS totalSales, " +
            "SUM(reseller_profit) AS totalProfit " +
            "FROM orders " +
            "WHERE created_at >= CURRENT_DATE - INTERVAL '12 months' " + // 🌟 ดึงข้อมูลย้อนหลัง 12 เดือนนับจากวันนี้
            "GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at) " +
            "ORDER BY EXTRACT(MONTH FROM created_at)",
            nativeQuery = true)
    List<MonthlyStats> getMonthlySalesAndProfit();

    @QueryHints(value = @QueryHint(name = HibernateHints.HINT_FETCH_SIZE, value = "1000"))
    @Query(value = "SELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = :year AND EXTRACT(MONTH FROM created_at) = :month", nativeQuery = true)
    Stream<OrderEntity> streamOrdersByMonth(@Param("year") int year, @Param("month") int month);
}