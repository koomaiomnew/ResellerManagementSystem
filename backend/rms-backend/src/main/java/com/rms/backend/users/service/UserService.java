package com.rms.backend.users.service;

import com.rms.backend.shops.dto.ShopCreateReq;
import com.rms.backend.shops.entity.ShopEntity;
import com.rms.backend.shops.repository.ShopRepository;
import com.rms.backend.users.dto.AuthReq;
import com.rms.backend.users.dto.UserReq;
import com.rms.backend.users.entity.UserEntity;
import com.rms.backend.users.repository.UserRepository;
import com.rms.backend.security.JwtUtil; // 🌟 1. Import JwtUtil
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // 🌟 1. Import PasswordEncoder
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
public class UserService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // 🌟 2. เรียกใช้ตัวเข้ารหัสผ่าน

    @Autowired
    private JwtUtil jwtUtil; // 🌟 2. เรียกใช้ตัวสร้าง Token

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private UserReq mapToDto(UserEntity entity) {
        UserReq dto = new UserReq();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setRole(entity.getRole());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public UserReq getUserById(Long id) {
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบชื่อผู้ใช้" + id));
        return mapToDto(entity);
    }

    public UserReq createUser(UserReq request) {
        UserEntity entity = new UserEntity();
        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setRole(request.getRole());
        entity.setStatus(request.getStatus());
        entity.setCreatedAt(request.getCreatedAt());

        UserEntity saveUser = userRepository.save(entity);
        return  mapToDto(saveUser);
    }

    public UserReq updateUser(Long id, UserReq request) {
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("ไม่พบชื่อผู้ใช้" + id));
        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setRole(request.getRole());
        entity.setStatus(request.getStatus());
        entity.setCreatedAt(request.getCreatedAt());
        UserEntity saveUser = userRepository.save(entity);
        return  mapToDto(saveUser);
    }

    public void deleteUserById(Long id) {
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("ไม่พบชื่อผู้ใช้" + id));
        userRepository.delete(entity);
    }

    @Transactional
    public UserReq register(AuthReq.RegisterReq req) {
        // 1. เช็คอีเมลซ้ำ
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("อีเมลนี้ถูกใช้งานแล้ว");
        }

        // 2. สร้าง User และตั้งค่าพื้นฐาน
        UserEntity entity = new UserEntity();
        entity.setName(req.getName());
        entity.setEmail(req.getEmail());

        // 🌟 3. อัปเกรด: เข้ารหัสผ่านก่อนบันทึกลง Database ด้วย BCrypt (ระดับ 12)
        entity.setPassword(passwordEncoder.encode(req.getPassword()));

        entity.setRole(req.getRole());

        if ("reseller".equalsIgnoreCase(req.getRole())) {
            entity.setStatus("pending");
        } else {
            entity.setStatus("approved");
        }

        // 3. 🌟 ต้อง SAVE User ก่อนเพื่อให้ได้ ID
        UserEntity savedUser = userRepository.save(entity);

        // 4. จัดการเรื่องร้านค้า (Shop)
        if (req.getItems() != null && !req.getItems().isEmpty()) {
            ShopCreateReq item = req.getItems().get(0);

            if (shopRepository.findByShopSlug(item.getShopSlug()).isPresent()) {
                throw new RuntimeException("ชื่อร้านนี้มีคนใช้แล้ว");
            }
            // สร้าง ShopEntity ใหม่ไปเลย (เพราะเป็นการสมัครสมาชิกใหม่)
            ShopEntity shop = new ShopEntity();
            shop.setUserId(savedUser.getId());
            shop.setShopName(item.getShopName());
            shop.setShopSlug(item.getShopSlug());

            shopRepository.save(shop);
        }

        return mapToDto(savedUser);
    }

    // 🌟 4. เปลี่ยน Return Type เป็น Map เพื่อให้ส่งกลับไปได้ทั้ง Token และ ข้อมูล User
    public Map<String, Object> login(AuthReq.LoginReq req) {
        // หา User
        UserEntity user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("ไม่พบอีเมลนี้ในระบบ"));

        // 🌟 5. อัปเกรด: ใช้ passwordEncoder.matches เพื่อเช็ค Hash รหัสผ่าน
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("รหัสผ่านไม่ถูกต้อง");
        }

        // ดักสถานะตัวแทน
        if ("reseller".equalsIgnoreCase(user.getRole())) {
            if ("pending".equalsIgnoreCase(user.getStatus())) {
                throw new RuntimeException("บัญชีของคุณอยู่ระหว่างรออนุมัติจาก Admin");
            } else if ("rejected".equalsIgnoreCase(user.getStatus())) {
                throw new RuntimeException("บัญชีของคุณถูกปฏิเสธการอนุมัติ");
            }
        }

        // 🌟 6. อัปเกรด: สร้าง JWT Token (ในที่นี้ใช้ Email เป็นตัวอ้างอิงหลัก)
        String token = jwtUtil.generateToken(user.getEmail());

        // 🌟 7. แพ็ค Token และ ข้อมูล User ส่งกลับไปให้หน้าเว็บ
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", token);      // เอาไว้ไปแนบ Header
        response.put("user", mapToDto(user));  // เอาไว้แสดงชื่อบนหน้าเว็บ

        return response;
    }
}