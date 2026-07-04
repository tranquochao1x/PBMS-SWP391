import { useState } from "react";
import { Search, RotateCcw, Download, Camera, AlertTriangle } from "lucide-react";
import { cls } from "../common/ui";
import { DateInput, FilterGroup } from "../common/DateInput";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";

const mockData = [
  { id: 1, stt: 1, thoiGian: "2024-01-15 08:45:12", cardNo: "0000000000", maThe: "---", bienSo: "59Z-999.99", hinhAnh: "img", canhBao: "Không tồn tại trên hệ thống", lanRa: "A", nhanVienGiamSat: "staff01", moTa: "Quẹt thẻ không nhận dạng được" },
  { id: 2, stt: 2, thoiGian: "2024-01-15 09:02:33", cardNo: "0000000001", maThe: "---", bienSo: "51X-111.11", hinhAnh: "img", canhBao: "Không tồn tại trên hệ thống", lanRa: "B", nhanVienGiamSat: "staff02", moTa: "Quẹt thẻ không nhận dạng được" },
  { id: 3, stt: 3, thoiGian: "2024-01-14 14:30:20", cardNo: "0000000002", maThe: "---", bienSo: "30K-222.33", hinhAnh: "img", canhBao: "Không tồn tại trên hệ thống", lanRa: "C", nhanVienGiamSat: "staff01", moTa: "Quẹt thẻ không nhận dạng được" },
  { id: 4, stt: 4, thoiGian: "2024-01-14 16:22:08", cardNo: "0000000003", maThe: "---", bienSo: "43B-555.77", hinhAnh: "img", canhBao: "Không tồn tại trên hệ thống", lanRa: "D", nhanVienGiamSat: "staff01", moTa: "Quẹt thẻ không nhận dạng được" },
  { id: 5, stt: 5, thoiGian: "2024-01-13 11:05:44", cardNo: "0000000004", maThe: "---", bienSo: "61D-888.00", hinhAnh: "img", canhBao: "Không tồn tại trên hệ thống", lanRa: "E", nhanVienGiamSat: "staff02", moTa: "Quẹt thẻ không nhận dạng được" },
  { id: 6, stt: 6, thoiGian: "2024-01-13 15:40:10", cardNo: "0000000005", maThe: "---", bienSo: "29T-101.01", hinhAnh: "img", canhBao: "Không tồn tại trên hệ thống", lanRa: "F", nhanVienGiamSat: "staff02", moTa: "Quẹt thẻ không nhận dạng được" },
];

const columns: Column[] = [
  { key: "stt", label: "STT", width: "40px" },
  { key: "thoiGian", label: "Thời gian" },
  { key: "cardNo", label: "CardNo" },
  { key: "maThe", label: "Mã thẻ" },
  { key: "bienSo", label: "Biển số" },
  {
    key: "hinhAnh", label: "Hình ảnh", width: "70px",
    render: () => (
      <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs">
        <Camera className="w-3.5 h-3.5" />Xem
      </button>
    ),
  },
  {
    key: "canhBao", label: "Cảnh báo",
    render: () => (
      <span className={cls.badge.red}>Không tồn tại trên hệ thống</span>
    ),
  },
  { key: "lanRa", label: "Làn ra" },
  { key: "nhanVienGiamSat", label: "Nhân viên giám sát" },
  { key: "moTa", label: "Mô tả" },
];

export default function AlertEvents() {
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("2024-01-13");
  const [toDate, setToDate] = useState("2024-01-15");
  const [lan, setLan] = useState("");
  const [nguoiDung, setNguoiDung] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-2">
      <div className={cls.filterSection}>
        <div className="flex flex-wrap gap-2 items-end mb-2">
          <FilterGroup label="Từ khóa">
            <input className={`${cls.input} w-[150px]`} placeholder="Biển số, mã thẻ..." value={keyword} onChange={e => setKeyword(e.target.value)} />
          </FilterGroup>
          <DateInput label="Từ ngày" value={fromDate} onChange={setFromDate} />
          <DateInput label="Đến ngày" value={toDate} onChange={setToDate} />
          <FilterGroup label="Làn">
            <select className={`${cls.select} w-[130px]`} value={lan} onChange={e => setLan(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>VÀO</option>
              <option>RA</option>
              <option>N2-Vào trái ra phải</option>
            </select>
          </FilterGroup>
          <FilterGroup label="Người dùng">
            <select className={`${cls.select} w-[110px]`} value={nguoiDung} onChange={e => setNguoiDung(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>admin</option>
              <option>staff01</option>
            </select>
          </FilterGroup>
        </div>
        <div className="flex gap-2">
          <button className={cls.btnSearch}><Search className="w-3.5 h-3.5" />Tìm kiếm</button>
          <button className={cls.btnReset}><RotateCcw className="w-3.5 h-3.5" />Reset</button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-3">
        <div className="bg-red-50 border border-red-200 rounded shadow-sm px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-xs text-gray-600">Không tồn tại trên hệ thống:</span>
          <span className="text-sm font-bold text-red-600">{mockData.length}</span>
        </div>
      </div>

      <div className={cls.sectionCard}>
        <div className="px-3 py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">Sự kiện cảnh báo</span>
        </div>
        <div className="p-2">
          <DataTable columns={columns} data={mockData} />
          <Pagination currentPage={page} totalPages={3} totalRecords={mockData.length} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
