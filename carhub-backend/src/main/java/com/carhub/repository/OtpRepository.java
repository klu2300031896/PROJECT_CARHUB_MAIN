package com.carhub.repository;

import com.carhub.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findFirstByEmailAndCodeOrderByExpiryDesc(String email, String code);
    Optional<Otp> findFirstByEmailOrderByExpiryDesc(String email);

    @Modifying
    @Transactional
    @Query("delete from Otp o where o.email = :email")
    void deleteByEmail(@Param("email") String email);
}
