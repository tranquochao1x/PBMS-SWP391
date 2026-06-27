package com.parking.pbms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CardGroups", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CardGroupID")
    private Integer cardGroupId;

    @Column(name = "GroupName", nullable = false, unique = true, length = 100)
    private String groupName;

    @Column(name = "VehicleType", nullable = false, length = 20)
    private String vehicleType;

    @Column(name = "TicketType", nullable = false, length = 20)
    private String ticketType;

    @Column(name = "BasePrice", nullable = false)
    private java.math.BigDecimal basePrice;

    @Column(name = "DefaultDurationDays")
    private Integer defaultDurationDays;

    @Column(name = "ReservationAllowed", nullable = false)
    private Boolean reservationAllowed;

    @Column(name = "Description", length = 500)
    private String description;

    @Column(name = "Status", nullable = false, length = 20)
    private String status;
}
