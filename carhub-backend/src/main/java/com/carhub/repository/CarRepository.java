package com.carhub.repository;

import com.carhub.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Query("SELECT c FROM Car c WHERE c.available = true")
    List<Car> findAllAvailable();

    @Query("SELECT c FROM Car c WHERE c.available = true AND c.id NOT IN (" +
            "SELECT b.car.id FROM Booking b WHERE :startDate <= b.endDate AND :endDate >= b.startDate)")
    List<Car> findAvailableForDateRange(@Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("SELECT c FROM Car c WHERE " +
            "(:brand IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :brand, '%')) OR LOWER(c.model) LIKE LOWER(CONCAT('%', :brand, '%'))) " +
            "AND (:fuelType IS NULL OR LOWER(c.fuelType) = LOWER(:fuelType)) " +
            "AND (:minPrice IS NULL OR c.pricePerDay >= :minPrice) " +
            "AND (:maxPrice IS NULL OR c.pricePerDay <= :maxPrice)")
    List<Car> searchCars(@Param("brand") String brand,
                         @Param("fuelType") String fuelType,
                         @Param("minPrice") Double minPrice,
                         @Param("maxPrice") Double maxPrice);
}
