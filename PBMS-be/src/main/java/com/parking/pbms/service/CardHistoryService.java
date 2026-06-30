package com.parking.pbms.service;

import com.parking.pbms.dto.CardHistoryResponse;
import java.util.List;

public interface CardHistoryService {
    List<CardHistoryResponse> searchHistory(
            String keyword,
            String fromDate,
            String toDate,
            String hanhDong,
            String nguoiDung,
            String nhomThe
    );
}
