package com.parking.pbms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterCardRequest(
        @NotBlank(message = "Nhóm thẻ không được để trống")
        String nhomThe,

        @NotBlank(message = "Biển số xe không được để trống")
        String bienSo,

        String tangGuiXe,

        @NotNull(message = "Thời gian đăng ký không được để trống")
        Integer duration,

        @NotNull(message = "Số tiền không được để trống")
        Double amount,

        @NotNull(message = "Ngày bắt đầu không được để trống")
        java.time.LocalDate startDate
) {}
