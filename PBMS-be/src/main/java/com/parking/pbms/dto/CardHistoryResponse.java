package com.parking.pbms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardHistoryResponse {
    private Long id;
    private Integer stt;
    private String thoiGian;
    private String cardNo;
    private String nhomThe;
    private String thaoTac;
    private String chuThe;
    private String bienSo;
    private String nguoiThaoTac;
}
