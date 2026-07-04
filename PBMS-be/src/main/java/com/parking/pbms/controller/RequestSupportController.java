package com.parking.pbms.controller;

import com.parking.pbms.dto.ApiResponse;
import com.parking.pbms.dto.CreateSupportRequest;
import com.parking.pbms.dto.RequestResponse;
import com.parking.pbms.service.RequestSupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RequestSupportController {

    private final RequestSupportService requestSupportService;

    @GetMapping("/support/my")
    @PreAuthorize("hasAnyRole('USER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<RequestResponse>>> getMyRequests(Principal principal) {
        List<RequestResponse> list = requestSupportService.getMyRequests(principal.getName());
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy danh sách yêu cầu hỗ trợ thành công", list)
        );
    }

    @PostMapping("/support/my")
    @PreAuthorize("hasAnyRole('USER', 'STAFF')")
    public ResponseEntity<ApiResponse<RequestResponse>> createRequest(
            @Valid @RequestBody CreateSupportRequest request,
            Principal principal
    ) {
        RequestResponse response = requestSupportService.createRequest(request, principal.getName());
        return ResponseEntity.ok(
                ApiResponse.success(200, "Gửi yêu cầu hỗ trợ thành công", response)
        );
    }

    @GetMapping("/admin/requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RequestResponse>>> getAllRequests() {
        List<RequestResponse> list = requestSupportService.getAllRequests();
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy toàn bộ danh sách yêu cầu thành công", list)
        );
    }

    @PostMapping("/admin/requests/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RequestResponse>> approveRequest(
            @PathVariable("id") Long requestId,
            @RequestParam(value = "note", required = false, defaultValue = "") String note
    ) {
        RequestResponse response = requestSupportService.approveRequest(requestId, note);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Duyệt yêu cầu thành công", response)
        );
    }

    @PostMapping("/admin/requests/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RequestResponse>> rejectRequest(
            @PathVariable("id") Long requestId,
            @RequestParam(value = "note", required = false, defaultValue = "") String note
    ) {
        RequestResponse response = requestSupportService.rejectRequest(requestId, note);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Từ chối yêu cầu thành công", response)
        );
    }

    @PostMapping("/admin/requests/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RequestResponse>> assignStaff(
            @PathVariable("id") Long requestId,
            @RequestParam("staffId") Integer staffId
    ) {
        RequestResponse response = requestSupportService.assignStaff(requestId, staffId);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Phân công nhân viên xử lý thành công", response)
        );
    }
}
