package com.rms.backend.admin.service;

import com.rms.backend.admin.dto.AdminReq; // แนะนำเปลี่ยนชื่อจาก Req เป็น Res เพราะเป็นการส่งออก
import com.rms.backend.admin.dto.AdminResellerReq;
import com.rms.backend.admin.dto.ChartDataDTO;
import com.rms.backend.orders.entity.OrderEntity;
import com.rms.backend.orders.repository.OrderRepository;
import com.rms.backend.product.repository.ProductRepository;
import com.rms.backend.shops.entity.ShopEntity;
import com.rms.backend.shops.repository.ShopRepository;
import com.rms.backend.users.entity.UserEntity;
import com.rms.backend.users.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ShopRepository shopRepository;

    public AdminReq getAdminDashboard() {
        long totalOrders = orderRepository.count();

        BigDecimal totalSales = orderRepository.sumTotalSales();
        BigDecimal totalProfit = orderRepository.sumTotalProfit();

        totalSales = (totalSales != null) ? totalSales : BigDecimal.ZERO;
        totalProfit = (totalProfit != null) ? totalProfit : BigDecimal.ZERO;

        long totalResellers = userRepository.countByRole("reseller");
        long totalProducts = productRepository.count();

        // 🌟 ดึงข้อมูลกราฟรายเดือนจาก Repository
        List<OrderRepository.MonthlyStats> monthlyStats = orderRepository.getMonthlySalesAndProfit();

        // 🌟 แปลง MonthlyStats ให้เป็น ChartDataDTO ที่หน้าบ้านต้องการ
        List<ChartDataDTO> chartData = monthlyStats.stream().map(stat -> {
            BigDecimal sales = stat.getTotalSales() != null ? stat.getTotalSales() : BigDecimal.ZERO;
            BigDecimal profit = stat.getTotalProfit() != null ? stat.getTotalProfit() : BigDecimal.ZERO;
            // stat.getMonthName() จะได้ชื่อเดือนย่อ เช่น Jan, Feb, Mar
            return new ChartDataDTO(stat.getMonthName(), sales, profit);
        }).collect(Collectors.toList());

        // สร้าง Object เพื่อส่งกลับ
        AdminReq response = new AdminReq(totalOrders, totalSales, totalProfit, totalResellers, totalProducts);

        // 🌟 ยัดข้อมูลกราฟใส่เข้าไป
        response.setChartData(chartData);

        return response;
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

    public List<AdminResellerReq> getAllUser() {
        // 1. ดึง User ทั้งหมดมาจากฐานข้อมูล
        List<UserEntity> users = userRepository.findAll();

        // 2. แปลง (Map) UserEntity แต่ละตัวให้กลายเป็น AdminResellerReq DTO
        return users.stream().map(user -> {
            AdminResellerReq dto = new AdminResellerReq();
            dto.setUserId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            dto.setStatus(user.getStatus());

            // 3. ค้นหาชื่อร้านจาก ID ของ User
            // ถ้า User คนนี้มีร้านค้า ก็เอาชื่อร้านมาใส่ ถ้าไม่มี ให้ใส่ขีด "-"
            Optional<ShopEntity> shop = shopRepository.findByUserId(user.getId());
            if (shop.isPresent()) {
                dto.setShopName(shop.get().getShopName());
            } else {
                dto.setShopName("-");
            }

            return dto;
        }).collect(Collectors.toList());
    }
}