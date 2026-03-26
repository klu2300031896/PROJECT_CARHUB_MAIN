package com.carhub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private String fuelType;
    private double pricePerDay;
    private boolean available;
    @Column(name = "image_url")
    private String imageUrl;

    // Getters and Setters

    public Long getId() { 
        return id; }

    public void setId(Long id) { 
        this.id = id; }

    public String getBrand() { 
        return brand; }

    public void setBrand(String brand) { 
        this.brand = brand; }

    public String getModel() { 
        return model; }

    public void setModel(String model) { 
        this.model = model; }

    public String getFuelType() { 
        return fuelType; }

    public void setFuelType(String fuelType) { 
        this.fuelType = fuelType; }

    public double getPricePerDay() { 
        return pricePerDay; }

    public void setPricePerDay(double pricePerDay) { 
        this.pricePerDay = pricePerDay; }

    public boolean isAvailable() { 
        return available; }

    public void setAvailable(boolean available) {
         this.available = available; }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
    }
}