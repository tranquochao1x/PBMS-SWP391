package com.parking.pbms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Accounts", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accountId")
    private Integer accountId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roleId", nullable = false)
    private Role role;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "fullName", nullable = false, length = 100)
    private String fullName;

    @Column(name = "passwordHash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "portraitURL", length = 500)
    private String portraitURL;

    @Column(name = "lastLoginAt")
    private LocalDateTime lastLoginAt;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "createdAt", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public String getRoleName() {
        return role != null ? role.getRoleName() : null;
    }
}
