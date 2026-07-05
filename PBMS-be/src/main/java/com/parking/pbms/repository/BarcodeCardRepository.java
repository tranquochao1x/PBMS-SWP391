package com.parking.pbms.repository;

import com.parking.pbms.model.BarcodeCard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BarcodeCardRepository extends JpaRepository<BarcodeCard, String> {
    Optional<BarcodeCard> findByBarcodeAndIsActive(String barcode, Boolean isActive);
}
