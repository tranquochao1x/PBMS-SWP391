package com.parking.pbms.service;

import com.parking.pbms.dto.SlotStatsResponse;

public interface SlotService {
    SlotStatsResponse getSlotStatistics(String dateStr);
    void createFloor(com.parking.pbms.dto.FloorRequest request);
    void updateFloor(Integer floorId, com.parking.pbms.dto.FloorRequest request);
    void deleteFloor(Integer floorId);
}
