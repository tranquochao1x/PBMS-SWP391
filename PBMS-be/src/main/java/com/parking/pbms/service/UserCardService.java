package com.parking.pbms.service;

import com.parking.pbms.dto.MonthlyCardResponse;
import com.parking.pbms.dto.RegisterCardRequest;
import com.parking.pbms.dto.RenewCardRequest;
import com.parking.pbms.model.CardGroup;
import java.util.List;

public interface UserCardService {
    List<MonthlyCardResponse> getMyCards(String username);
    List<MonthlyCardResponse> getCardsByAccountId(Integer accountId);
    MonthlyCardResponse registerCard(String username, RegisterCardRequest request);
    MonthlyCardResponse renewCard(String username, RenewCardRequest request);
    List<CardGroup> getActiveCardGroups();
}
