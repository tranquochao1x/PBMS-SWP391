package com.parking.pbms.dto;

import jakarta.validation.constraints.NotBlank;

public record ConfirmPasswordRequest(
        @NotBlank(message = "Mat khau hien tai khong duoc de trong")
        String password
) {
}
