package com.parking.pbms.dto;

public record FloorRequest(
    String floorCode,
    String floorName,
    int totalCarSlots,
    int totalMotorcycleSlots
) {}
