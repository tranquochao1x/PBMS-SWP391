package com.parking.pbms.service;

import com.parking.pbms.dto.CreateUserRequest;
import com.parking.pbms.dto.UpdateUserRequest;
import com.parking.pbms.dto.UserResponse;
import java.util.List;

public interface UserManagementService {
    List<UserResponse> getAllUsers();
    UserResponse createUser(CreateUserRequest request);
    UserResponse updateUser(Integer accountId, UpdateUserRequest request);
    UserResponse deleteUser(Integer accountId);
}
