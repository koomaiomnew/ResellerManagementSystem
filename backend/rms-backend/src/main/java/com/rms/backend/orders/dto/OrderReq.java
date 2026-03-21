package com.rms.backend.orders.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderReq {
    private Long shopId;
    private String customerName;
    private String address;
    private String phone;
    private List<OrderItemReq> items;

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<OrderItemReq> getItems() {
        return items;
    }

    public void setItems(List<OrderItemReq> items) {
        this.items = items;
    }
}