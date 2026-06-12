package com.parking.pbms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Roles", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roleId")
    private Integer roleId;

    @Column(name = "roleName", nullable = false, length = 20, unique = true)
    private String roleName;

    @Column(name = "description", length = 255)
    private String description;
}
