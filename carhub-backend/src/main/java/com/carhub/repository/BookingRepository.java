package com.carhub.repository;

import com.carhub.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmail(String userEmail);

    @Query("""
    SELECT b FROM Booking b
    WHERE b.car.id = :carId
    AND b.status = com.carhub.model.BookingStatus.CONFIRMED
    AND (:startDate <= b.endDate AND :endDate >= b.startDate)
    """)
    List<Booking> findConflictingBookings(Long carId, LocalDate startDate, LocalDate endDate);
}
