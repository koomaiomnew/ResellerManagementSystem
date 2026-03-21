package com.rms.backend.shops.dto;

import com.rms.backend.product.entity.ProductEntity;

import java.math.BigDecimal;

public class ShopProductReq {
    private Long shopProductID;
    private Long productId;
    private BigDecimal sellingPrice;
    private String imageUrl;
    private String name;


    public Long getShopProductID() {
        return shopProductID;
    }

    public void setShopProductID(Long shopProductID) {
        this.shopProductID = shopProductID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }
}