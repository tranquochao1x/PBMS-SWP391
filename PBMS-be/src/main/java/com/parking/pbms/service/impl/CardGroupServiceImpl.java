package com.parking.pbms.service.impl;

import com.parking.pbms.dto.CardGroupRequest;
import com.parking.pbms.model.CardGroup;
import com.parking.pbms.repository.CardGroupRepository;
import com.parking.pbms.service.CardGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardGroupServiceImpl implements CardGroupService {

    private final CardGroupRepository cardGroupRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CardGroup> getAllCardGroups() {
        return cardGroupRepository.findAll();
    }

    @Override
    @Transactional
    public CardGroup createCardGroup(CardGroupRequest request) {
        if (cardGroupRepository.findByGroupName(request.groupName()).isPresent()) {
            throw new RuntimeException("Nhóm thẻ với tên này đã tồn tại: " + request.groupName());
        }

        CardGroup cardGroup = CardGroup.builder()
                .groupName(request.groupName())
                .vehicleType(request.vehicleType())
                .ticketType(request.ticketType())
                .basePrice(request.basePrice())
                .defaultDurationDays(request.defaultDurationDays())
                .reservationAllowed(request.reservationAllowed())
                .description(request.description())
                .status(request.status())
                .build();

        return cardGroupRepository.save(cardGroup);
    }

    @Override
    @Transactional
    public CardGroup updateCardGroup(Integer id, CardGroupRequest request) {
        CardGroup cardGroup = cardGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm thẻ với ID: " + id));

        // Check unique constraint if name is changing
        if (!cardGroup.getGroupName().equalsIgnoreCase(request.groupName())) {
            if (cardGroupRepository.findByGroupName(request.groupName()).isPresent()) {
                throw new RuntimeException("Tên nhóm thẻ đã tồn tại: " + request.groupName());
            }
        }

        cardGroup.setGroupName(request.groupName());
        cardGroup.setVehicleType(request.vehicleType());
        cardGroup.setTicketType(request.ticketType());
        cardGroup.setBasePrice(request.basePrice());
        cardGroup.setDefaultDurationDays(request.defaultDurationDays());
        cardGroup.setReservationAllowed(request.reservationAllowed());
        cardGroup.setDescription(request.description());
        cardGroup.setStatus(request.status());

        return cardGroupRepository.save(cardGroup);
    }

    @Override
    @Transactional
    public void deleteCardGroup(Integer id) {
        CardGroup cardGroup = cardGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm thẻ với ID: " + id));

        try {
            cardGroupRepository.delete(cardGroup);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa nhóm thẻ này vì nhóm thẻ đang được liên kết với dữ liệu thẻ khác.");
        }
    }
}
