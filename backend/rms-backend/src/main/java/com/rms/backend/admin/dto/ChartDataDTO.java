package com.rms.backend.admin.dto;

import java.math.BigDecimal;

public class ChartDataDTO {
    private String name;
    private BigDecimal sales;
    private BigDecimal profit;

    public ChartDataDTO(String name, BigDecimal sales, BigDecimal profit) {
        this.name = name;
        this.sales = sales;
        this.profit = profit;
    }


    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getSales() { return sales; }
    public void setSales(BigDecimal sales) { this.sales = sales; }
    public BigDecimal getProfit() { return profit; }
    public void setProfit(BigDecimal profit) { this.profit = profit; }
}