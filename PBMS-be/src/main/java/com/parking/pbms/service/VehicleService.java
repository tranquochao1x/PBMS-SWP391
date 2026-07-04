package com.parking.pbms.service;

import com.parking.pbms.dto.VehicleDto;
import com.parking.pbms.dto.VehicleRequest;

import java.util.List;

public interface VehicleService {
    List<VehicleDto> getMyVehicles(String username);
    VehicleDto addVehicle(String username, VehicleRequest request);
    VehicleDto updateVehicle(String username, Integer vehicleId, VehicleRequest request);
    void deleteVehicle(String username, Integer vehicleId);
}
