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

    @PostMapping("/floors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> createFloor(
            @RequestBody com.parking.pbms.dto.FloorRequest request
    ) {
        slotService.createFloor(request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Thêm tầng đỗ xe thành công", null)
        );
    }

    @PutMapping("/floors/{floorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateFloor(
            @PathVariable Integer floorId,
            @RequestBody com.parking.pbms.dto.FloorRequest request
    ) {
        slotService.updateFloor(floorId, request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Cập nhật thông tin tầng đỗ xe thành công", null)
        );
    }
}
