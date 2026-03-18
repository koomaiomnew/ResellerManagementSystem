package com.rms.backend.orders.controller;

import com.rms.backend.orders.dto.OrderReq;
import com.rms.backend.orders.dto.OrderRes;
import com.rms.backend.orders.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderReq req) {
        try {
            return ResponseEntity.ok(orderService.checkout(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderRes>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<?> trackOrderStatus(@PathVariable String orderNumber) {
        try {
            return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}