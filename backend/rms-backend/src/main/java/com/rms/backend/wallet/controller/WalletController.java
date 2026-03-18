package com.rms.backend.wallet.controller;

import com.rms.backend.wallet.entity.WalletEntity;
import com.rms.backend.wallet.entity.WalletLogEntity;
import com.rms.backend.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    // API สำหรับดึงยอดเงินคงเหลือ
    @GetMapping("/{userId}/balance")
    public ResponseEntity<WalletEntity> getBalance(@PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getWalletByUserId(userId));
    }

    // API สำหรับดึงประวัติรายได้ (Logs)
    @GetMapping("/{userId}/logs")
    public ResponseEntity<List<WalletLogEntity>> getLogs(@PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getWalletLogs(userId));
    }
}