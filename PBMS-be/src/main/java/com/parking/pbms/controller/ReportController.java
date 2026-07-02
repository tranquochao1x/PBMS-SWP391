package com.parking.pbms.controller;

import com.parking.pbms.dto.ApiResponse;
import com.parking.pbms.dto.VehicleReportResponse;
import com.parking.pbms.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/vehicle-entry-exit")
    public ResponseEntity<ApiResponse<List<VehicleReportResponse>>> getVehicleReport(
            @RequestParam(value = "tab", defaultValue = "entry") String tab,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "fromDate", required = false) String fromDate,
            @RequestParam(value = "toDate", required = false) String toDate,
            @RequestParam(value = "staffId", required = false) Integer staffId,
            @RequestParam(value = "ticketType", required = false) String ticketType
    ) {
        LocalDateTime from = null;
        if (fromDate != null && !fromDate.trim().isEmpty()) {
            try {
                from = LocalDate.parse(fromDate.trim()).atStartOfDay();
            } catch (Exception e) {
                // Ignore parse exception, default to null
            }
        }

        LocalDateTime to = null;
        if (toDate != null && !toDate.trim().isEmpty()) {
            try {
                to = LocalDate.parse(toDate.trim()).atTime(23, 59, 59);
            } catch (Exception e) {
                // Ignore parse exception, default to null
            }
        }

        List<VehicleReportResponse> list = reportService.getVehicleReport(
                tab, keyword, from, to, staffId, ticketType
        );

        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy báo cáo xe vào/ra thành công", list)
        );
    }
}
