package com.parking.pbms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "CardHistories", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CardHistoryID")
    private Long cardHistoryId;

    @Column(name = "CardID", nullable = false)
    private Integer cardId;

    @Column(name = "ActionType", nullable = false, length = 30)
    private String actionType;

    @Column(name = "PerformedBy", nullable = false)
    private Integer performedBy;

    @Column(name = "PaymentID")
    private Long paymentId;

    @Column(name = "OldExpireAt")
    private LocalDate oldExpireAt;

    @Column(name = "NewExpireAt")
    private LocalDate newExpireAt;

    @Column(name = "DurationMonths")
    private Integer durationMonths;

    @Column(name = "Detail", length = 500)
    private String detail;

    @Column(name = "ActionAt", nullable = false, insertable = false, updatable = false)
    private LocalDateTime actionAt;
}
