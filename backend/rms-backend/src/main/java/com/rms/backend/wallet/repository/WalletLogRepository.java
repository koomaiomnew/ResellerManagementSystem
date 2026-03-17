package com.rms.backend.wallet.repository;

import com.rms.backend.wallet.entity.WalletLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletLogRepository extends JpaRepository<WalletLogEntity, Long> { }