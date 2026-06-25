package com.parking.pbms.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateAssignmentRequest(
    @NotNull(message = "Ngày làm việc không được để trống")
    LocalDate workDate,

    @NotNull(message = "Ca trực không được để trống")
    Integer shiftId,


    @NotNull(message = "Tầng không được để trống")
    Integer floorId,

    @NotNull(message = "Nhân viên không được để trống")
    Integer staffId,

    String note
) {}
