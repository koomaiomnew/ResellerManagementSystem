package com.rms.backend.orders.service;

import com.rms.backend.orders.dto.OrderReq;
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
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ShopProductRepository shopProductRepository;

    @Autowired
    private WalletService walletService; // นำเข้า Service ของกระเป๋าเงิน

    // 🔥 @Transactional สำคัญมาก! ถ้า Error กลางคัน ระบบจะ Rollback คืนค่าให้หมด (เช่น คืนสต็อก)
    @Transactional
    public OrderEntity placeOrder(OrderReq req) {
        // 1. ตรวจสอบว่ามีร้านค้านี้ในระบบหรือไม่
        ShopEntity shop = shopRepository.findById(req.getShopId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้านี้ในระบบ"));

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalResellerProfit = BigDecimal.ZERO;

        // 2. สร้างออเดอร์เปล่าๆ ไว้ก่อน (เพื่อเอา ID ไปผูกกับ Items)
        OrderEntity order = new OrderEntity();
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setShopId(shop.getId());
        order.setStatus("ชำระเงินแล้ว"); // จำลองว่าลูกค้าจ่ายเงินสำเร็จตามโจทย์

        // เซ็ตยอดเงินเป็น 0 ไว้ก่อน เดี๋ยวมาอัปเดตหลังจากรวมยอดเสร็จ
        order.setTotalAmount(BigDecimal.ZERO);
        order.setResellerProfit(BigDecimal.ZERO);
        order = orderRepository.save(order);

        // 3. วนลูปจัดการสินค้าในตะกร้าทีละชิ้น
        for (OrderReq.OrderItemReq itemReq : req.getItems()) {

            // 3.1 ดึงข้อมูลสินค้าจากระบบกลาง
            ProductEntity product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบสินค้าส่วนกลาง ID: " + itemReq.getProductId()));

            // 3.2 ดึงราคาสินค้าที่ตัวแทน(ร้านนี้)ตั้งไว้

            ShopProductEntity shopProduct = shopProductRepository.findByShopIdAndProductId(shop.getId(), product.getId())
                    .orElseThrow(() -> new RuntimeException("ร้านค้านี้ไม่ได้นำสินค้า ID: " + product.getId() + " มาขาย"));

            // 3.3 ตรวจสอบสต็อก
            if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("สินค้า '" + product.getName() + "' มีสต็อกไม่เพียงพอ (เหลือ " + product.getStock() + " ชิ้น)");
            }

            // 3.4 หักสต็อกสินค้า และบันทึก
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            // 3.5 คำนวณยอดเงินและกำไรของสินค้ารายการนี้
            BigDecimal itemCost = product.getCostPrice();          // ราคาทุน
            BigDecimal itemSellPrice = shopProduct.getSellingPrice(); // ราคาขายที่ตัวแทนตั้ง
            Integer qty = itemReq.getQuantity();

            // ยอดรวม = ราคาขาย * จำนวน
            BigDecimal subTotal = itemSellPrice.multiply(BigDecimal.valueOf(qty));

            // กำไรต่อชิ้น = ราคาขาย - ราคาทุน
            BigDecimal profitPerItem = itemSellPrice.subtract(itemCost);

            // กำไรรวมของรายการนี้ = กำไรต่อชิ้น * จำนวน
            BigDecimal subTotalProfit = profitPerItem.multiply(BigDecimal.valueOf(qty));

            // บวกสะสมเข้ายอดรวมของ Order
            totalAmount = totalAmount.add(subTotal);
            totalResellerProfit = totalResellerProfit.add(subTotalProfit);

            // 3.6 บันทึกรายการสินค้าในออเดอร์ (Order Item)
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(product.getId());
            orderItem.setCostPrice(itemCost);
            orderItem.setSellingPrice(itemSellPrice);
            orderItem.setQuantity(qty);
            orderItemRepository.save(orderItem);
        }

        // 4. อัปเดตยอดเงินรวม และ กำไรรวม กลับเข้าไปใน Order แล้วบันทึกอีกครั้ง
        order.setTotalAmount(totalAmount);
        order.setResellerProfit(totalResellerProfit);
        orderRepository.save(order);

        // 5. 🔥 อัปเดตยอดเงินเข้า Wallet ของตัวแทนผ่าน WalletService
        // shop.getUserId() คือรหัสของตัวแทนที่เป็นเจ้าของร้านนี้
        walletService.addProfitToReseller(shop.getUserId(), order.getId(), totalResellerProfit);

        return order;
    }
}