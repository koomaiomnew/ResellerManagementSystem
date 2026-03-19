package com.rms.backend.product.repository;
import com.rms.backend.product.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    //เพื่อใช้งาน  CRUD

}