import { useState } from "react";
import { getLocalTodayStr } from "../../../utils/dateUtils";
import { Search, RotateCcw, Download, Calendar } from "lucide-react";
import { cls } from "../common/ui";
import { DateInput, FilterGroup } from "../common/DateInput";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";

const mockData = [
  { id: 1, stt: 1, cardNo: "0002100001", maThe: "TM001", bienSo: "59A-123.45", ngayHetHan: "2024-01-20", nhomThe: "THẺ THÁNG XE MÁY", maKH: "KH001", khachHang: "Nguyễn Văn A", sdt: "0912345678", trangThai: "Sắp hết hạn" },
  { id: 2, stt: 2, cardNo: "0002100002", maThe: "TM002", bienSo: "51F-888.88", ngayHetHan: "2024-01-18", nhomThe: "THẺ THÁNG Ô TÔ", maKH: "KH002", khachHang: "Trần Thị B", sdt: "0987654321", trangThai: "Hết hạn" },
  { id: 3, stt: 3, cardNo: "0002100003", maThe: "TM003", bienSo: "29X3-144.84", ngayHetHan: "2024-01-25", nhomThe: "THẺ THÁNG XE MÁY", maKH: "KH003", khachHang: "Lê Văn C", sdt: "0901112233", trangThai: "Sắp hết hạn" },
  { id: 4, stt: 4, cardNo: "0002100004", maThe: "TM004", bienSo: "30G-456.78", ngayHetHan: "2024-02-28", nhomThe: "THẺ THÁNG Ô TÔ", maKH: "KH004", khachHang: "Phạm Thị D", sdt: "0934445566", trangThai: "Còn hạn" },
  { id: 5, stt: 5, cardNo: "0002100005", maThe: "TM005", bienSo: "43A-999.11", ngayHetHan: "2024-01-10", nhomThe: "THẺ THÁNG XE MÁY", maKH: "KH005", khachHang: "Hoàng Văn E", sdt: "0956677889", trangThai: "Hết hạn" },
  { id: 6, stt: 6, cardNo: "0002100006", maThe: "TM006", bienSo: "61C-333.55", ngayHetHan: "2025-03-31", nhomThe: "THẺ THÁNG XE MÁY", maKH: "KH006", khachHang: "Vũ Thị F", sdt: "0978889900", trangThai: "Còn hạn" },
];

const columns: Column[] = [
  { key: "stt", label: "STT", width: "40px" },
  { key: "cardNo", label: "CardNo" },
  { key: "maThe", label: "Mã thẻ" },
  { key: "bienSo", label: "Biển số" },
  {
    key: "ngayHetHan", label: "Ngày hết hạn",
    render: (v: string, row: any) => (
      <span className={
        row.trangThai === "Hết hạn" ? "text-red-600 font-medium" :
        row.trangThai === "Sắp hết hạn" ? "text-amber-600 font-medium" :
        "text-gray-700"
      }>
        {v}
      </span>
    ),
  },
  { key: "nhomThe", label: "Nhóm thẻ" },
  { key: "maKH", label: "Mã khách hàng" },
  { key: "khachHang", label: "Khách hàng" },
  { key: "sdt", label: "SĐT" },
  {
    key: "trangThai", label: "Trạng thái",
    render: (v: string) => (
      <span className={
        v === "Hết hạn" ? cls.badge.red :
        v === "Sắp hết hạn" ? cls.badge.amber :
        cls.badge.green
      }>
        {v}
      </span>
    ),
  },
];

export default function MonthlyCards() {
  const [keyword, setKeyword] = useState("");
  const [chonNgay, setChonNgay] = useState(getLocalTodayStr());
  const [filter, setFilter] = useState<"all" | "soon" | "expired">("all");
  const [nhomThe, setNhomThe] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-2">
      <div className={cls.filterSection}>
        <div className="flex flex-wrap gap-2 items-end mb-2">
          <FilterGroup label="Từ khóa">
            <input className={`${cls.input} w-[150px]`} placeholder="Biển số, mã thẻ..." value={keyword} onChange={e => setKeyword(e.target.value)} />
          </FilterGroup>
          <DateInput label="Chọn ngày" value={chonNgay} onChange={setChonNgay} />
          <FilterGroup label="Loại">
            <div className="flex gap-2 items-center h-[34px]">
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" name="filter" checked={filter === "all"} onChange={() => setFilter("all")} />
                <span className="text-xs">Tất cả</span>
              </label>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" name="filter" checked={filter === "soon"} onChange={() => setFilter("soon")} />
                <span className="text-xs text-amber-600">Sắp hết hạn</span>
              </label>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" name="filter" checked={filter === "expired"} onChange={() => setFilter("expired")} />
                <span className="text-xs text-red-600">Hết hạn</span>
              </label>
            </div>
          </FilterGroup>
          <FilterGroup label="Nhóm thẻ">
            <select className={`${cls.select} w-[160px]`} value={nhomThe} onChange={e => setNhomThe(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>THẺ THÁNG XE MÁY</option>
              <option>THẺ THÁNG Ô TÔ</option>
            </select>
          </FilterGroup>
        </div>
        <div className="flex gap-2">
          <button className={cls.btnSearch}><Search className="w-3.5 h-3.5" />Tìm kiếm</button>
          <button className={cls.btnReset}><RotateCcw className="w-3.5 h-3.5" />Reset</button>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex gap-3">
        <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-gray-500">Sắp hết hạn:</span>
          <span className="text-sm font-bold text-amber-600">2</span>
        </div>
        <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-500" />
          <span className="text-xs text-gray-500">Hết hạn:</span>
          <span className="text-sm font-bold text-red-600">2</span>
        </div>
      </div>

      <div className={cls.sectionCard}>
        <div className="px-3 py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">Thời hạn thẻ tháng</span>
        </div>
        <div className="p-2">
          <DataTable columns={columns} data={mockData} />
          <Pagination currentPage={page} totalPages={3} totalRecords={mockData.length} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
