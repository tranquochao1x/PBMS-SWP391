package com.parking.pbms.dto;

import java.time.LocalDateTime;

public record SlotResponse(
        Integer slotId,
        String slotCode,
        Integer floorId,
        String floorCode,
        String floorName,
        Integer zoneId,
        String zoneCode,
        String zoneName,
        Integer slotNumber,
        String vehicleType,
        String status,
        String disabledReason,
        LocalDateTime lastUpdatedAt
) {}
