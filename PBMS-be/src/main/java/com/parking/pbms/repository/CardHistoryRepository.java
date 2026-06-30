package com.parking.pbms.repository;

import com.parking.pbms.model.CardHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface CardHistoryRepository extends JpaRepository<CardHistory, Long> {

    Optional<CardHistory> findByPaymentId(Long paymentId);

    @Query("SELECT ch, c.cardNo, cg.groupName, v.plateNo, cu.fullName, a.username " +
           "FROM CardHistory ch " +
           "LEFT JOIN Card c ON ch.cardId = c.cardId " +
           "LEFT JOIN CardGroup cg ON c.cardGroupId = cg.cardGroupId " +
           "LEFT JOIN Vehicle v ON c.vehicleId = v.vehicleId " +
           "LEFT JOIN User cu ON c.accountId = cu.accountId " +
           "LEFT JOIN Account a ON ch.performedBy = a.accountId " +
           "ORDER BY ch.actionAt DESC")
    List<Object[]> findAllHistoryDetails();
}
