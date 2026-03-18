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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
        ShopEntity shop = shopRepository.findById(req.getShopId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้านี้"));

        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomNum = (int) (Math.random() * 9000) + 1000;
        String orderNumber = "ORD-" + dateStr + "-" + randomNum;

        OrderEntity order = new OrderEntity();
        order.setOrderNumber(orderNumber);
        order.setShopId(shop.getId());
        order.setCustomerName(req.getCustomerName());
        order.setAddress(req.getAddress());
        order.setPhone(req.getPhone());
        order.setTotalAmount(BigDecimal.ZERO);
        order.setResellerProfit(BigDecimal.ZERO);
        order.setStatus("ชำระเงินแล้ว");

        order = orderRepository.save(order);

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        List<OrderItemEntity> orderItems = new ArrayList<>();

        for (OrderItemReq itemReq : req.getItems()) {
            ShopProductEntity shopProduct = shopProductRepository.findById(itemReq.getShopProductId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบสินค้าในร้านรหัส: " + itemReq.getShopProductId()));

            ProductEntity product = productRepository.findById(shopProduct.getProductId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลสินค้าส่วนกลาง"));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("ขออภัย สินค้า [" + product.getName() + "] สต็อกไม่เพียงพอ (เหลือ " + product.getStock() + " ชิ้น)");
            }

            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal costPrice = product.getMinPrice();
            BigDecimal sellingPrice = shopProduct.getSellingPrice();
            int qty = itemReq.getQuantity();

            BigDecimal itemTotalAmount = sellingPrice.multiply(BigDecimal.valueOf(qty));
            BigDecimal itemProfit = (sellingPrice.subtract(costPrice)).multiply(BigDecimal.valueOf(qty));

            totalAmount = totalAmount.add(itemTotalAmount);
            totalProfit = totalProfit.add(itemProfit);

            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(product.getId());
            orderItem.setCostPrice(costPrice);
            orderItem.setSellingPrice(sellingPrice);
            orderItem.setQuantity(qty);

            orderItems.add(orderItem);
        }

        orderItemRepository.saveAll(orderItems);

        order.setTotalAmount(totalAmount);
        order.setResellerProfit(totalProfit);
        orderRepository.save(order);

        walletService.addProfitToReseller(shop.getUserId(), order.getId(), totalProfit);

        return mapToOrderRes(order);
    }

    public List<OrderRes> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderRes)
                .collect(Collectors.toList());
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
}