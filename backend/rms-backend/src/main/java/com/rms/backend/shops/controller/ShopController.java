package com.rms.backend.shops.controller;

import com.rms.backend.shops.dto.ShopProductReq;
import com.rms.backend.shops.entity.ShopEntity;
import com.rms.backend.shops.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping
    public ResponseEntity<List<ShopEntity>> findAll() {
        return ResponseEntity.ok(shopService.getAllShop());
    }

    @PostMapping
    public ResponseEntity<?> createShop(@RequestBody ShopEntity shopEntity) {
        try {
            return ResponseEntity.ok(shopService.createShop(shopEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{shopId}/products")
    public ResponseEntity<?> updateShop(@PathVariable Long shopId, @RequestBody ShopProductReq entity ) {
        return ResponseEntity.ok(shopService.updateShopProduct(shopId,entity));
    }

    @PostMapping("/{shopId}/products")
    public ResponseEntity<?> addProductToShop(
            @PathVariable Long shopId,
            @RequestBody ShopProductReq req) {
        try {
            return ResponseEntity.ok(shopService.addProductToShop(shopId, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/slug/{shopSlug}")
    public ResponseEntity<?> getShopProductsBySlug(@PathVariable String shopSlug) {
        try {
            return ResponseEntity.ok(shopService.getProductsByShopSlug(shopSlug));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔥 แก้ไข Path ให้รับ shopId และ productId
    @DeleteMapping("/{shopId}/products/{productId}")
    public ResponseEntity<?> deleteProductFromShop(@PathVariable Long shopId, @PathVariable Long productId) {
        try {
            shopService.deleteProductFromShop(shopId, productId);
            return ResponseEntity.ok("ลบสินค้าออกจากร้านเรียบร้อยแล้ว");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity<?> getMyShop(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(shopService.getShopByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}