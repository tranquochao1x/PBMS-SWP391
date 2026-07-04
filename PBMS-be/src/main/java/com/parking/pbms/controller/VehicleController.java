package com.parking.pbms.controller;

import com.parking.pbms.dto.ApiResponse;
import com.parking.pbms.dto.VehicleDto;
import com.parking.pbms.dto.VehicleRequest;
import com.parking.pbms.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/my-vehicles")
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getMyVehicles(Principal principal) {
        List<VehicleDto> vehicles = vehicleService.getMyVehicles(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(200, "Lấy danh sách phương tiện thành công", vehicles));
    }

    @PostMapping("/my-vehicles")
    public ResponseEntity<ApiResponse<VehicleDto>> addVehicle(
            @Valid @RequestBody VehicleRequest request,
            Principal principal
    ) {
        VehicleDto vehicle = vehicleService.addVehicle(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Thêm phương tiện thành công", vehicle));
    }

    @PutMapping("/my-vehicles/{id}")
    public ResponseEntity<ApiResponse<VehicleDto>> updateVehicle(
            @PathVariable Integer id,
            @Valid @RequestBody VehicleRequest request,
            Principal principal
    ) {
        VehicleDto vehicle = vehicleService.updateVehicle(principal.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success(200, "Cập nhật phương tiện thành công", vehicle));
    }

    @DeleteMapping("/my-vehicles/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(
            @PathVariable Integer id,
            Principal principal
    ) {
        vehicleService.deleteVehicle(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(200, "Đã xóa phương tiện khỏi danh sách", null));
    }
}
