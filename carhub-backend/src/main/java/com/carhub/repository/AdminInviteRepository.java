package com.carhub.repository;

import com.carhub.model.AdminInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminInviteRepository extends JpaRepository<AdminInvite, Long> {
    Optional<AdminInvite> findByToken(String token);
}
