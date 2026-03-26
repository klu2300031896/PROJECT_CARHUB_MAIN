package com.carhub.config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class BookingSchemaInitializer {

    private final JdbcTemplate jdbcTemplate;

    public BookingSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void ensureBookingStatusColumnSupportsCompleted() {
        try {
            jdbcTemplate.execute("ALTER TABLE bookings MODIFY COLUMN status VARCHAR(20)");
        } catch (Exception ignored) {
            // Ignore if the schema is already compatible or the table is not ready yet.
        }
    }
}
