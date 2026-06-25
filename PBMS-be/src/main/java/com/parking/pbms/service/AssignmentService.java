package com.parking.pbms.service;

import com.parking.pbms.dto.CreateAssignmentRequest;
import com.parking.pbms.dto.ReassignStaffRequest;
import com.parking.pbms.dto.StaffAssignmentResponse;
import com.parking.pbms.model.Staff;
import com.parking.pbms.model.WorkShift;
import java.util.List;

public interface AssignmentService {
    List<StaffAssignmentResponse> getAssignments(String dateString);
    StaffAssignmentResponse createAssignment(CreateAssignmentRequest request, String adminUsername);
    StaffAssignmentResponse reassignStaff(Long id, ReassignStaffRequest request);
    StaffAssignmentResponse cancelAssignment(Long id);
    List<Staff> getActiveStaffList();
    List<WorkShift> getShifts();
    StaffAssignmentResponse getActiveAssignmentForStaff(String staffUsername);
}
