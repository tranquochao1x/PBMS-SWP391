package com.parking.pbms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record StaffAssignmentResponse(
    Long assignmentId,
    LocalDate workDate,
    Integer shiftId,
    String shiftCode,
    String shiftName,
    String shiftTime,
    Integer floorId,
    String floorCode,
    String floorName,
    Integer staffId,
    String staffCode,
    String staffName,
    String status,
    String note,
    LocalDateTime assignedAt
) {}
