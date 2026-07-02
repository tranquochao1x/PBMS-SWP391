import { useState } from "react";
import { getLocalTodayStr } from "../../../utils/dateUtils";
import { Search, RotateCcw, Download, Camera } from "lucide-react";
import { cls } from "../common/ui";
import { DateInput, FilterGroup } from "../common/DateInput";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";

const mockData = [
  { id: 1, cardNo: "0001234567", maThe: "T001", bienSo: "59A-123.45", tgVao: "2024-01-15 08:30:22", anhVao: "img", nhomThe: "THẺ LƯỢT XE MÁY", nguoiDung: "admin", lanVao: "VÀO", giamSat: "Camera 01", ngayHetHan: "2024-12-31" },
  { id: 2, cardNo: "0001234568", maThe: "T002", bienSo: "51F-888.88", tgVao: "2024-01-15 09:15:44", anhVao: "img", nhomThe: "THẺ LƯỢT Ô TÔ", nguoiDung: "staff01", lanVao: "N2-Vào trái ra phải", giamSat: "Camera 02", ngayHetHan: "2024-12-31" },
  { id: 3, cardNo: "0001234569", maThe: "T003", bienSo: "29X3-144.84", tgVao: "2024-01-15 10:00:15", anhVao: "img", nhomThe: "THẺ THÁNG XE MÁY", nguoiDung: "staff01", lanVao: "VÀO", giamSat: "Camera 01", ngayHetHan: "2025-01-15" },
  { id: 4, cardNo: "0001234570", maThe: "T004", bienSo: "30G-456.78", tgVao: "2024-01-15 10:22:08", anhVao: "img", nhomThe: "THẺ THÁNG Ô TÔ", nguoiDung: "admin", lanVao: "VÀO", giamSat: "Camera 01", ngayHetHan: "2025-02-28" },
  { id: 5, cardNo: "0001234571", maThe: "T005", bienSo: "43A-999.11", tgVao: "2024-01-15 11:05:33", anhVao: "img", nhomThe: "THẺ LƯỢT XE MÁY", nguoiDung: "admin", lanVao: "VÀO", giamSat: "Camera 01", ngayHetHan: "2024-12-31" },
  { id: 6, cardNo: "0001234572", maThe: "T006", bienSo: "61C-333.55", tgVao: "2024-01-15 11:30:50", anhVao: "img", nhomThe: "THẺ LƯỢT XE MÁY", nguoiDung: "staff01", lanVao: "N2-Vào trái ra phải", giamSat: "Camera 02", ngayHetHan: "2024-12-31" },
  { id: 7, cardNo: "0001234573", maThe: "T007", bienSo: "50A-777.22", tgVao: "2024-01-15 12:10:05", anhVao: "img", nhomThe: "THẺ THÁNG XE MÁY", nguoiDung: "admin", lanVao: "VÀO", giamSat: "Camera 01", ngayHetHan: "2025-03-31" },
];

const columns: Column[] = [
  { key: "stt", label: "STT", width: "45px" },
  { key: "cardNo", label: "CardNo" },
  { key: "maThe", label: "Mã thẻ" },
  { key: "bienSo", label: "Biển số" },
  { key: "tgVao", label: "Thời gian vào" },
  {
    key: "anhVao", label: "Ảnh vào", width: "70px",
    render: () => (
      <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs">
        <Camera className="w-3.5 h-3.5" />
        Xem
      </button>
    ),
  },
  { key: "nhomThe", label: "Nhóm thẻ" },
  { key: "nguoiDung", label: "Người dùng" },
  { key: "lanVao", label: "Làn vào" },
  { key: "giamSat", label: "Giám sát vào" },
  { key: "ngayHetHan", label: "Ngày hết hạn" },
];

export default function VehiclesInParking() {
  const [keyword, setKeyword] = useState("");
  const [nhomKH, setNhomKH] = useState("");
  const [fromDate, setFromDate] = useState(getLocalTodayStr());
  const [toDate, setToDate] = useState(getLocalTodayStr());
  const [lan, setLan] = useState("");
  const [nguoiDung, setNguoiDung] = useState("");
  const [bienSoHopLe, setBienSoHopLe] = useState("");
  const [nhomThe, setNhomThe] = useState("");
  const [page, setPage] = useState(1);

  const data = mockData.map((r, i) => ({ ...r, stt: i + 1 }));

  return (
    <div className="space-y-2">
      <div className={cls.filterSection}>
        <div className="flex flex-wrap gap-2 items-end mb-2">
          <FilterGroup label="Từ khóa">
            <input className={`${cls.input} w-[150px]`} placeholder="Biển số, mã thẻ..." value={keyword} onChange={e => setKeyword(e.target.value)} />
          </FilterGroup>
          <FilterGroup label="Nhóm khách hàng">
            <select className={`${cls.select} w-[150px]`} value={nhomKH} onChange={e => setNhomKH(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>Khách hàng VIP</option>
              <option>Khách hàng thường</option>
            </select>
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
            <select className={`${cls.select} w-[120px]`} value={nguoiDung} onChange={e => setNguoiDung(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>admin</option>
              <option>staff01</option>
            </select>
          </FilterGroup>
          <FilterGroup label="Biển số hợp lệ">
            <select className={`${cls.select} w-[130px]`} value={bienSoHopLe} onChange={e => setBienSoHopLe(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option value="1">Hợp lệ</option>
              <option value="0">Không hợp lệ</option>
            </select>
          </FilterGroup>
          <FilterGroup label="Nhóm thẻ">
            <select className={`${cls.select} w-[160px]`} value={nhomThe} onChange={e => setNhomThe(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>THẺ LƯỢT XE MÁY</option>
              <option>THẺ LƯỢT Ô TÔ</option>
              <option>THẺ THÁNG XE MÁY</option>
              <option>THẺ THÁNG Ô TÔ</option>
            </select>
          </FilterGroup>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className={cls.btnSearch}><Search className="w-3.5 h-3.5" />Tìm kiếm</button>
          <button className={cls.btnReset}><RotateCcw className="w-3.5 h-3.5" />Reset</button>
          <button className={cls.btnSecondary}>Tất cả</button>
          <button className={cls.btnExport}><Download className="w-3.5 h-3.5" />Xuất excel</button>
        </div>
      </div>

      <div className={cls.sectionCard}>
        <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Xe trong bãi hiện tại</span>
          <span className="text-xs text-gray-500">Tổng: {data.length} xe</span>
        </div>
        <div className="p-2">
          <DataTable columns={columns} data={data} />
          <Pagination currentPage={page} totalPages={3} totalRecords={data.length} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
