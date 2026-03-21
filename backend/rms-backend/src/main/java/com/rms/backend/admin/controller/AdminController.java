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
            try (Stream<OrderEntity> orderStream = adminService.getOrdersStreamByMonth(year, month);
                 PrintWriter writer = new PrintWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8))) {

                // 1. เขียน BOM กันภาษาไทยเป็นต่างดาวใน Excel
                writer.write('\ufeff');

                // 2. เขียน Header ของ CSV
                writer.println("Order Number,Customer Name,Total Amount,Reseller Profit,Status,Created At");

                // 3. วนลูป Stream ข้อมูล (จะค่อยๆ ดึงมาทีละนิด ไม่โหลด 70,000 แถวลง RAM)
                orderStream.forEach(order -> {
                    writer.println(String.format("%s,%s,%s,%s,%s,%s",
                            order.getOrderNumber(),
                            order.getCustomerName(),
                            order.getTotalAmount(),
                            order.getResellerProfit(),
                            order.getStatus(),
                            order.getCreatedAt()));
                });

                writer.flush();
            }
        };

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=orders_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
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