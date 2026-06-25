package com.parking.pbms.repository;

import com.parking.pbms.model.StaffAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StaffAssignmentRepository extends JpaRepository<StaffAssignment, Long> {
    List<StaffAssignment> findByWorkDate(LocalDate workDate);
    
    // Find active assignment for a staff member on a specific date (not cancelled)
    Optional<StaffAssignment> findFirstByStaffIdAndWorkDateAndStatusNot(
            Integer staffId,
            LocalDate workDate,
            String status
    );

    List<StaffAssignment> findByStaffIdAndWorkDateInAndStatusNot(
            Integer staffId,
            List<LocalDate> workDates,
            String status
    );


    // Check conflicts for a staff member and shift on a date (not cancelled)
    Optional<StaffAssignment> findFirstByStaffIdAndWorkDateAndShiftIdAndStatusNot(
            Integer staffId,
            LocalDate workDate,
            Integer shiftId,
            String status
    );
}
