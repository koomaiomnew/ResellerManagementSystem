package com.rms.backend.product.controller;
import com.rms.backend.product.dto.ProductReq;
import com.rms.backend.product.dto.ProductReqDto;
import com.rms.backend.product.entity.ProductEntity;
import com.rms.backend.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    //Constructor Injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProductReq>> getProducts() {
        List<ProductReq> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ProductReq> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<ProductReq> createProduct(@RequestBody ProductReqDto request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<ProductReq> updateProduct(@PathVariable Long id, @RequestBody ProductReqDto request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductReq> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

}