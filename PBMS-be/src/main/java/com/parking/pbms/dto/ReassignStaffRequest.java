package com.parking.pbms.dto;

import jakarta.validation.constraints.NotNull;

public record ReassignStaffRequest(
    @NotNull(message = "Nhân viên thay thế không được để trống")
    Integer staffId,

    @NotNull(message = "Lý do thay đổi không được để trống")
    String note
) {}
