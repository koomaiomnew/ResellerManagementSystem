package com.rms.backend.admin.service;

import com.rms.backend.admin.dto.AdminDashboardRes;
import com.rms.backend.orders.repository.OrderRepository;
import com.rms.backend.product.repository.ProductRepository;
import com.rms.backend.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AdminService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    public AdminDashboardRes getAdminDashboard() {
        // 1. นับจำนวนออเดอร์
        long totalOrders = orderRepository.count();

        // 2. คำนวณยอดขายและกำไรรวม (ดึงจากออเดอร์ทั้งหมด)
        // หมายเหตุ: ในโลกจริงควรใช้ JPQL sum() แต่เบื้องต้นดึงมาบวกกันก่อนได้ครับ
        BigDecimal totalSales = orderRepository.findAll().stream()
                .map(o -> o.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalProfit = orderRepository.findAll().stream()
                .map(o -> o.getResellerProfit())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. นับจำนวนตัวแทน (Role = reseller)
        long totalResellers = userRepository.findAll().stream()
                .filter(u -> "reseller".equals(u.getRole()))
                .count();

        // 4. นับจำนวนสินค้า
        long totalProducts = productRepository.count();

        return new AdminDashboardRes(totalOrders, totalSales, totalProfit, totalResellers, totalProducts);
    }
}