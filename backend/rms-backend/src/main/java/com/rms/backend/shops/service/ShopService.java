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

import java.util.List;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ShopProductRepository shopProductRepository;

    @Autowired
    private ProductRepository productRepository;


    public ShopEntity createShop(ShopEntity shopEntity) {
        return shopRepository.save(shopEntity);
    }

    public ShopProductEntity addProductToShop(Long shopId, ShopProductReq req) {

        ProductEntity product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้าในระบบส่วนกลาง"));

        if (req.getSellingPrice().compareTo(product.getMinPrice()) < 0) {
            throw new RuntimeException("ราคาขายต้องไม่ต่ำกว่าราคาขั้นต่ำ (" + product.getMinPrice() + " บาท)");
        }

        ShopProductEntity shopProduct = new ShopProductEntity();
        shopProduct.setShopId(shopId);
        shopProduct.setProductId(req.getProductId());
        shopProduct.setSellingPrice(req.getSellingPrice());

        return shopProductRepository.save(shopProduct);
    }

    public List<ShopProductEntity> getProductsByShopSlug(String shopSlug) {
        ShopEntity shop = shopRepository.findByShopSlug(shopSlug)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้านี้"));

        return shopProductRepository.findByShopId(shop.getId());
    }
}