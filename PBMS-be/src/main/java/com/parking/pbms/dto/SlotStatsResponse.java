package com.parking.pbms.dto;

import java.util.List;

public record SlotStatsResponse(
    int totalCarSlots,
    int totalMotorcycleSlots,
    int monthlyCarInside,
    int monthlyMotorcycleInside,
    List<FloorStatDto> floorStats
) {}
