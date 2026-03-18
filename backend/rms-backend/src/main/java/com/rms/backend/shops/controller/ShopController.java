package com.rms.backend.shops.controller;

import com.rms.backend.shops.dto.ShopProductReq;
import com.rms.backend.shops.entity.ShopEntity;
import com.rms.backend.shops.entity.ShopProductEntity;
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

    @PostMapping("/{shopId}/products")
    public ResponseEntity<?> addProductToShop(@PathVariable Long shopId, @RequestBody ShopProductReq req) {
        try {
            return ResponseEntity.ok(shopService.addProductToShop(shopId, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{shopSlug}")
    public ResponseEntity<?> getShopProductsBySlug(@PathVariable String shopSlug) {
        try {
            return ResponseEntity.ok(shopService.getProductsByShopSlug(shopSlug));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductFromShop(@PathVariable Long id) {
        shopService.deleteProductFromShop(id);
        return ResponseEntity.ok().build();
    }
}