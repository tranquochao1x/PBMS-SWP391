package com.parking.pbms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "StaffAssignments", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AssignmentID")
    private Long assignmentId;

    @Column(name = "StaffID")
    private Integer staffId;



    @Column(name = "FloorID", nullable = false)
    private Integer floorId;

    @Column(name = "ShiftID", nullable = false)
    private Integer shiftId;

    @Column(name = "WorkDate", nullable = false)
    private LocalDate workDate;

    @Column(name = "Status", nullable = false, length = 20)
    private String status;

    @Column(name = "Note", length = 500)
    private String note;

    @Column(name = "AssignedBy")
    private Integer assignedBy;

    @Column(name = "AssignedAt", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "StartedAt")
    private LocalDateTime startedAt;

    @Column(name = "EndedAt")
    private LocalDateTime endedAt;
}
