package com.rms.backend.shops.dto;

import java.math.BigDecimal;

public class ShopProductReq {
    private Long productId;
    private BigDecimal sellingPrice;

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