package com.rms.backend.admin.controller;

import com.rms.backend.admin.dto.AdminResellerReq;
import com.rms.backend.admin.service.AdminService;
import com.rms.backend.orders.entity.OrderEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/export-orders")
    public ResponseEntity<StreamingResponseBody> exportOrders(
            @RequestParam("year") int year,
            @RequestParam("month") int month) {

        StreamingResponseBody responseBody = outputStream -> {
            try {
                // โยน OutputStream ไปให้ Service จัดการเขียนให้เสร็จสรรพ!
                adminService.exportOrdersToCsv(year, month, outputStream);
            } catch (Exception e) {
                System.err.println("❌ เกิดข้อผิดพลาดตอน Stream ข้อมูล: " + e.getMessage());
                e.printStackTrace();
            }
        };

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=orders_" + year + "_" + month + ".csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
                .body(responseBody);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            return ResponseEntity.ok(adminService.getAdminDashboard());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("ไม่สามารถดึงข้อมูล Dashboard ได้: " + e.getMessage());
        }
    }

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

    @GetMapping("/resellers")
    public List<AdminResellerReq> getAllResellers() {
        return adminService.getAllUser();
    }


}