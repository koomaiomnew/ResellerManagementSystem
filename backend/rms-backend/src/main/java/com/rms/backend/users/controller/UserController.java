package com.rms.backend.users.controller;

import com.rms.backend.users.dto.UserReq;
import com.rms.backend.users.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserReq> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserReq> createUser(@RequestBody UserReq user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    //
    @PutMapping("/{id}")
    public ResponseEntity<UserReq> updateUserById(@PathVariable Long id, @RequestBody UserReq user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok().build();
    }



}