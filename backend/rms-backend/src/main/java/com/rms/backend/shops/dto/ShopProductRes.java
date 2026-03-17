package com.rms.backend.shops.dto;
import java.math.BigDecimal;

public class ShopProductRes {
    private Long id;            // id ของ shop_products
    private Long productId;     // id ของสินค้า
    private String productName; // ชื่อสินค้า (ดึงมาจากตาราง Product)
    private String imageUrl;    // รูปสินค้า (ดึงมาจากตาราง Product)
    private BigDecimal sellingPrice; // ราคาที่ตัวแทนตั้งเอง
    private Integer stock;      // สต็อกคงเหลือ

    // Constructor, Getters, Setters
    public ShopProductRes(Long id, Long productId, String productName, String imageUrl, BigDecimal sellingPrice, Integer stock) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.sellingPrice = sellingPrice;
        this.stock = stock;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
