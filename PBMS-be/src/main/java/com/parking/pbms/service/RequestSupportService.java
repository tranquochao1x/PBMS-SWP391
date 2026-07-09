package com.parking.pbms.service;

import com.parking.pbms.dto.CreateSupportRequest;
import com.parking.pbms.dto.RequestResponse;
import java.util.List;

public interface RequestSupportService {
    List<RequestResponse> getMyRequests(String username);
    List<RequestResponse> getAllRequests();
    RequestResponse createRequest(CreateSupportRequest request, String username);
    RequestResponse approveRequest(Long requestId, String adminNote);
    RequestResponse rejectRequest(Long requestId, String adminNote);
    RequestResponse assignStaff(Long requestId, Integer staffId);
}
