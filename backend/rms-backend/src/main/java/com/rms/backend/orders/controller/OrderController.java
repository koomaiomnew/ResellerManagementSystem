package com.rms.backend.orders.controller;

import com.rms.backend.admin.service.EmailService;
import com.rms.backend.orders.dto.OrderReq;
import com.rms.backend.orders.dto.OrderRes;
import com.rms.backend.orders.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderReq req) {
        try {
            emailService.sendNewOrderAlert();
            return ResponseEntity.ok(orderService.checkout(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderRes>> getOrdersByShop(@RequestParam(required = false) Long shopId) {
        if (shopId != null) {
            // ค้นหาเฉพาะของร้านค้านั้นๆ
            return ResponseEntity.ok(orderService.getOrdersByShopId(shopId));
        }
        // ถ้าไม่ใส่ shopId มา อาจจะให้ return ว่างๆ หรือใส่ Pagination (Pageable) แทนในอนาคต
        return ResponseEntity.ok(Collections.emptyList());
    }
    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<?> trackOrderStatus(@PathVariable String orderNumber) {
        try {
            return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/active")
    public ResponseEntity<List<OrderRes>> getActiveOrders() {
        return ResponseEntity.ok(orderService.getAllActiveOrders());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderRes>> getOrdersByUserId(@PathVariable Long userId) {
        try {
            // ให้ Service จัดการหา Shop และดึง Orders มาให้เลย
            return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 🌟 API ใหม่: ดึงเฉพาะออเดอร์ที่ Active (ค้างอยู่) ของตัวแทนคนนั้นๆ
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<OrderRes>> getActiveOrdersByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(orderService.getActiveOrdersByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}