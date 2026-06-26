package com.parking.pbms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Floors", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FloorID")
    private Integer floorId;

    @Column(name = "FloorCode", nullable = false, unique = true, length = 10)
    private String floorCode;

    @Column(name = "FloorName", nullable = false, length = 100)
    private String floorName;

    @Column(name = "VehicleType", nullable = false, length = 20)
    private String vehicleType;

    @Column(name = "TotalSlots", nullable = false)
    private Integer totalSlots;

    @Column(name = "TotalCarSlots", nullable = false)
    private Integer totalCarSlots;

    @Column(name = "TotalMotorcycleSlots", nullable = false)
    private Integer totalMotorcycleSlots;

    @Column(name = "Note", length = 500)
    private String note;

    @Column(name = "Status", nullable = false, length = 20)
    private String status;
}
