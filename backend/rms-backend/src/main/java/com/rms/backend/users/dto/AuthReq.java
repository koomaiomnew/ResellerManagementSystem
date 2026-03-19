package com.rms.backend.users.dto;

import com.rms.backend.orders.dto.OrderItemReq;
import com.rms.backend.shops.dto.ShopCreateReq;

import java.util.List;

public class AuthReq {

    // คลาสสำหรับรับข้อมูลตอนสมัครสมาชิก
    public static class RegisterReq {
        private String name;
        private String email;
        private String password;
        private String role;
        private List<ShopCreateReq>items;
        // 'admin' หรือ 'reseller


        public List<ShopCreateReq> getItems() {
            return items;
        }

        public void setItems(List<ShopCreateReq> items) {
            this.items = items;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class LoginReq {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}