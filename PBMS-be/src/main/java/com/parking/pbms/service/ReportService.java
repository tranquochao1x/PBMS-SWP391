package com.parking.pbms.service;

import com.parking.pbms.dto.VehicleReportResponse;
import java.time.LocalDateTime;
import java.util.List;

public interface ReportService {
    List<VehicleReportResponse> getVehicleReport(
            String tab,
            String keyword,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Integer staffId,
            String ticketType
    );
}
