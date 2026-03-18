package com.rms.backend.admin.service;

import com.rms.backend.admin.dto.AdminReq; // แนะนำเปลี่ยนชื่อจาก Req เป็น Res เพราะเป็นการส่งออก
import com.rms.backend.orders.entity.OrderEntity;
import com.rms.backend.orders.repository.OrderRepository;
import com.rms.backend.product.repository.ProductRepository;
import com.rms.backend.users.entity.UserEntity;
import com.rms.backend.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AdminService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    public AdminReq getAdminDashboard() {
        long totalOrders = orderRepository.count();

        // ใช้ Query จาก Repository จะเร็วกว่า stream มาก
        BigDecimal totalSales = orderRepository.sumTotalSales();
        BigDecimal totalProfit = orderRepository.sumTotalProfit();

        // จัดการกรณีถ้ายังไม่มีออเดอร์ (ผลลัพธ์จะเป็น null) ให้เป็น Zero
        totalSales = (totalSales != null) ? totalSales : BigDecimal.ZERO;
        totalProfit = (totalProfit != null) ? totalProfit : BigDecimal.ZERO;

        long totalResellers = userRepository.countByRole("reseller");
        long totalProducts = productRepository.count();

        return new AdminReq(totalOrders, totalSales, totalProfit, totalResellers, totalProducts);
    }

    @Transactional
    public void approveReseller(Long userId, String status) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));

        // ตรวจสอบให้แน่ใจว่าแก้เฉพาะคนที่เป็น reseller
        if (!"reseller".equals(user.getRole())) {
            throw new RuntimeException("ไม่สามารถเปลี่ยนสถานะผู้ใช้ที่ไม่ใช่ตัวแทนได้");
        }

        user.setStatus(status); // เช่น "อนุมัติแล้ว" หรือ "ระงับการใช้งาน"
        userRepository.save(user);

    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("ไม่พบออเดอร์"));
        order.setStatus(status);
        orderRepository.save(order);
    }
}