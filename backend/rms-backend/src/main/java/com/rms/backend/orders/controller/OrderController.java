package com.rms.backend.orders.controller;

import com.rms.backend.orders.dto.OrderReq;
import com.rms.backend.orders.entity.OrderEntity;
import com.rms.backend.orders.repository.OrderRepository;
import com.rms.backend.orders.service.OrderService;
import com.rms.backend.users.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderReq req) {
        try {
            OrderEntity order = orderService.placeOrder(req);
            return ResponseEntity.ok(order);
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<?> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderRepository.findByOrderNumber(orderNumber));
    }
}