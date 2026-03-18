package com.rms.backend.users.service;
import com.rms.backend.users.dto.AuthReq;
import com.rms.backend.users.dto.UserReq;
import com.rms.backend.users.entity.UserEntity;
import com.rms.backend.users.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
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

    public List<UserReq> getAllUsers() {
        List<UserEntity> entitys = userRepository.findAll();
        List<UserReq> dtos = new ArrayList<>();
        for(UserEntity entity : entitys)
            dtos.add(mapToDto(entity));
        return dtos;
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

    public UserReq register(AuthReq.RegisterReq req) {
        // เช็คอีเมลซ้ำ
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("อีเมลนี้ถูกใช้งานแล้ว");
        }

        UserEntity entity = new UserEntity();
        entity.setName(req.getName());
        entity.setEmail(req.getEmail());
        entity.setPassword(req.getPassword());
        entity.setRole(req.getRole());


        if ("reseller".equalsIgnoreCase(req.getRole())) {
            entity.setStatus("pending");
        } else {
            entity.setStatus("approved");
        }

        UserEntity savedUser = userRepository.save(entity);

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
