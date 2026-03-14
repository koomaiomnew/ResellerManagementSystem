package com.rms.backend.repository;

import com.rms.backend.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {  //เพื่อใช้งาน  CRUD

}