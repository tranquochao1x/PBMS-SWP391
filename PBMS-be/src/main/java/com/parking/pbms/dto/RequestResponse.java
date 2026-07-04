package com.parking.pbms.dto;

import java.time.LocalDateTime;

public record RequestResponse(
    Long requestId,
    String requestNo,
    String requestType,
    Integer senderAccountId,
    String senderName,
    String senderRole,
    Integer assignedStaffId,
    String assignedStaffName,
    String subject,
    String description,
    String evidenceUrl,
    String priority,
    String status,
    String adminNote,
    LocalDateTime createdAt,
    LocalDateTime processingAt,
    LocalDateTime resolvedAt
) {}
