package com.carhub.controller;

import com.carhub.model.*;
import com.carhub.repository.AdminInviteRepository;
import com.carhub.repository.OtpRepository;
import com.carhub.repository.UserRepository;
import com.carhub.security.JwtUtil;
import com.carhub.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private EmailService emailService;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;
    private final AdminInviteRepository adminInviteRepository;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          OtpRepository otpRepository,
                          JavaMailSender mailSender,
                          AdminInviteRepository adminInviteRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
        this.adminInviteRepository = adminInviteRepository;
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String otpCode = String.format("%06d", new Random().nextInt(999999));
        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setExpiry(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);

        emailService.sendOtp(email, otpCode);
        return "OTP Sent";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody AuthRequest request) {
        if (request.getName() == null || request.getName().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getOtp() == null || request.getOtp().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Invalid request");
        }

        String email = request.getEmail().trim().toLowerCase();
        Otp otp = otpRepository.findFirstByEmailAndCodeOrderByExpiryDesc(email, request.getOtp())
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otp.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);

        otpRepository.deleteByEmail(email);
        otpRepository.delete(otp);

        return "Registration Successful";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        String displayName = (user.getName() == null || user.getName().isBlank())
                ? user.getEmail().split("@")[0]
                : user.getName();
        return new AuthResponse(token, user.getRole().name(), displayName);
    }

    @PostMapping("/forgot-password")
    @Transactional
    public String forgotPassword(@RequestBody AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        String email = request.getEmail().trim().toLowerCase();
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otpCode = String.format("%06d", new Random().nextInt(999999));
        otpRepository.deleteByEmail(email);

        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setExpiry(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);

        emailService.sendEmail(email, "CARHUB Reset Password OTP", "Your OTP is: " + otpCode + "\n\nThis code expires in 5 minutes.");
        return "OTP Sent";
    }

    @PostMapping("/reset-password")
    @Transactional
    public String resetPassword(@RequestBody AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank() ||
                request.getOtp() == null || request.getOtp().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Email, OTP and new password are required");
        }

        String email = request.getEmail().trim().toLowerCase();
        Otp otp = otpRepository.findFirstByEmailOrderByExpiryDesc(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (!otp.getCode().equals(request.getOtp().trim())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (otp.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        otpRepository.deleteByEmail(email);

        return "Password Reset Successful";
    }

    @PostMapping("/api/admin/invite")
    public String inviteAdmin(@RequestParam String email, Authentication auth) {
        String adminEmail = auth.getName();

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Not authorized");
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }

        String token = java.util.UUID.randomUUID().toString();
        AdminInvite invite = new AdminInvite();
        invite.setEmail(email.toLowerCase());
        invite.setToken(token);
        invite.setExpiry(LocalDateTime.now().plusHours(24));
        adminInviteRepository.save(invite);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(adminEmail);
        message.setSubject("CARHUB Admin Approval Needed");
        message.setText("A request to add new admin " + email + " is pending. Confirm: " +
                "http://localhost:8080/api/admin/confirm-new-admin?token=" + token);
        mailSender.send(message);

        return "Invite sent to current admin";
    }

    @GetMapping("/api/admin/confirm-new-admin")
    public String confirmNewAdmin(@RequestParam String token) {
        AdminInvite invite = adminInviteRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (invite.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invite expired");
        }

        if (userRepository.findByEmail(invite.getEmail()).isPresent()) {
            return "Admin already exists";
        }

        String tempPassword = "Admin@" + (100000 + new Random().nextInt(900000));
        User user = new User();
        user.setName("Admin");
        user.setEmail(invite.getEmail());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
        adminInviteRepository.delete(invite);

        return "New admin created with temp password: " + tempPassword;
    }
}
