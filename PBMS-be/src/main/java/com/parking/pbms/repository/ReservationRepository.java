package com.parking.pbms.repository;

import com.parking.pbms.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationNo(String reservationNo);

    @Query("SELECT COUNT(r) FROM Reservation r JOIN Vehicle v ON r.vehicleId = v.vehicleId " +
           "WHERE r.floorId = :floorId AND v.vehicleType = :vehicleType " +
           "AND r.reservationDate = :date AND r.status = 'CONFIRMED'")
    long countPreBookedNotCheckedIn(
        @Param("floorId") Integer floorId,
        @Param("vehicleType") String vehicleType,
        @Param("date") LocalDate date
    );
}
