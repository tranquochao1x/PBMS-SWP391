package com.parking.pbms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSupportRequest(
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
    String subject,

    @NotBlank(message = "Nội dung không được để trống")
    String description,

    @NotBlank(message = "Loại yêu cầu không được để trống")
    String requestType
) {}
