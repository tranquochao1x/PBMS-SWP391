package com.parking.pbms.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresInMs,
        Integer accountId,
        String username,
        String fullName,
        String role
) {
}
