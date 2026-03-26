package com.carhub.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private LocalDate startDate;
    private LocalDate endDate;
    private double totalPrice;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
    

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }

    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public LocalDate getStartDate() { return startDate; }

    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }

    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Car getCar() { return car; }

    public void setCar(Car car) { this.car = car; }

    public double getTotalPrice() {
    return totalPrice;
}

public void setTotalPrice(double totalPrice) {
    this.totalPrice = totalPrice;
}
public BookingStatus getStatus() {
    return status;
}

public void setStatus(BookingStatus status) {
    this.status = status;
}
}
