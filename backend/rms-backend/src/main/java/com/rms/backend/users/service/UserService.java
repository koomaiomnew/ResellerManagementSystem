package com.rms.backend.users.service;
import com.rms.backend.shops.dto.ShopCreateReq;
import com.rms.backend.shops.entity.ShopEntity;
import com.rms.backend.shops.repository.ShopRepository;
import com.rms.backend.users.dto.AuthReq;
import com.rms.backend.users.dto.UserReq;
import com.rms.backend.users.entity.UserEntity;
import com.rms.backend.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private ShopRepository shopRepository;

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

    @Transactional // 🌟 ต้องใส่เพื่อให้ถ้า Shop พัง User ต้องไม่ถูกสร้าง (Rollback)
    public UserReq register(AuthReq.RegisterReq req) {
        // 1. เช็คอีเมลซ้ำ
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("อีเมลนี้ถูกใช้งานแล้ว");
        }

        // 2. สร้าง User และตั้งค่าพื้นฐาน
        UserEntity entity = new UserEntity();
        entity.setName(req.getName());
        entity.setEmail(req.getEmail());
        // 🔒 แนะนำ: entity.setPassword(passwordEncoder.encode(req.getPassword()));
        entity.setPassword(req.getPassword());
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
            shop.setUserId(savedUser.getId()); // 🌟 ตอนนี้ getId() มีค่าแล้ว!
            shop.setShopName(item.getShopName());
            shop.setShopSlug(item.getShopSlug());

            shopRepository.save(shop);
        }

        return mapToDto(savedUser);
    }


    public UserReq login(AuthReq.LoginReq req) {
        // หา User
        UserEntity user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("ไม่พบอีเมลนี้ในระบบ"));

        // เช็ครหัสผ่าน
        if (!user.getPassword().equals(req.getPassword())) {
            throw new RuntimeException("รหัสผ่านไม่ถูกต้อง");
        }

        //ดักสถานะตัวแทน
        if ("reseller".equalsIgnoreCase(user.getRole())) {
            if ("pending".equalsIgnoreCase(user.getStatus())) {
                throw new RuntimeException("บัญชีของคุณอยู่ระหว่างรออนุมัติจาก Admin");
            } else if ("rejected".equalsIgnoreCase(user.getStatus())) {
                throw new RuntimeException("บัญชีของคุณถูกปฏิเสธการอนุมัติ");
            }
        }

        return mapToDto(user);
    }

}
