package com.rms.backend.wallet.repository;

import com.rms.backend.wallet.entity.WalletEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<WalletEntity, Long> {

}