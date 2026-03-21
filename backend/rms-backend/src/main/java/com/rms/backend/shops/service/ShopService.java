package com.rms.backend.shops.service;

import com.rms.backend.product.repository.ProductRepository;
import com.rms.backend.product.entity.ProductEntity;
import com.rms.backend.shops.dto.ShopProductReq;
import com.rms.backend.shops.entity.ShopEntity;
import com.rms.backend.shops.entity.ShopProductEntity;
import com.rms.backend.shops.repository.ShopProductRepository;
import com.rms.backend.shops.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ShopProductRepository shopProductRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<ShopEntity> getAllShop() {
        return shopRepository.findAll();
    }

    public ShopEntity createShop(ShopEntity shopEntity) {
        if (shopRepository.findByUserId(shopEntity.getUserId()).isPresent()) {
            throw new RuntimeException("คุณมีร้านอยู่แล้ว");
        }
        return shopRepository.save(shopEntity);
    }

    public ShopProductEntity addProductToShop(Long shopId, ShopProductReq req) {
        shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้า"));

        ProductEntity product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้า"));

        if (req.getSellingPrice().compareTo(product.getMinPrice()) < 0) {
            throw new RuntimeException("ราคาต่ำกว่าขั้นต่ำ");
        }

        if (shopProductRepository.existsByShopIdAndProductId(shopId, req.getProductId())) {
            throw new RuntimeException("สินค้านี้มีอยู่ในร้านแล้ว");
        }

        ShopProductEntity sp = new ShopProductEntity();
        sp.setShopId(shopId);
        sp.setProductId(req.getProductId());
        sp.setSellingPrice(req.getSellingPrice());

        return shopProductRepository.save(sp);
    }

    public ShopProductEntity updateShopProduct(Long shopId, ShopProductReq req) {
        // 1. 🌟 เปลี่ยนมาใช้เมธอดที่เราเพิ่งสร้าง ค้นหาด้วย shopId และ productId
        ShopProductEntity entity = shopProductRepository.findByShopIdAndProductId(shopId, req.getProductId())
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้านี้ในร้านของคุณ"));

        // 2. 🌟 อัปเดตแค่ราคาขายอย่างเดียวก็พอ (ไม่ต้องเซ็ต ShopId หรือ ProductId ทับแล้ว เพราะมันถูกอยู่แล้ว)
        entity.setSellingPrice(req.getSellingPrice());

        // 3. บันทึกลง Database
        return shopProductRepository.save(entity);
    }


    public List<ShopProductReq> getProductsByShopSlug(String shopSlug) {
        // 1. หาร้านค้า (Query 1)
        ShopEntity shop = shopRepository.findByShopSlug(shopSlug)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้าน"));

        // 2. ดึงรายการสินค้าทั้งหมดในร้าน (Query 2)
        List<ShopProductEntity> shopProducts = shopProductRepository.findByShopId(shop.getId());

        if (shopProducts.isEmpty()) {
            return new ArrayList<>();
        }

        // --- 🌟 จุดแก้เซิร์ฟเวอร์โหลด: ดึงข้อมูลแบบเหมาเข่ง ---

        // รวบรวม Product ID ทั้งหมดที่ร้านนี้มี
        List<Long> productIds = shopProducts.stream()
                .map(ShopProductEntity::getProductId)
                .toList();

        // 3. ไปกวาดข้อมูล Product ส่วนกลางมารวดเดียว! (Query 3)
        // **หมายเหตุ: ตรงนี้ใช้คำสั่ง findByIdIn ที่เราเพิ่งเติมไปใน ProductRepository ครับ**
        List<ProductEntity> allProducts = productRepository.findByIdIn(productIds);

        // จัดกลุ่ม Product ให้ค้นหาใน RAM ได้เร็วๆ
        java.util.Map<Long, ProductEntity> productById = allProducts.stream()
                .collect(java.util.stream.Collectors.toMap(ProductEntity::getId, p -> p));

        // --- 🌟 ประกอบร่างคืนให้ Controller ---
        List<ShopProductReq> result = new ArrayList<>();

        for (ShopProductEntity sp : shopProducts) {
            // ดึงข้อมูลจาก Map ใน RAM
            ProductEntity product = productById.get(sp.getProductId());

            if (product != null) {
                ShopProductReq dto = new ShopProductReq();

                dto.setShopProductID(sp.getId());
                dto.setProductId(product.getId()); // ID สินค้ากลาง
                dto.setName(product.getName());
                dto.setImageUrl(product.getImageUrl());
                dto.setSellingPrice(sp.getSellingPrice());

                result.add(dto);
            }
        }
        return result;
    }

    // 🔥 แก้ไขการลบให้ค้นหาจาก shopId และ productId
    @Transactional // 🌟 ใส่ Transactional ไว้ด้วย ป้องกันข้อมูลพังตอนลบ
    public void deleteProductFromShop(Long shopId, Long productId) {
        // 1. ค้นหาข้อมูลจาก Database (ใช้คำสั่งที่เราเพิ่งเพิ่มไปใน Repository รอบที่แล้ว)
        ShopProductEntity entity = shopProductRepository.findByShopIdAndProductId(shopId, productId)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้านี้ในร้านของคุณ"));

        // 2. สั่งลบข้อมูล
        shopProductRepository.delete(entity);
    }

    public ShopEntity getShopByUserId(Long userId) {
        return shopRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้า กรุณาสร้างร้านก่อน"));
    }
}