package com.carhub.service;

import com.carhub.model.Booking;
import com.carhub.model.BookingStatus;
import com.carhub.model.Car;
import com.carhub.repository.BookingRepository;
import com.carhub.repository.CarRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final EmailService emailService;

    @Value("${carhub.admin.email:}")
    private String adminEmail;

    public BookingService(BookingRepository bookingRepository,
                          CarRepository carRepository,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.emailService = emailService;
    }

    public Booking createBooking(Long carId, String startDate, String endDate, String userEmail) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        validateBooking(car, start, end);

        Booking booking = new Booking();
        booking.setCar(car);
        booking.setUserEmail(userEmail);
        booking.setStartDate(start);
        booking.setEndDate(end);
        booking.setStatus(BookingStatus.CONFIRMED);

        long days = java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1;
        booking.setTotalPrice(days * car.getPricePerDay());

        Booking savedBooking = bookingRepository.save(booking);
        try {
            sendAdminBookingEmail(savedBooking);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return savedBooking;
    }

    public void validateBooking(Car car, LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        if (startDate.isBefore(today)) {
            throw new RuntimeException("Start date cannot be in past");
        }

        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("End date must be after start date");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(car.getId(), startDate, endDate);
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Car already booked for selected dates");
        }
    }

    @Transactional
    public List<Booking> getUserBookings(String userEmail) {
        updateBookingStatus();
        return bookingRepository.findByUserEmail(userEmail);
    }

    @Transactional
    public List<Booking> getAllBookings() {
        updateBookingStatus();
        return bookingRepository.findAll();
    }

    public Booking cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized cancel request");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public void updateBookingStatus() {
        LocalDate today = LocalDate.now();
        List<Booking> bookings = bookingRepository.findAll();

        for (Booking booking : bookings) {
            if (booking.getStatus() == BookingStatus.CONFIRMED &&
                    booking.getEndDate() != null &&
                    booking.getEndDate().isBefore(today)) {
                booking.setStatus(BookingStatus.COMPLETED);
                bookingRepository.save(booking);
            }
        }
    }

    private void sendAdminBookingEmail(Booking booking) {
        if (adminEmail == null || adminEmail.isBlank()) {
            return;
        }

        String message = "Booking Confirmed\n\n" +
                "User: " + booking.getUserEmail() + "\n" +
                "Car: " + booking.getCar().getBrand() + " " + booking.getCar().getModel() + "\n" +
                "From: " + booking.getStartDate() + "\n" +
                "To: " + booking.getEndDate() + "\n" +
                "Total Price: " + booking.getTotalPrice();

        emailService.sendEmail(adminEmail, "CARHUB Booking Confirmed", message);
    }
}
