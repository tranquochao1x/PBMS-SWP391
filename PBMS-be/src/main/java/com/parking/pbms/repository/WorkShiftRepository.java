package com.parking.pbms.repository;

import com.parking.pbms.model.WorkShift;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WorkShiftRepository extends JpaRepository<WorkShift, Integer> {
    Optional<WorkShift> findByShiftCode(String shiftCode);
}
