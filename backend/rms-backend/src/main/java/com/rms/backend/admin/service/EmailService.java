package com.rms.backend.admin.service; // เปลี่ยนเป็น package ของคุณ

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ลบพารามิเตอร์ในวงเล็บออกได้เลย
    public void sendNewOrderAlert() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("asd09899642800@gmail.com");
            message.setTo("asd09899642800@gmail.com");
            message.setSubject("🚨 แจ้งเตือน: มีออเดอร์ใหม่เข้า!");
            message.setText("\n\nมีออเดอร์ใหม่เข้ามาในระบบครับ!");

            mailSender.send(message);
            System.out.println("ส่งอีเมลแจ้งเตือนสำเร็จ!");
        } catch (Exception e) {
            System.err.println("ส่งอีเมลไม่สำเร็จ: " + e.getMessage()); // เพิ่ม e.getMessage() นิดนึงเผื่อไว้ดู error
        }
    }
}