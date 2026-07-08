package com.parking.pbms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RenewCardRequest(
        @NotNull(message = "ID thẻ không được để trống")
        Integer cardId,

        @NotBlank(message = "Ngày hết hạn mới không được để trống")
        String newExpiry,

        @NotNull(message = "Thời gian gia hạn không được để trống")
        Integer duration,

        @NotNull(message = "Số tiền không được để trống")
        Double amount
) {}
