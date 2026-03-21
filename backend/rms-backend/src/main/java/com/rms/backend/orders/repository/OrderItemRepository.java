package com.rms.backend.orders.repository;

import com.rms.backend.orders.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {

    // ของเดิมที่คุณมีอยู่ (เอาไว้ใช้กรณีดูออเดอร์เดี่ยวๆ)
    List<OrderItemEntity> findByOrderId(Long orderId);

    // 🌟 สิ่งที่เพิ่มเข้ามา: ดึงรายการสินค้าของหลายๆ ออเดอร์พร้อมกันใน Query เดียว (แก้เซิร์ฟเวอร์โหลด)
    List<OrderItemEntity> findByOrderIdIn(List<Long> orderIds);
}