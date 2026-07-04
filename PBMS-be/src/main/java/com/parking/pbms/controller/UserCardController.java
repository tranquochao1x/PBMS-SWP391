package com.parking.pbms.controller;

import com.parking.pbms.dto.ApiResponse;
import com.parking.pbms.dto.MonthlyCardResponse;
import com.parking.pbms.dto.RegisterCardRequest;
import com.parking.pbms.dto.RenewCardRequest;
import com.parking.pbms.model.CardGroup;
import com.parking.pbms.service.UserCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user/monthly-cards")
@RequiredArgsConstructor
public class UserCardController {

    private final UserCardService userCardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MonthlyCardResponse>>> getMyCards(Principal principal) {
        String username = principal.getName();
        List<MonthlyCardResponse> cards = userCardService.getMyCards(username);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy danh sách thẻ thành công", cards)
        );
    }

    @GetMapping("/groups")
    public ResponseEntity<ApiResponse<List<CardGroup>>> getActiveCardGroups() {
        List<CardGroup> groups = userCardService.getActiveCardGroups();
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy danh sách nhóm thẻ hoạt động thành công", groups)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MonthlyCardResponse>> registerCard(
            @Valid @RequestBody RegisterCardRequest request,
            Principal principal
    ) {
        String username = principal.getName();
        MonthlyCardResponse card = userCardService.registerCard(username, request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Đăng ký thẻ thành công", card)
        );
    }

    @PostMapping("/renew")
    public ResponseEntity<ApiResponse<MonthlyCardResponse>> renewCard(
            @Valid @RequestBody RenewCardRequest request,
            Principal principal
    ) {
        String username = principal.getName();
        MonthlyCardResponse card = userCardService.renewCard(username, request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Gia hạn thẻ thành công", card)
        );
    }
}
