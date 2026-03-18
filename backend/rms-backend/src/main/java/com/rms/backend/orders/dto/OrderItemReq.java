package com.rms.backend.orders.dto;

import lombok.Data;

@Data
public class OrderItemReq {
    private Long shopProductId; // รหัสจากตาราง shop_product
    private Integer quantity;

    public Long getShopProductId() {
        return shopProductId;
    }

    public void setShopProductId(Long shopProductId) {
        this.shopProductId = shopProductId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}