package com.parking.pbms.controller;

import com.parking.pbms.dto.ApiResponse;
import com.parking.pbms.dto.SlotStatsResponse;
import com.parking.pbms.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/slots")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class SlotController {

    private final SlotService slotService;

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<SlotStatsResponse>> getSlotStatistics(
            @RequestParam(value = "date", required = false) String date
    ) {
        SlotStatsResponse stats = slotService.getSlotStatistics(date);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy thống kê slot đỗ xe thành công", stats)
        );
    }
}
