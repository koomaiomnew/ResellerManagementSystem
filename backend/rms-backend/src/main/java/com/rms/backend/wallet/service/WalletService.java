package com.rms.backend.wallet.service;

import com.rms.backend.wallet.entity.WalletEntity;
import com.rms.backend.wallet.entity.WalletLogEntity;
import com.rms.backend.wallet.repository.WalletLogRepository;
import com.rms.backend.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class WalletService {

    @Autowired private WalletRepository walletRepository;
    @Autowired private WalletLogRepository walletLogRepository;

    @Transactional
    public void addProfitToReseller(Long userId, Long orderId, BigDecimal profit) {
        // 1. ดึงกระเป๋าเงิน (ถ้าไม่มีให้สร้างใหม่)
        WalletEntity wallet = walletRepository.findById(userId)
                .orElseGet(() -> {
                    WalletEntity newWallet = new WalletEntity();
                    newWallet.setUserId(userId);
                    newWallet.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(newWallet);
                });

        // 2. บวกเงินเข้าไปในยอดคงเหลือ
        wallet.setBalance(wallet.getBalance().add(profit));
        walletRepository.save(wallet);

        // 3. บันทึกประวัติเงินเข้า (Wallet Log)
        WalletLogEntity log = new WalletLogEntity();
        log.setUserId(userId);
        log.setOrderId(orderId);
        log.setAmount(profit);
        walletLogRepository.save(log);
    }
}