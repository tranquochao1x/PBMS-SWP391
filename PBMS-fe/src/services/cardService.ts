import { ApiResponse } from "./authService";
import { authFetch, safeJson } from "../utils/apiHelper";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5173/api/v1";

export interface MonthlyCardDto {
  id: number;
  cardNo: string;
  nhomThe: string;
  loaiXe: string;
  bienSo: string;
  ngayDangKy: string;
  ngayHetHan: string;
  tangGuiXe?: string;
  trangThai: "Hoạt động" | "Hết hạn" | "Sắp hết hạn";
  soNgayConLai: number;
  checkoutUrl?: string;
  qrCode?: string;
  orderCode?: number;
}

export interface RegisterCardRequest {
  nhomThe: string;
  bienSo: string;
  tangGuiXe?: string;
  duration: number;
  amount: number;
  startDate: string;
}

export interface RenewCardRequest {
  cardId: number;
  newExpiry: string;
  duration: number;
  amount: number;
}

export interface CardGroupDto {
  cardGroupId: number;
  groupName: string;
  vehicleType: string;
  ticketType: string;
  basePrice: number;
  defaultDurationDays?: number;
  reservationAllowed: boolean;
  description?: string;
  status: string;
}

export interface VehicleDto {
  id: number;
  plateNo: string;
  vehicleType: string; // "MOTORCYCLE" | "CAR"
  brand?: string;
  model?: string;
  color?: string;
}

export interface VehicleRequest {
  plateNo: string;
  vehicleType: string;
  brand?: string;
  model?: string;
  color?: string;
}

export const cardService = {
  async getMyCards(): Promise<MonthlyCardDto[]> {
    const response = await authFetch(`${API_URL}/user/monthly-cards`);
    const result: ApiResponse<MonthlyCardDto[]> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Không thể tải danh sách thẻ.");
    return result.data;
  },

  async registerCard(payload: RegisterCardRequest): Promise<MonthlyCardDto> {
    const response = await authFetch(`${API_URL}/user/monthly-cards`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const result: ApiResponse<MonthlyCardDto> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Đăng ký thẻ thất bại.");
    return result.data;
  },

  async renewCard(payload: RenewCardRequest): Promise<MonthlyCardDto> {
    const response = await authFetch(`${API_URL}/user/monthly-cards/renew`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const result: ApiResponse<MonthlyCardDto> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Gia hạn thẻ thất bại.");
    return result.data;
  },

  async getActiveCardGroups(): Promise<CardGroupDto[]> {
    const response = await authFetch(`${API_URL}/user/monthly-cards/groups`);
    const result: ApiResponse<CardGroupDto[]> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Không thể tải danh sách nhóm thẻ.");
    return result.data;
  },

  async cancelPayment(orderCode: number, reason?: string): Promise<void> {
    const response = await authFetch(`${API_URL}/payments/cancel/${orderCode}`, {
      method: "POST",
      body: JSON.stringify({ reason: reason || "Người dùng chủ động hủy trên giao diện" })
    });
    const result: ApiResponse<any> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Không thể hủy thanh toán.");
  },

  async checkPaymentStatus(orderCode: number): Promise<any> {
    const response = await authFetch(`${API_URL}/payments/status/${orderCode}`);
    const result: ApiResponse<any> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Lỗi kiểm tra trạng thái thanh toán.");
    return result.data;
  },

  async mockPaymentSuccess(orderCode: number): Promise<void> {
    const response = await authFetch(`${API_URL}/payments/mock-success/${orderCode}`, {
      method: "POST"
    });
    const result: ApiResponse<any> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Lỗi khi giả lập thanh toán.");
  },

  // ── Vehicle CRUD ────────────────────────────────────────────────────
  async getMyVehicles(): Promise<VehicleDto[]> {
    const response = await authFetch(`${API_URL}/user/my-vehicles`);
    const result: ApiResponse<VehicleDto[]> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Không thể tải danh sách phương tiện.");
    return result.data;
  },

  async addVehicle(payload: VehicleRequest): Promise<VehicleDto> {
    const response = await authFetch(`${API_URL}/user/my-vehicles`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const result: ApiResponse<VehicleDto> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Thêm phương tiện thất bại.");
    return result.data;
  },

  async updateVehicle(id: number, payload: VehicleRequest): Promise<VehicleDto> {
    const response = await authFetch(`${API_URL}/user/my-vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    const result: ApiResponse<VehicleDto> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Cập nhật phương tiện thất bại.");
    return result.data;
  },

  async deleteVehicle(id: number): Promise<void> {
    const response = await authFetch(`${API_URL}/user/my-vehicles/${id}`, {
      method: "DELETE"
    });
    const result: ApiResponse<any> = await safeJson(response);
    if (!response.ok) throw new Error(result.message || "Xóa phương tiện thất bại.");
  }
};
