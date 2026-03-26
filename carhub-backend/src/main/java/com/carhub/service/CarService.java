package com.carhub.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.carhub.dto.CarDTO;
import com.carhub.model.Car;
import com.carhub.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public CarDTO addCar(Car car) {
        Car saved = carRepository.save(car);
        return mapToDTO(saved);
    }
    public void deleteCar(Long id){

    if(!carRepository.existsById(id)){
        throw new RuntimeException("Car not found");
    }

    carRepository.deleteById(id);
}

    public Page<CarDTO> getAllCars(int page, int size, String sortBy, String direction) {

    Sort sort = direction.equalsIgnoreCase("desc") ?
            Sort.by(sortBy).descending() :
            Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);

    return carRepository.findAll(pageable)
            .map(this::mapToDTO);
    }

    public List<CarDTO> getAvailableCars(String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return carRepository.findAvailableForDateRange(start, end)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<CarDTO> searchCars(String brand, String fuelType, Double minPrice, Double maxPrice) {
        List<Car> results = carRepository.searchCars(
                (brand != null && !brand.isBlank()) ? brand : null,
                (fuelType != null && !fuelType.isBlank()) ? fuelType : null,
                minPrice,
                maxPrice
        );
        return results.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private CarDTO mapToDTO(Car car) {
        return new CarDTO(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getFuelType(),
                car.getPricePerDay(),
                car.isAvailable(),
                car.getImageUrl()
        );
    }
}
