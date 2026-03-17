package com.rms.backend.wallet.repository;

import com.rms.backend.wallet.entity.WalletLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WalletLogRepository extends JpaRepository<WalletLogEntity, Long> {
    List<WalletLogEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
}