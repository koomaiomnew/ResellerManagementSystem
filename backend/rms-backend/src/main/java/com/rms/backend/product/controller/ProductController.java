package com.rms.backend.product.controller;

import com.rms.backend.product.dto.ProductReq;
import com.rms.backend.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductReq>> getProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductReq> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductReq> createProduct(@RequestBody ProductReq request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    // 🔥 เปลี่ยนเป็น PUT สำหรับการ Update
    @PutMapping("/{id}")
    public ResponseEntity<ProductReq> updateProduct(@PathVariable Long id, @RequestBody ProductReq request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}