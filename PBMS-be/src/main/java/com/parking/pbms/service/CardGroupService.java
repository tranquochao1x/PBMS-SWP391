package com.parking.pbms.service;

import com.parking.pbms.dto.CardGroupRequest;
import com.parking.pbms.model.CardGroup;
import java.util.List;

public interface CardGroupService {
    List<CardGroup> getAllCardGroups();
    CardGroup createCardGroup(CardGroupRequest request);
    CardGroup updateCardGroup(Integer id, CardGroupRequest request);
    void deleteCardGroup(Integer id);
}
