package com.parking.pbms.service.impl;

import com.parking.pbms.dto.FloorStatDto;
import com.parking.pbms.dto.SlotStatsResponse;
import com.parking.pbms.model.Floor;
import com.parking.pbms.repository.CardRepository;
import com.parking.pbms.repository.FloorRepository;
import com.parking.pbms.repository.ParkingSessionRepository;
import com.parking.pbms.repository.ReservationRepository;
import com.parking.pbms.service.SlotService;
import com.parking.pbms.repository.StaffAssignmentRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final FloorRepository floorRepository;
    private final CardRepository cardRepository;
    private final ParkingSessionRepository parkingSessionRepository;
    private final ReservationRepository reservationRepository;
    private final StaffAssignmentRepository staffAssignmentRepository;

    @Override
    public SlotStatsResponse getSlotStatistics(String dateStr) {
        LocalDate date;
        if (dateStr == null || dateStr.trim().isEmpty()) {
            date = LocalDate.now();
        } else {
            try {
                date = LocalDate.parse(dateStr);
            } catch (Exception e) {
                date = LocalDate.now();
            }
        }

        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        List<Floor> floors = floorRepository.findAll();
        List<FloorStatDto> floorStats = new ArrayList<>();

        int totalCarSlots = 0;
        int totalMotorcycleSlots = 0;
        int monthlyCarInside = 0;
        int monthlyMotorcycleInside = 0;

        for (Floor floor : floors) {
            if (!"ACTIVE".equalsIgnoreCase(floor.getStatus())) {
                continue;
            }

            int floorTotalCarSlots = floor.getTotalCarSlots() != null ? floor.getTotalCarSlots() : 0;
            int floorTotalMotorcycleSlots = floor.getTotalMotorcycleSlots() != null ? floor.getTotalMotorcycleSlots() : 0;

            int floorMonthlyCar = (int) cardRepository.countActiveMonthlyAndDayCards(floor.getFloorId(), "CAR");
            int floorMonthlyMotorcycle = (int) cardRepository.countActiveMonthlyAndDayCards(floor.getFloorId(), "MOTORCYCLE");

            int singleCarInside = (int) parkingSessionRepository.countActiveSingleSessions(
                    floor.getFloorId(), "CAR", endOfDay);
            int singleMotorcycleInside = (int) parkingSessionRepository.countActiveSingleSessions(
                    floor.getFloorId(), "MOTORCYCLE", endOfDay);

            int expiredCardCarInside = (int) parkingSessionRepository.countExpiredCardSessionsInside(
                    floor.getFloorId(), "CAR", endOfDay);
            int expiredCardMotorcycleInside = (int) parkingSessionRepository.countExpiredCardSessionsInside(
                    floor.getFloorId(), "MOTORCYCLE", endOfDay);

            int occupiedCar = floorMonthlyCar + singleCarInside + expiredCardCarInside;
            int occupiedMotorcycle = floorMonthlyMotorcycle + singleMotorcycleInside + expiredCardMotorcycleInside;

            int availableCar = Math.max(0, floorTotalCarSlots - occupiedCar);
            int availableMotorcycle = Math.max(0, floorTotalMotorcycleSlots - occupiedMotorcycle);

            FloorStatDto dto = new FloorStatDto(
                    floor.getFloorId(),
                    floor.getFloorCode(),
                    floor.getFloorName(),
                    floorTotalCarSlots,
                    availableCar,
                    occupiedCar,
                    floorMonthlyCar,
                    floorTotalMotorcycleSlots,
                    availableMotorcycle,
                    occupiedMotorcycle,
                    floorMonthlyMotorcycle
            );

            floorStats.add(dto);

            totalCarSlots += floorTotalCarSlots;
            totalMotorcycleSlots += floorTotalMotorcycleSlots;
            monthlyCarInside += floorMonthlyCar;
            monthlyMotorcycleInside += floorMonthlyMotorcycle;
        }

        return new SlotStatsResponse(
                totalCarSlots,
                totalMotorcycleSlots,
                monthlyCarInside,
                monthlyMotorcycleInside,
                floorStats
        );
    }

    @Override
    public void createFloor(com.parking.pbms.dto.FloorRequest request) {
        List<Floor> existingFloors = floorRepository.findAll();
        int maxNum = 0;
        for (Floor f : existingFloors) {
            String code = f.getFloorCode();
            if (code != null && code.startsWith("B")) {
                try {
                    int num = Integer.parseInt(code.substring(1));
                    if (num > maxNum) {
                        maxNum = num;
                    }
                } catch (NumberFormatException ignored) {
                }
            }
        }
        String newFloorCode = "B" + (maxNum + 1);

        Floor floor = Floor.builder()
                .floorCode(newFloorCode)
                .floorName(request.floorName())
                .vehicleType("BOTH")
                .totalCarSlots(request.totalCarSlots())
                .totalMotorcycleSlots(request.totalMotorcycleSlots())
                .totalSlots(request.totalCarSlots() + request.totalMotorcycleSlots())
                .status("ACTIVE")
                .build();

        floorRepository.save(floor);
    }

    @Override
    public void updateFloor(Integer floorId, com.parking.pbms.dto.FloorRequest request) {
        Floor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tầng đỗ xe"));

        floor.setFloorName(request.floorName());
        floor.setTotalCarSlots(request.totalCarSlots());
        floor.setTotalMotorcycleSlots(request.totalMotorcycleSlots());
        floor.setTotalSlots(request.totalCarSlots() + request.totalMotorcycleSlots());

        floorRepository.save(floor);
    }

    @Override
    public void deleteFloor(Integer floorId) {
        Floor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tầng đỗ xe"));

        if (parkingSessionRepository.existsByEntryFloorId(floorId)) {
            throw new IllegalArgumentException("Không thể xóa tầng này vì đã có dữ liệu ra vào (check-in/check-out).");
        }
        if (reservationRepository.existsByFloorId(floorId)) {
            throw new IllegalArgumentException("Không thể xóa tầng này vì đã có lượt đặt vé đỗ xe.");
        }
        if (staffAssignmentRepository.existsByFloorId(floorId)) {
            throw new IllegalArgumentException("Không thể xóa tầng này vì đã có dữ liệu phân công công việc của nhân viên.");
        }
        if (cardRepository.existsByPreferredFloorID(floorId)) {
            throw new IllegalArgumentException("Không thể xóa tầng này vì đã có thẻ tháng đăng ký sử dụng tầng này.");
        }

        floorRepository.delete(floor);
    }
}
