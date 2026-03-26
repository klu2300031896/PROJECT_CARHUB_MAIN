package com.carhub.dto;

public class CarDTO {

    private Long id;
    private String brand;
    private String model;
    private String fuelType;
    private double pricePerDay;
    private boolean available;
    private String imageUrl;

    public CarDTO() {}

    public CarDTO(Long id, String brand, String model,
                  String fuelType, double pricePerDay, boolean available, String imageUrl) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.fuelType = fuelType;
        this.pricePerDay = pricePerDay;
        this.available = available;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public String getBrand() { return brand; }
    public String getModel() { return model; }
    public String getFuelType() { return fuelType; }
    public double getPricePerDay() { return pricePerDay; }
    public boolean isAvailable() { return available; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}