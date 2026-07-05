package com.parking.pbms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reservations", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReservationID")
    private Long reservationId;

    @Column(name = "ReservationNo", insertable = false, updatable = false)
    private String reservationNo;

    @Column(name = "UserID", nullable = false)
    private Integer userId;

    @Column(name = "CardID", nullable = false)
    private Integer cardId;

    @Column(name = "VehicleID", nullable = false)
    private Integer vehicleId;

    @Column(name = "ReservationDate", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "ExpectedArrivalTime", nullable = false)
    private LocalTime expectedArrivalTime;

    @Column(name = "FloorID", nullable = false)
    private Integer floorId;

    @Column(name = "Status", nullable = false, length = 40)
    private String status;

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive;

    @Column(name = "UserRespondedAt")
    private LocalDateTime userRespondedAt;

    @Column(name = "CheckInAt")
    private LocalDateTime checkInAt;

    @Column(name = "CompletedAt")
    private LocalDateTime completedAt;

    @Column(name = "CancelledAt")
    private LocalDateTime cancelledAt;

    @Column(name = "CancelReason", length = 500)
    private String cancelReason;

    @Column(name = "NoShowMarkedAt")
    private LocalDateTime noShowMarkedAt;

    @Column(name = "AdminSLAAt")
    private LocalDateTime adminSlaAt;

    @Column(name = "IsOverdue", nullable = false)
    private Boolean isOverdue;

    @Column(name = "CreatedAt", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
