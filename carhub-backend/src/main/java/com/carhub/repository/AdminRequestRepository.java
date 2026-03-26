package com.carhub.repository;

import com.carhub.model.AdminRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminRequestRepository extends JpaRepository<AdminRequest, Long> {
    Optional<AdminRequest> findByToken(String token);
    List<AdminRequest> findAll();
}
