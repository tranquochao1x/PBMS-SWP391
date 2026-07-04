package com.parking.pbms.dto;

public record VehicleDto(
        Integer id,
        String plateNo,
        String vehicleType,
        String brand,
        String model,
        String color
) {}
