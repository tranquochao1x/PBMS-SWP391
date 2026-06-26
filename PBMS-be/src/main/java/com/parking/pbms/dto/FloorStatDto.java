package com.parking.pbms.dto;

public record FloorStatDto(
    Integer floorId,
    String floorCode,
    String floorName,
    int totalCarSlots,
    int availableCarSlots,
    int occupiedCarSlots,
    int monthlyCarInside,
    int totalMotorcycleSlots,
    int availableMotorcycleSlots,
    int occupiedMotorcycleSlots,
    int monthlyMotorcycleInside
) {}
