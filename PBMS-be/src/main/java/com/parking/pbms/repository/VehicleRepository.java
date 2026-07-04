package com.parking.pbms.repository;

import com.parking.pbms.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    Optional<Vehicle> findByPlateNo(String plateNo);
    List<Vehicle> findByAccountIdAndStatus(Integer accountId, String status);
    Optional<Vehicle> findByVehicleIdAndAccountId(Integer vehicleId, Integer accountId);
}
