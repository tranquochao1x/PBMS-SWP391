package com.parking.pbms.service.impl;

import com.parking.pbms.dto.CreateAssignmentRequest;
import com.parking.pbms.dto.ReassignStaffRequest;
import com.parking.pbms.dto.StaffAssignmentResponse;
import com.parking.pbms.model.*;
import com.parking.pbms.repository.*;
import com.parking.pbms.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final StaffAssignmentRepository staffAssignmentRepository;
    private final WorkShiftRepository workShiftRepository;
    private final FloorRepository floorRepository;
    private final StaffRepository staffRepository;
    private final AccountRepository accountRepository;
    private final AdminRepository adminRepository;

    @Override
    public List<StaffAssignmentResponse> getAssignments(String dateString) {
        LocalDate date;
        if (dateString != null && !dateString.trim().isEmpty()) {
            try {
                date = LocalDate.parse(dateString.trim());
            } catch (Exception e) {
                date = LocalDate.now();
            }
        } else {
            date = LocalDate.now();
        }

        List<StaffAssignment> assignments = staffAssignmentRepository.findByWorkDate(date);
        return assignments.stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional
    public StaffAssignmentResponse createAssignment(CreateAssignmentRequest request, String adminUsername) {
        // Find admin
        Account adminAccount = accountRepository.findByUsernameIgnoreCase(adminUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản admin: " + adminUsername));
        Admin admin = adminRepository.findByAccountId(adminAccount.getAccountId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ admin tương ứng"));

        // Validate floor existence
        Floor floor = floorRepository.findById(request.floorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tầng: " + request.floorId()));
        WorkShift shift = workShiftRepository.findById(request.shiftId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ca trực: " + request.shiftId()));
        Staff staff = staffRepository.findById(request.staffId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên: " + request.staffId()));

        // Check if staff account is active
        Account staffAccount = accountRepository.findById(staff.getAccountId()).orElse(null);
        if (staffAccount != null && !staffAccount.getStatus().equalsIgnoreCase("ACTIVE")) {
            throw new RuntimeException("Tài khoản của nhân viên này hiện không hoạt động (Trạng thái: " + staffAccount.getStatus() + ")");
        }


        // Check conflicts: Staff already assigned to another position in this shift
        Optional<StaffAssignment> staffConflict = staffAssignmentRepository
                .findFirstByStaffIdAndWorkDateAndShiftIdAndStatusNot(request.staffId(), request.workDate(), request.shiftId(), "CANCELLED");
        if (staffConflict.isPresent()) {
            throw new RuntimeException("Nhân viên này đã được phân công trực ở tầng khác trong cùng ca trực này.");
        }

        StaffAssignment assignment = StaffAssignment.builder()
                .workDate(request.workDate())
                .shiftId(request.shiftId())
                .floorId(request.floorId())
                .staffId(request.staffId())
                .status("ASSIGNED")
                .note(request.note())
                .assignedBy(admin.getAdminId())
                .assignedAt(LocalDateTime.now())
                .build();

        StaffAssignment saved = staffAssignmentRepository.saveAndFlush(assignment);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public StaffAssignmentResponse reassignStaff(Long id, ReassignStaffRequest request) {
        StaffAssignment assignment = staffAssignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân công với ID: " + id));

        if (assignment.getStatus().equalsIgnoreCase("CANCELLED") || assignment.getStatus().equalsIgnoreCase("COMPLETED")) {
            throw new RuntimeException("Không thể đổi ca cho phân công đã hủy hoặc đã kết thúc");
        }

        Staff staff = staffRepository.findById(request.staffId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên thay thế: " + request.staffId()));

        // Check conflicts for the new staff
        Optional<StaffAssignment> staffConflict = staffAssignmentRepository
                .findFirstByStaffIdAndWorkDateAndShiftIdAndStatusNot(request.staffId(), assignment.getWorkDate(), assignment.getShiftId(), "CANCELLED");
        if (staffConflict.isPresent() && !staffConflict.get().getAssignmentId().equals(id)) {
            throw new RuntimeException("Nhân viên thay thế đã được phân công vị trí khác trong cùng ca trực này.");
        }

        assignment.setStaffId(request.staffId());
        assignment.setNote(request.note());
        
        StaffAssignment saved = staffAssignmentRepository.saveAndFlush(assignment);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public StaffAssignmentResponse cancelAssignment(Long id) {
        StaffAssignment assignment = staffAssignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân công với ID: " + id));

        assignment.setStatus("CANCELLED");
        StaffAssignment saved = staffAssignmentRepository.saveAndFlush(assignment);
        return mapToResponse(saved);
    }

    @Override
    public List<Staff> getActiveStaffList() {
        return staffRepository.findAll().stream()
                .filter(s -> s.getStatus().equalsIgnoreCase("ACTIVE"))
                .toList();
    }

    @Override
    public List<WorkShift> getShifts() {
        return workShiftRepository.findAll().stream()
                .filter(w -> w.getStatus().equalsIgnoreCase("ACTIVE"))
                .toList();
    }

    @Override
    public StaffAssignmentResponse getActiveAssignmentForStaff(String staffUsername) {
        Account staffAccount = accountRepository.findByUsernameIgnoreCase(staffUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản nhân viên: " + staffUsername));
        Staff staff = staffRepository.findByAccountId(staffAccount.getAccountId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ nhân viên"));

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDateTime now = LocalDateTime.now();

        List<StaffAssignment> assignments = staffAssignmentRepository
                .findByStaffIdAndWorkDateInAndStatusNot(staff.getStaffId(), List.of(yesterday, today), "CANCELLED");

        StaffAssignment activeAssignment = null;
        StaffAssignment todayAssignment = null;

        for (StaffAssignment assignment : assignments) {
            if (assignment.getWorkDate().equals(today)) {
                todayAssignment = assignment;
            }

            WorkShift shift = workShiftRepository.findById(assignment.getShiftId()).orElse(null);
            if (shift != null) {
                LocalDateTime startDateTime = assignment.getWorkDate().atTime(shift.getStartTime());
                LocalDateTime endDateTime = assignment.getWorkDate().atTime(shift.getEndTime());

                if (shift.getEndTime().isBefore(shift.getStartTime()) || shift.getEndTime().equals(shift.getStartTime())) {
                    endDateTime = endDateTime.plusDays(1);
                }

                if (now.isAfter(startDateTime.minusHours(1)) && now.isBefore(endDateTime.plusHours(1))) {
                    activeAssignment = assignment;
                    break;
                }
            }
        }

        if (activeAssignment == null) {
            activeAssignment = todayAssignment;
        }

        return activeAssignment != null ? mapToResponse(activeAssignment) : null;
    }

    private StaffAssignmentResponse mapToResponse(StaffAssignment assignment) {
        WorkShift shift = workShiftRepository.findById(assignment.getShiftId()).orElse(null);
        Floor floor = floorRepository.findById(assignment.getFloorId()).orElse(null);
        
        String staffCode = "";
        String staffName = "";
        if (assignment.getStaffId() != null) {
            Staff staff = staffRepository.findById(assignment.getStaffId()).orElse(null);
            if (staff != null) {
                staffCode = staff.getStaffCode();
                staffName = staff.getFullName();
            }
        }

        String shiftTime = "";
        if (shift != null) {
            shiftTime = shift.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) + " – " +
                        shift.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        }

        return new StaffAssignmentResponse(
                assignment.getAssignmentId(),
                assignment.getWorkDate(),
                assignment.getShiftId(),
                shift != null ? shift.getShiftCode() : "",
                shift != null ? shift.getShiftName() : "",
                shiftTime,
                assignment.getFloorId(),
                floor != null ? floor.getFloorCode() : "",
                floor != null ? floor.getFloorName() : "",
                assignment.getStaffId(),
                staffCode,
                staffName,
                assignment.getStatus(),
                assignment.getNote(),
                assignment.getAssignedAt()
        );
    }
}
