package com.rms.backend.admin.controller;

import com.rms.backend.admin.dto.AdminResellerReq;
import com.rms.backend.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 1. ดึงข้อมูล Dashboard (ยอดขายรวม, กำไรรวม, จำนวนคน)
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            return ResponseEntity.ok(adminService.getAdminDashboard());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("ไม่สามารถดึงข้อมูล Dashboard ได้: " + e.getMessage());
        }
    }

    // 2. อนุมัติ หรือ ปฏิเสธ ตัวแทนจำหน่าย (TOR 2.1.3)
    // ส่ง JSON เช่น { "status": "อนุมัติแล้ว" }
    @PatchMapping("/resellers/{userId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        adminService.approveReseller(userId, body.get("status"));
        return ResponseEntity.ok("อัปเดตสถานะตัวแทนสำเร็จ");
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> body) { // รับ JSON เช่น {"status": "จัดส่งแล้ว"}
        try {
            String newStatus = body.get("status");
            if (newStatus == null || newStatus.isEmpty()) {
                return ResponseEntity.badRequest().body("กรุณาระบุสถานะ");
            }

            adminService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok("อัปเดตสถานะออเดอร์เป็น '" + newStatus + "' เรียบร้อย");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/reseller")
    public List<AdminResellerReq> getAllResellers() {
        return adminService.getAllUser();
    }
}