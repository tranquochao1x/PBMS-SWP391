package com.parking.pbms.service;

import com.parking.pbms.dto.SlotStatsResponse;

public interface SlotService {
    SlotStatsResponse getSlotStatistics(String dateStr);
}
