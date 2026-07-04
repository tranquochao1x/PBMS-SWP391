package com.parking.pbms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Cards", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CardID")
    private Integer cardId;

    @Column(name = "CardNo", insertable = false, updatable = false)
    private String cardNo;

    @Column(name = "CardGroupID", nullable = false)
    private Integer cardGroupId;

    @Column(name = "AccountID")
    private Integer accountId;

    @Column(name = "VehicleID")
    private Integer vehicleId;

    @Column(name = "PreferredFloorID")
    private Integer preferredFloorID;

    @Column(name = "RegisteredAt", nullable = false)
    private LocalDate registeredAt;

    @Column(name = "EffectiveFrom", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "ExpireAt")
    private LocalDate expireAt;

    @Column(name = "Status", nullable = false, length = 20)
    private String status;

    @Column(name = "Note", length = 500)
    private String note;

    @Column(name = "CreatedAt", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
