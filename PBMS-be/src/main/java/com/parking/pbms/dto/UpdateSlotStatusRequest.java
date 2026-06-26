package com.parking.pbms.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateSlotStatusRequest(
        @NotBlank(message = "Trạng thái không được để trống")
        String status,

        String disabledReason
) {}
