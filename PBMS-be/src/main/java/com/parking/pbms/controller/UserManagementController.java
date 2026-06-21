package com.parking.pbms.controller;

import com.parking.pbms.dto.ApiResponse;
import com.parking.pbms.dto.CreateUserRequest;
import com.parking.pbms.dto.UpdateUserRequest;
import com.parking.pbms.dto.UserResponse;
import com.parking.pbms.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserManagementService userManagementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> list = userManagementService.getAllUsers();
        return ResponseEntity.ok(
                ApiResponse.success(200, "Lấy danh sách người dùng thành công", list)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        UserResponse response = userManagementService.createUser(request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Tạo người dùng mới thành công", response)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable("id") Integer id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        UserResponse response = userManagementService.updateUser(id, request);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Cập nhật người dùng thành công", response)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> deleteUser(
            @PathVariable("id") Integer id
    ) {
        UserResponse response = userManagementService.deleteUser(id);
        return ResponseEntity.ok(
                ApiResponse.success(200, "Khóa tài khoản người dùng thành công", response)
        );
    }
}
