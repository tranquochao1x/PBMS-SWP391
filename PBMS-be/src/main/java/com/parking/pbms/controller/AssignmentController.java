package com.parking.pbms.controller;

import com.parking.pbms.dto.ApiResponse;
import com.parking.pbms.dto.CreateAssignmentRequest;
import com.parking.pbms.dto.ReassignStaffRequest;
import com.parking.pbms.dto.StaffAssignmentResponse;
import com.parking.pbms.model.Staff;
import com.parking.pbms.model.WorkShift;
import com.parking.pbms.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StaffAssignmentResponse>>> getAssignments(
            @RequestParam(value = "date", required = false) String date
    ) {
        List<StaffAssignmentResponse> list = assignmentService.getAssignments(date);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy danh sách phân công thành công", list)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StaffAssignmentResponse>> createAssignment(
            @Valid @RequestBody CreateAssignmentRequest request,
            Principal principal
    ) {
        String adminUsername = principal.getName();
        StaffAssignmentResponse response = assignmentService.createAssignment(request, adminUsername);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Tạo phân công nhân viên thành công", response)
        );
    }

    @PutMapping("/{id}/staff")
    public ResponseEntity<ApiResponse<StaffAssignmentResponse>> reassignStaff(
            @PathVariable("id") Long id,
            @Valid @RequestBody ReassignStaffRequest request
    ) {
        StaffAssignmentResponse response = assignmentService.reassignStaff(id, request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Đổi nhân viên thay thế thành công", response)
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<StaffAssignmentResponse>> cancelAssignment(
            @PathVariable("id") Long id
    ) {
        StaffAssignmentResponse response = assignmentService.cancelAssignment(id);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Hủy phân công nhân viên thành công", response)
        );
    }

    @GetMapping("/staff-list")
    public ResponseEntity<ApiResponse<List<Staff>>> getActiveStaffList() {
        List<Staff> list = assignmentService.getActiveStaffList();
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy danh sách nhân viên hoạt động thành công", list)
        );
    }

    @GetMapping("/shifts")
    public ResponseEntity<ApiResponse<List<WorkShift>>> getShifts() {
        List<WorkShift> list = assignmentService.getShifts();
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy danh sách ca trực thành công", list)
        );
    }
}
