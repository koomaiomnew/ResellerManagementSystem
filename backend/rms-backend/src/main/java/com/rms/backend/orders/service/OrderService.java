package com.rms.backend.orders.service;

import com.rms.backend.orders.dto.*;
import com.rms.backend.orders.entity.OrderEntity;
import com.rms.backend.orders.entity.OrderItemEntity;
import com.rms.backend.orders.repository.OrderItemRepository;
import com.rms.backend.orders.repository.OrderRepository;
import com.rms.backend.product.entity.ProductEntity;
import com.rms.backend.product.repository.ProductRepository;
import com.rms.backend.shops.entity.ShopEntity;
import com.rms.backend.shops.entity.ShopProductEntity;
import com.rms.backend.shops.repository.ShopProductRepository;
import com.rms.backend.shops.repository.ShopRepository;
import com.rms.backend.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private WalletService walletService;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ShopRepository shopRepository;
    @Autowired private ShopProductRepository shopProductRepository;
    @Autowired private ProductRepository productRepository;

    @Transactional
    public OrderRes checkout(OrderReq req) {
        // 1. ตรวจสอบร้านค้า
        ShopEntity shop = shopRepository.findById(req.getShopId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้านี้"));

        // 2. เจนเลขที่ออเดอร์
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomNum = (int) (Math.random() * 9000) + 1000;
        String orderNumber = "ORD-" + dateStr + "-" + randomNum;

        // 3. สร้าง Order เบื้องต้น
        OrderEntity order = new OrderEntity();
        order.setOrderNumber(orderNumber);
        order.setShopId(shop.getId());
        order.setCustomerName(req.getCustomerName());
        order.setAddress(req.getAddress());
        order.setPhone(req.getPhone());
        order.setTotalAmount(BigDecimal.ZERO);
        order.setResellerProfit(BigDecimal.ZERO);
        order.setStatus("paid");
        // บันทึกครั้งแรกเพื่อให้ได้ order.getId()
        order.setCreatedAt(OffsetDateTime.now());
        orderRepository.save(order);

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        List<OrderItemEntity> orderItems = new ArrayList<>();

        // 4. วนลูปจัดการสินค้าและคำนวณเงิน
        for (OrderItemReq itemReq : req.getItems()) {
            ShopProductEntity shopProduct = shopProductRepository.findById(itemReq.getShopProductId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบสินค้าในร้านรหัส: " + itemReq.getShopProductId()));

            ProductEntity product = productRepository.findById(shopProduct.getProductId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลสินค้าส่วนกลาง"));

            // เช็คสต็อก
            if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("ขออภัย สินค้า [" + product.getName() + "] สต็อกไม่เพียงพอ (เหลือ " + product.getStock() + " ชิ้น)");
            }

            // ตัดสต็อกสินค้าส่วนกลาง
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal costPrice = product.getMinPrice(); // ราคาทุน
            BigDecimal sellingPrice = shopProduct.getSellingPrice(); // ราคาขายของ Reseller
            int qty = itemReq.getQuantity();

            // คำนวณยอดเงิน
            BigDecimal itemTotalAmount = sellingPrice.multiply(BigDecimal.valueOf(qty));
            BigDecimal itemProfit = (sellingPrice.subtract(costPrice)).multiply(BigDecimal.valueOf(qty));

            totalAmount = totalAmount.add(itemTotalAmount);
            totalProfit = totalProfit.add(itemProfit);

            // สร้าง Item ของออเดอร์
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(product.getId());
            orderItem.setCostPrice(costPrice);
            orderItem.setSellingPrice(sellingPrice);
            orderItem.setQuantity(qty);

            orderItems.add(orderItem);
        }

        // 5. บันทึกรายการสินค้าทั้งหมด
        orderItemRepository.saveAll(orderItems);

        // 6. อัปเดตยอดรวมใน Order หลัก
        order.setTotalAmount(totalAmount);
        order.setResellerProfit(totalProfit);
        orderRepository.save(order);

        // 7. 💰 โอนเงินเข้ากระเป๋า Reseller และสร้าง Log
        // เมธอดนี้จะไปจัดการ WalletRepository และ WalletLogRepository ให้เอง
        walletService.addProfitToReseller(shop.getUserId(), order.getId(), totalProfit);

        // 8. ส่งผลลัพธ์กลับ
        return mapToOrderRes(order);
    }


    public OrderRes getOrderByNumber(String orderNumber) {
        OrderEntity order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("ไม่พบออเดอร์หมายเลขนี้"));
        return mapToOrderRes(order);
    }

    // ฟังก์ชันแปลง Entity เป็น Res (ประกอบร่าง)
    private OrderRes mapToOrderRes(OrderEntity order) {
        OrderRes res = new OrderRes();
        res.setId(order.getId());
        res.setOrderNumber(order.getOrderNumber());
        res.setCustomerName(order.getCustomerName());
        res.setAddress(order.getAddress());
        res.setPhone(order.getPhone());
        res.setTotalAmount(order.getTotalAmount());
        res.setStatus(order.getStatus());
        res.setCreatedAt(order.getCreatedAt());

        List<OrderItemEntity> orderItems = orderItemRepository.findByOrderId(order.getId());
        List<OrderItemRes> itemResList = new ArrayList<>();

        for (OrderItemEntity item : orderItems) {
            OrderItemRes itemRes = new OrderItemRes();
            itemRes.setProductId(item.getProductId());
            itemRes.setQuantity(item.getQuantity());
            itemRes.setPrice(item.getSellingPrice());

            ProductEntity product = productRepository.findById(item.getProductId()).orElse(null);
            itemRes.setProductName(product != null ? product.getName() : "สินค้าไม่ทราบชื่อ");

            itemResList.add(itemRes);
        }

        res.setItems(itemResList);
        return res;
    }

    public List<OrderRes> getOrdersByShopId(Long shopId) {
        List<OrderEntity> orders = orderRepository.findByShopId(shopId);
        return orders.stream()
                .map(this::mapToOrderRes) // ฟังก์ชันแปลง Entity เป็น DTO
                .collect(Collectors.toList());
    }

    public List<OrderRes> getAllActiveOrders() {
        List<String> completedStatuses = Arrays.asList("COMPLETED", "FAILED", "CANCELLED", "FALSE", "completed", "false");
        // ดึงเฉพาะที่ยังต้องดำเนินการ (เอามาทั้งหมดเลย แอดมินจะได้จัดส่งได้)
        List<OrderEntity> activeOrders = orderRepository.findByStatusNotInOrderByCreatedAtDesc(completedStatuses);

        return activeOrders.stream().map(this::mapToOrderRes).collect(Collectors.toList());
    }

    // ในไฟล์ OrderService.java
    public List<OrderRes> getOrdersByUserId(Long userId) {
        // 1. หา Shop ของ User คนนี้ก่อน (ดึงจาก Database)
        ShopEntity shop = shopRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        // 2. เอา Shop ID ไปดึงออเดอร์แล้วส่งกลับ
        return getOrdersByShopId(shop.getId());
    }

    public List<OrderRes> getActiveOrdersByUserId(Long userId) {
        // 1. หาร้านค้า
        ShopEntity shop = shopRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        // 2. ดึง OrderEntity เฉพาะที่ Active จาก Database (เร็วปรู๊ด!)
        List<OrderEntity> activeEntities = orderRepository.findActiveOrdersByShopId(shop.getId());

        // 3. แปลง Entity เป็น DTO (OrderRes) คืนให้ React
        return activeEntities.stream()
                .map(this::mapToOrderRes) // 🌟 เรียกใช้ฟังก์ชัน mapToOrderRes ของคุณตรงนี้ครับ!
                .collect(Collectors.toList());
    }

}