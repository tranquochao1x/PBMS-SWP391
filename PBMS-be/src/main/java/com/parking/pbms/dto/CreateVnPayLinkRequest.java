package com.parking.pbms.dto;

import lombok.Data;

@Data
public class CreateVnPayLinkRequest {
    private Long orderCode;
    private Integer amount;
    private String description;
    private String returnUrl;
    private String cancelUrl;
}
