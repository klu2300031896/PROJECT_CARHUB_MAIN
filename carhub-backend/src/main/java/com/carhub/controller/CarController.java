package com.carhub.controller;
import com.carhub.dto.CarDTO;
import org.springframework.data.domain.Page;
import com.carhub.service.CarService;
import com.carhub.model.Car;
import com.carhub.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
public class CarController {

    @Autowired
    private CarService carService;

    @Autowired
    private CarRepository carRepository;

    @PostMapping("/api/admin/cars")
    public CarDTO addCar(@RequestBody Car car) {
        return carService.addCar(car);
    }

    @DeleteMapping("/api/admin/cars/{id}")
    public void deleteCar(@PathVariable Long id){
        carService.deleteCar(id);
    }

    @GetMapping("/api/cars")
    public Page<CarDTO> getAllCars(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "asc") String direction) {

    return carService.getAllCars(page, size, sortBy, direction);
    }

    @GetMapping("/api/cars/available")
    public List<CarDTO> getAvailableCars(@RequestParam String startDate, @RequestParam String endDate) {
        return carService.getAvailableCars(startDate, endDate);
    }

    @GetMapping("/api/cars/search")
    public List<CarDTO> searchCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return carService.searchCars(brand, fuelType, minPrice, maxPrice);
    }

    @PutMapping("/api/admin/cars/{id}")
    public Car updateCar(@PathVariable Long id, @RequestBody Car updatedCar){

    Car car = carRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Car not found"));

    car.setBrand(updatedCar.getBrand());
    car.setModel(updatedCar.getModel());
    car.setFuelType(updatedCar.getFuelType());
    car.setPricePerDay(updatedCar.getPricePerDay());
    car.setAvailable(updatedCar.isAvailable());
    if (updatedCar.getImageUrl() != null && !updatedCar.getImageUrl().isBlank()) {
        car.setImageUrl(updatedCar.getImageUrl());
    }

    return carRepository.save(car);
    }
    @PutMapping("/api/admin/cars/{id}/toggle")
public Car toggleAvailability(@PathVariable Long id){

    Car car = carRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Car not found"));

    car.setAvailable(!car.isAvailable());

    return carRepository.save(car);
}

}