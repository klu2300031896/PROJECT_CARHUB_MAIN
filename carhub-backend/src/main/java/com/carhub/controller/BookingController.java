package com.carhub.controller;

import com.carhub.model.Booking;
import com.carhub.service.BookingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/api/user/book/{carId}")
    public Booking bookCar(@PathVariable Long carId,
                           @RequestParam String startDate,
                           @RequestParam String endDate,
                           Authentication authentication) {
        return bookingService.createBooking(carId, startDate, endDate, authentication.getName());
    }

    @GetMapping("/api/user/bookings")
    public List<Booking> myBookings(Authentication authentication) {
        return bookingService.getUserBookings(authentication.getName());
    }

    @GetMapping("/api/admin/bookings")
    public List<Booking> allBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/api/user/cancel/{bookingId}")
    public Booking cancelBooking(@PathVariable Long bookingId,
                                 Authentication authentication) {
        return bookingService.cancelBooking(bookingId, authentication.getName());
    }
}
