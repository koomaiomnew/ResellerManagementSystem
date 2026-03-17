package com.rms.backend.shops.service;

import com.rms.backend.product.repository.ProductRepository;
import com.rms.backend.product.entity.ProductEntity;
import com.rms.backend.shops.dto.ShopProductReq;
import com.rms.backend.shops.dto.ShopProductRes;
import com.rms.backend.shops.entity.ShopEntity;
import com.rms.backend.shops.entity.ShopProductEntity;
import com.rms.backend.shops.repository.ShopProductRepository;
import com.rms.backend.shops.repository.ShopRepository;
import com.rms.backend.users.entity.UserEntity;
import com.rms.backend.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ShopProductRepository shopProductRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository  userRepository;


    public ShopEntity createShop(ShopEntity shopEntity) {
        UserEntity user = userRepository.findById(shopEntity.getUserId())
                .orElseThrow(() -> new RuntimeException("ไม่พบ User นี้"));

        if (!"approved".equals(user.getStatus())) {
            throw new RuntimeException("บัญชีของคุณยังไม่ได้รับการอนุมัติ ไม่สามารถเปิดร้านได้");
        }
        return shopRepository.save(shopEntity);
    }

    public ShopProductEntity addProductToShop(Long shopId, ShopProductReq req) {
        ProductEntity product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้าในระบบส่วนกลาง"));

        if (req.getSellingPrice().compareTo(product.getMinPrice()) < 0) {
            throw new RuntimeException("ราคาขายต้องไม่ต่ำกว่าราคาขั้นต่ำ (" + product.getMinPrice() + " บาท)");
        }

        // เช็คว่ามีของชิ้นนี้ในร้านหรือยัง
        return shopProductRepository.findByShopIdAndProductId(shopId, req.getProductId())
                .map(existing -> {
                    existing.setSellingPrice(req.getSellingPrice()); // ถ้ามีแล้ว อัปเดตราคาแทน
                    return shopProductRepository.save(existing);
                })
                .orElseGet(() -> {
                    // ถ้ายังไม่มี ค่อยสร้างใหม่
                    ShopProductEntity shopProduct = new ShopProductEntity();
                    shopProduct.setShopId(shopId);
                    shopProduct.setProductId(req.getProductId());
                    shopProduct.setSellingPrice(req.getSellingPrice());
                    return shopProductRepository.save(shopProduct);
                });
    }

    public List<ShopProductRes> getProductsByShopSlug(String shopSlug) {
        // 1. หาร้านค้าจาก slug
        ShopEntity shop = shopRepository.findByShopSlug(shopSlug)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้า"));

        // 2. ดึงรายการสินค้าในร้าน (shop_products)
        List<ShopProductEntity> shopProducts = shopProductRepository.findByShopId(shop.getId());

        // 3. แปลง Entity เป็น DTO พร้อมดึงข้อมูลสินค้าจากตาราง Product มาใส่
        return shopProducts.stream().map(sp -> {
            // ไปหาข้อมูลสินค้าตัวจริงมา
            ProductEntity p = productRepository.findById(sp.getProductId()).orElse(null);

            return new ShopProductRes(
                    sp.getId(),
                    sp.getProductId(),
                    p != null ? p.getName() : "ไม่พบชื่อสินค้า",
                    p != null ? p.getImageUrl() : null,
                    sp.getSellingPrice(),
                    p != null ? p.getStock() : 0
            );
        }).collect(Collectors.toList());
    }

    public void removeProductFromShop(Long shopId, Long productId) {
        ShopProductEntity item = shopProductRepository.findByShopIdAndProductId(shopId, productId)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้านี้ในร้านค้าของคุณ"));

        shopProductRepository.delete(item);
    }

    public void deleteShop(Long id) {
        if (!shopRepository.existsById(id)) {
            throw new RuntimeException("ไม่พบร้านค้าที่ต้องการลบ");
        }
        shopRepository.deleteById(id);
    }
}