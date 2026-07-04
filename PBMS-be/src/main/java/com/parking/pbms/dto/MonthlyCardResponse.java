package com.parking.pbms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyCardResponse {
    private Integer id;
    private String cardNo;
    private String nhomThe;
    private String loaiXe;
    private String bienSo;
    private String ngayDangKy;
    private String ngayHetHan;
    private String tangGuiXe;
    private String trangThai;
    private Integer soNgayConLai;
    private String checkoutUrl;
    private String qrCode;
    private Long orderCode;
}
