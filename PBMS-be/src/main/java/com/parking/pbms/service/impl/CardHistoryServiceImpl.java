package com.parking.pbms.service.impl;

import com.parking.pbms.dto.CardHistoryResponse;
import com.parking.pbms.model.CardHistory;
import com.parking.pbms.repository.CardHistoryRepository;
import com.parking.pbms.service.CardHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardHistoryServiceImpl implements CardHistoryService {

    private final CardHistoryRepository cardHistoryRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    @Transactional(readOnly = true)
    public List<CardHistoryResponse> searchHistory(
            String keyword,
            String fromDate,
            String toDate,
            String hanhDong,
            String nguoiDung,
            String nhomThe
    ) {
        List<Object[]> rawDetails = cardHistoryRepository.findAllHistoryDetails();
        List<CardHistoryResponse> responses = new ArrayList<>();

        int index = 1;
        for (Object[] row : rawDetails) {
            CardHistory ch = (CardHistory) row[0];
            String cardNo = (String) row[1];
            String groupName = (String) row[2];
            String plateNo = (String) row[3];
            String customerName = (String) row[4];
            String username = (String) row[5];

            String actionType = ch.getActionType();
            String thaoTac = mapActionToVietnamese(actionType);

            CardHistoryResponse resp = CardHistoryResponse.builder()
                    .id(ch.getCardHistoryId())
                    .stt(index++)
                    .thoiGian(ch.getActionAt() != null ? ch.getActionAt().format(FORMATTER) : "")
                    .cardNo(cardNo != null ? cardNo : "")
                    .nhomThe(groupName != null ? groupName : "")
                    .thaoTac(thaoTac)
                    .chuThe(customerName != null ? customerName : "")
                    .bienSo(plateNo != null ? plateNo : "")
                    .nguoiThaoTac(username != null ? username : "")
                    .build();

            responses.add(resp);
        }

        // Apply filters in memory
        return responses.stream()
                .filter(r -> filterKeyword(r, keyword))
                .filter(r -> filterDates(r, fromDate, toDate))
                .filter(r -> filterHanhDong(r, hanhDong))
                .filter(r -> filterNguoiDung(r, nguoiDung))
                .filter(r -> filterNhomThe(r, nhomThe))
                .collect(Collectors.toList());
    }

    private String mapActionToVietnamese(String actionType) {
        if (actionType == null) return "Khác";
        switch (actionType.toUpperCase()) {
            case "REGISTER": return "Thêm thẻ mới";
            case "RENEW": return "Gia hạn thẻ";
            case "LOCK": return "Khóa thẻ";
            case "UNLOCK":
            case "ACTIVATE": return "Mở thẻ";
            case "UPDATE_INFO": return "Cập nhật biển số";
            case "CANCEL": return "Xóa thẻ";
            case "EXPIRE": return "Hết hạn";
            default: return actionType;
        }
    }

    private boolean filterKeyword(CardHistoryResponse r, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return true;
        String kw = keyword.trim().toLowerCase();
        return r.getCardNo().toLowerCase().contains(kw)
                || r.getChuThe().toLowerCase().contains(kw)
                || r.getBienSo().toLowerCase().contains(kw);
    }

    private boolean filterDates(CardHistoryResponse r, String fromDate, String toDate) {
        if (r.getThoiGian() == null || r.getThoiGian().isEmpty()) return true;
        LocalDate actionDate = LocalDate.parse(r.getThoiGian().substring(0, 10));

        if (fromDate != null && !fromDate.trim().isEmpty()) {
            LocalDate from = LocalDate.parse(fromDate.trim());
            if (actionDate.isBefore(from)) return false;
        }
        if (toDate != null && !toDate.trim().isEmpty()) {
            LocalDate to = LocalDate.parse(toDate.trim());
            if (actionDate.isAfter(to)) return false;
        }
        return true;
    }

    private boolean filterHanhDong(CardHistoryResponse r, String hanhDong) {
        if (hanhDong == null || hanhDong.trim().isEmpty()) return true;
        return r.getThaoTac().equalsIgnoreCase(hanhDong.trim());
    }

    private boolean filterNguoiDung(CardHistoryResponse r, String nguoiDung) {
        if (nguoiDung == null || nguoiDung.trim().isEmpty()) return true;
        return r.getNguoiThaoTac().equalsIgnoreCase(nguoiDung.trim());
    }

    private boolean filterNhomThe(CardHistoryResponse r, String nhomThe) {
        if (nhomThe == null || nhomThe.trim().isEmpty()) return true;
        return r.getNhomThe().equalsIgnoreCase(nhomThe.trim());
    }
}
