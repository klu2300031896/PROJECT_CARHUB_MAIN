package com.carhub.controller;

import com.carhub.model.AdminRequest;
import com.carhub.model.Role;
import com.carhub.model.User;
import com.carhub.repository.AdminRequestRepository;
import com.carhub.repository.BookingRepository;
import com.carhub.repository.CarRepository;
import com.carhub.repository.UserRepository;
import com.carhub.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AdminRequestRepository adminRequestRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(){
        Map<String,Object> stats = new HashMap<>();
        stats.put("totalCars", carRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        return stats;
    }

    @PostMapping("/request-admin")
    public String requestAdmin(@RequestParam String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "User already exists";
        }

        String token = UUID.randomUUID().toString();

        AdminRequest req = new AdminRequest();
        req.setEmail(email);
        req.setToken(token);
        req.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        adminRequestRepository.save(req);

        String link = "http://localhost:8080/api/admin/confirm-admin?token=" + token;
        emailService.sendEmail(email, "CARHUB Admin Approval", "Click below to become admin:\n" + link);

        return "Approval email sent";
    }

    @GetMapping("/confirm-admin")
    public String confirmAdmin(@RequestParam String token) {
        AdminRequest req = adminRequestRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (req.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "Token expired";
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode("admin123"));
        user.setRole(Role.ADMIN);
        userRepository.save(user);

        return "Admin Created Successfully";
    }

    @GetMapping("/pending-admins")
    public List<AdminRequest> getPendingAdmins() {
        return adminRequestRepository.findAll();
    }

    @PostMapping("/approve-admin")
    public String approveAdmin(@RequestParam Long id) {
        AdminRequest req = adminRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode("admin123"));
        user.setRole(Role.ADMIN);
        userRepository.save(user);

        adminRequestRepository.delete(req);
        return "Admin Approved";
    }

    @PostMapping("/reject-admin")
    public String rejectAdmin(@RequestParam Long id) {
        adminRequestRepository.deleteById(id);
        return "Request Rejected";
    }
}
