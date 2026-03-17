package com.rms.backend.product.service;

import com.rms.backend.product.dto.ProductReq;
import com.rms.backend.product.entity.ProductEntity;
import com.rms.backend.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // แปลง Entity เป็น Dto
    private ProductReq mapToDto(ProductEntity entity) {
        ProductReq dto = new ProductReq();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setImageUrl(entity.getImageUrl());
        dto.setCostPrice(entity.getCostPrice()); // เพิ่ม costPrice ตรงนี้
        dto.setMinPrice(entity.getMinPrice());
        dto.setStock(entity.getStock());
        return dto;
    }

    // GET ALL
    public List<ProductReq> getAllProducts() {
        List<ProductEntity> entities = productRepository.findAll();
        List<ProductReq> dtos = new ArrayList<>();
        for (ProductEntity entity : entities) {
            dtos.add(mapToDto(entity));
        }
        return dtos;
    }

    // GET BY ID
    public ProductReq getProductById(Long id) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้า ID: " + id));
        return mapToDto(entity);
    }

    // CREATE
    public ProductReq createProduct(ProductReq request) {
        ProductEntity entity = new ProductEntity();
        entity.setName(request.getName());
        entity.setImageUrl(request.getImageUrl());
        entity.setCostPrice(request.getCostPrice());
        entity.setMinPrice(request.getMinPrice());
        entity.setStock(request.getStock());

        ProductEntity savedEntity = productRepository.save(entity);
        return mapToDto(savedEntity);
    }

    // UPDATE
    public ProductReq updateProduct(Long id, ProductReq request) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้า ID: " + id));

        entity.setName(request.getName());
        entity.setImageUrl(request.getImageUrl());
        entity.setCostPrice(request.getCostPrice());
        entity.setMinPrice(request.getMinPrice());
        entity.setStock(request.getStock());

        ProductEntity updatedEntity = productRepository.save(entity);
        return mapToDto(updatedEntity);
    }

    // DELETE
    public void deleteProduct(Long id) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้า ID: " + id));
        productRepository.delete(entity);
    }
}