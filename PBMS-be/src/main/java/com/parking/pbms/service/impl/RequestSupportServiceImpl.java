package com.parking.pbms.service.impl;

import com.parking.pbms.dto.CreateSupportRequest;
import com.parking.pbms.dto.RequestResponse;
import com.parking.pbms.model.Account;
import com.parking.pbms.model.Request;
import com.parking.pbms.model.Staff;
import com.parking.pbms.repository.AccountRepository;
import com.parking.pbms.repository.RequestRepository;
import com.parking.pbms.repository.StaffRepository;
import com.parking.pbms.service.RequestSupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestSupportServiceImpl implements RequestSupportService {

    private final RequestRepository requestRepository;
    private final AccountRepository accountRepository;
    private final StaffRepository staffRepository;

    @Override
    public List<RequestResponse> getMyRequests(String username) {
        Account account = accountRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + username));
        List<Request> list = requestRepository.findBySenderAccountIdOrderByCreatedAtDesc(account.getAccountId());
        return list.stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<RequestResponse> getAllRequests() {
        List<Request> list = requestRepository.findAll();
        return list.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public RequestResponse createRequest(CreateSupportRequest request, String username) {
        Account account = accountRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + username));

        Request req = Request.builder()
                .subject(request.subject().trim())
                .description(request.description().trim())
                .requestType(request.requestType().trim())
                .senderAccountId(account.getAccountId())
                .priority("NORMAL")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Request saved = requestRepository.saveAndFlush(req);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public RequestResponse approveRequest(Long requestId, String adminNote) {
        Request req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu hỗ trợ với ID: " + requestId));

        req.setStatus("RESOLVED");
        req.setAdminNote(adminNote);
        req.setResolvedAt(LocalDateTime.now());
        req.setUpdatedAt(LocalDateTime.now());

        Request saved = requestRepository.saveAndFlush(req);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public RequestResponse rejectRequest(Long requestId, String adminNote) {
        Request req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu hỗ trợ với ID: " + requestId));

        req.setStatus("REJECTED");
        req.setAdminNote(adminNote);
        req.setResolvedAt(LocalDateTime.now());
        req.setUpdatedAt(LocalDateTime.now());

        Request saved = requestRepository.saveAndFlush(req);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public RequestResponse assignStaff(Long requestId, Integer staffId) {
        Request req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu hỗ trợ với ID: " + requestId));

        req.setStatus("PROCESSING");
        req.setAssignedStaffId(staffId);
        req.setProcessingAt(LocalDateTime.now());
        req.setUpdatedAt(LocalDateTime.now());

        Request saved = requestRepository.saveAndFlush(req);
        return mapToResponse(saved);
    }

    private RequestResponse mapToResponse(Request req) {
        String senderName = "";
        String senderRole = "";
        if (req.getSenderAccountId() != null) {
            Account acc = accountRepository.findById(req.getSenderAccountId()).orElse(null);
            if (acc != null) {
                senderName = acc.getFullName();
                senderRole = acc.getRoleName();
            }
        }

        String staffName = "";
        if (req.getAssignedStaffId() != null) {
            Staff s = staffRepository.findById(req.getAssignedStaffId()).orElse(null);
            if (s != null) {
                staffName = s.getFullName();
            }
        }

        return new RequestResponse(
                req.getRequestId(),
                req.getRequestNo(),
                req.getRequestType(),
                req.getSenderAccountId(),
                senderName,
                senderRole,
                req.getAssignedStaffId(),
                staffName,
                req.getSubject(),
                req.getDescription(),
                req.getEvidenceUrl(),
                req.getPriority(),
                req.getStatus(),
                req.getAdminNote(),
                req.getCreatedAt(),
                req.getProcessingAt(),
                req.getResolvedAt()
        );
    }
}
