package com.rms.backend.admin.dto;

import java.math.BigDecimal;

public class AdminReq{
    private long totalOrders;         // จำนวนออเดอร์ทั้งหมด
    private BigDecimal totalSales;    // ยอดขายรวม (เงินที่ลูกค้าจ่าย)
    private BigDecimal totalProfit;   // กำไรรวมของตัวแทนทั้งหมด
    private long totalResellers;      // จำนวนตัวแทนในระบบ
    private long totalProducts;       // จำนวนสินค้าที่มีในคลัง


    public AdminReq(long totalOrders, BigDecimal totalSales, BigDecimal totalProfit, long totalResellers, long totalProducts) {
        this.totalOrders = totalOrders;
        this.totalSales = totalSales;
        this.totalProfit = totalProfit;
        this.totalResellers = totalResellers;
        this.totalProducts = totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public BigDecimal getTotalProfit() {
        return totalProfit;
    }

    public void setTotalProfit(BigDecimal totalProfit) {
        this.totalProfit = totalProfit;
    }

    public long getTotalResellers() {
        return totalResellers;
    }

    public void setTotalResellers(long totalResellers) {
        this.totalResellers = totalResellers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }
}