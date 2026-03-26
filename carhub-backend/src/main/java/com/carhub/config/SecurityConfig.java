package com.carhub.config;

import com.carhub.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

.requestMatchers(
"/v3/api-docs/**",
"/swagger-ui/**",
"/swagger-ui.html"
).permitAll()

.requestMatchers("/uploads/**").permitAll()

.requestMatchers("/api/auth/**").permitAll()

.requestMatchers("/api/cars/**").permitAll()

.requestMatchers("/api/admin/confirm-new-admin").permitAll()

.requestMatchers("/api/admin/**").hasRole("ADMIN")

.requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")

.anyRequest().authenticated()

)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
