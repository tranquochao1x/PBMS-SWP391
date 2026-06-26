package com.parking.pbms.repository;

import com.parking.pbms.model.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FloorRepository extends JpaRepository<Floor, Integer> {
    Optional<Floor> findByFloorCode(String floorCode);
}
