package com.parking.pbms.repository;

import com.parking.pbms.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findBySenderAccountIdOrderByCreatedAtDesc(Integer senderAccountId);
    List<Request> findByAssignedStaffIdOrderByCreatedAtDesc(Integer assignedStaffId);
}
