package com.parking.pbms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CardGroupRequest(
        @NotBlank(message = "Tên nhóm thẻ không được để trống")
        String groupName,

        @NotBlank(message = "Loại phương tiện không được để trống")
        String vehicleType,

        @NotBlank(message = "Loại vé không được để trống")
        String ticketType,

        @NotNull(message = "Giá tiền không được để trống")
        BigDecimal basePrice,

        Integer defaultDurationDays,

        @NotNull(message = "Đặt trước không được để trống")
        Boolean reservationAllowed,

        String description,

        @NotBlank(message = "Trạng thái không được để trống")
        String status
) {}
