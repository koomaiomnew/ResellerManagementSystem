package com.rms.backend.wallet.service;

import com.rms.backend.wallet.entity.WalletEntity;
import com.rms.backend.wallet.entity.WalletLogEntity;
import com.rms.backend.wallet.repository.WalletLogRepository;
import com.rms.backend.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WalletService {
    @Autowired private WalletRepository walletRepository;
    @Autowired private WalletLogRepository walletLogRepository;

    // ฟังก์ชันเพิ่มเงินให้ตัวแทน (เรียกใช้ตอนสั่งซื้อสำเร็จ)
    public void addProfitToReseller(Long userId, Long orderId, BigDecimal profitAmount) {
        if (profitAmount.compareTo(BigDecimal.ZERO) > 0) {
            WalletEntity wallet = walletRepository.findById(userId).orElse(new WalletEntity());
            if (wallet.getUserId() == null) {
                wallet.setUserId(userId);
                wallet.setBalance(BigDecimal.ZERO);
            }

            wallet.setBalance(wallet.getBalance().add(profitAmount));
            walletRepository.save(wallet);

            WalletLogEntity log = new WalletLogEntity();
            log.setUserId(userId);
            log.setOrderId(orderId);
            log.setAmount(profitAmount);
            walletLogRepository.save(log);
        }
    }

    public WalletEntity getWalletByUserId(Long userId) {
        return walletRepository.findById(userId)
                .orElseGet(() -> {
                    // ถ้ายังไม่มีกระเป๋า (กรณีสมัครใหม่) ให้สร้างก้อนใหม่ยอด 0 ให้เลย
                    WalletEntity newWallet = new WalletEntity();
                    newWallet.setUserId(userId);
                    newWallet.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(newWallet);
                });
    }

    public List<WalletLogEntity> getWalletLogs(Long userId) {
        return walletLogRepository.findByUserId(userId);
    }
}