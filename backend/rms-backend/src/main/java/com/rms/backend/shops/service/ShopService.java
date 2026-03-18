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
import java.util.Optional;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ShopProductRepository shopProductRepository;

    @Autowired
    private ProductRepository productRepository;


    public List<ShopEntity> getAllShop(){
        return shopRepository.findAll();
    }

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

    public List<ShopProductReq> getProductsByShopSlug(String shopSlug) {

        // ค้นหาร้านค้า
        ShopEntity shop = shopRepository.findByShopSlug(shopSlug)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้านี้"));
        // ค้นหารายการสินค้าในร้าน
        List<ShopProductEntity> shopProducts = shopProductRepository.findByShopId(shop.getId());

        List<ShopProductReq> resultList = new ArrayList<>();

        for (ShopProductEntity sp : shopProducts) {
            ShopProductReq dto = new ShopProductReq();
            dto.setProductId(sp.getProductId());
            dto.setSellingPrice(sp.getSellingPrice());

            // วิ่งไปค้นหาข้อมูลสินค้าจากโกดังกลาง (เพื่อเอารูปกับชื่อ)
            Optional<ProductEntity> productOpt = productRepository.findById(sp.getProductId());

            if (productOpt.isPresent()) {
                ProductEntity product = productOpt.get();
                dto.setImageUrl(product.getImageUrl());
                dto.setName(product.getName());
            }
            resultList.add(dto);
        }

        return resultList;
    }

    public void deleteProductFromShop(Long productId) {
        shopProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้านี้ในร้าน"));
        shopProductRepository.deleteById(productId);
    }
}