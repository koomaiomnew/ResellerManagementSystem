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

        // 🔥 กันสร้างซ้ำ
        if (shopRepository.findByUserId(shopEntity.getUserId()).isPresent()) {
            throw new RuntimeException("คุณมีร้านอยู่แล้ว");
        }

        return shopRepository.save(shopEntity);
    }

    public ShopProductEntity addProductToShop(Long shopId, ShopProductReq req) {

        // 🔥 เช็ค shop มีจริง
        shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้า"));

        ProductEntity product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้า"));

        // 🔥 กันราคาต่ำ
        if (req.getSellingPrice().compareTo(product.getMinPrice()) < 0) {
            throw new RuntimeException("ราคาต่ำกว่าขั้นต่ำ");
        }

        // 🔥 กันเพิ่มซ้ำ
        if (shopProductRepository.existsByShopIdAndProductId(shopId, req.getProductId())) {
            throw new RuntimeException("สินค้านี้มีอยู่ในร้านแล้ว");
        }

        ShopProductEntity sp = new ShopProductEntity();
        sp.setShopId(shopId);
        sp.setProductId(req.getProductId());
        sp.setSellingPrice(req.getSellingPrice());

        return shopProductRepository.save(sp);
    }

    public List<ShopProductReq> getProductsByShopSlug(String shopSlug) {

        ShopEntity shop = shopRepository.findByShopSlug(shopSlug)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้าน"));

        List<ShopProductEntity> shopProducts =
                shopProductRepository.findByShopId(shop.getId());

        List<ShopProductReq> result = new ArrayList<>();

        for (ShopProductEntity sp : shopProducts) {
            ProductEntity product = productRepository.findById(sp.getProductId())
                    .orElseThrow();

            ShopProductReq dto = new ShopProductReq();
            dto.setProductId(product.getId());
            dto.setName(product.getName());
            dto.setImageUrl(product.getImageUrl());
            dto.setSellingPrice(sp.getSellingPrice());

            result.add(dto);
        }

        return result;
    }

    public void deleteProductFromShop(Long id) {
        shopProductRepository.deleteById(id);
    }

    // 🔥 FIX สำคัญ: ไม่ auto create แล้ว
    public ShopEntity getShopByUserId(Long userId) {
        return shopRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้า กรุณาสร้างร้านก่อน"));
    }
}