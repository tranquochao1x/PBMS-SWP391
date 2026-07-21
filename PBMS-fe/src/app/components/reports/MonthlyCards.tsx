import { useState } from "react";
import { getLocalTodayStr } from "../../../utils/dateUtils";
import { Search, RotateCcw, Download, Calendar } from "lucide-react";
import { cls } from "../common/ui";
import { DateInput, FilterGroup } from "../common/DateInput";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";

// TODO: Load from backend API
const mockData: any[] = [];

const columns: Column[] = [
  { key: "stt", label: "STT", width: "40px" },
  { key: "cardNo", label: "CardNo" },
  { key: "maThe", label: "Mã thẻ" },
  { key: "bienSo", label: "Biển số" },
  {
    key: "ngayHetHan",
    label: "Ngày hết hạn",
    render: (v: string, row: any) => (
      <span
        className={
          row.trangThai === "Hết hạn"
            ? "text-red-600 font-medium"
            : row.trangThai === "Sắp hết hạn"
              ? "text-amber-600 font-medium"
              : "text-gray-700"
        }
      >
        {v}
      </span>
    ),
  },
  { key: "nhomThe", label: "Nhóm thẻ" },
  { key: "maKH", label: "Mã khách hàng" },
  { key: "khachHang", label: "Khách hàng" },
  { key: "sdt", label: "SĐT" },
  {
    key: "trangThai",
    label: "Trạng thái",
    render: (v: string) => (
      <span
        className={
          v === "Hết hạn"
            ? cls.badge.red
            : v === "Sắp hết hạn"
              ? cls.badge.amber
              : cls.badge.green
        }
      >
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
            <input
              className={`${cls.input} w-[150px]`}
              placeholder="Biển số, mã thẻ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </FilterGroup>
          <DateInput
            label="Chọn ngày"
            value={chonNgay}
            onChange={setChonNgay}
          />
          <FilterGroup label="Loại">
            <div className="flex gap-2 items-center h-[34px]">
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="filter"
                  checked={filter === "all"}
                  onChange={() => setFilter("all")}
                />
                <span className="text-xs">Tất cả</span>
              </label>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="filter"
                  checked={filter === "soon"}
                  onChange={() => setFilter("soon")}
                />
                <span className="text-xs text-amber-600">Sắp hết hạn</span>
              </label>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="filter"
                  checked={filter === "expired"}
                  onChange={() => setFilter("expired")}
                />
                <span className="text-xs text-red-600">Hết hạn</span>
              </label>
            </div>
          </FilterGroup>
          <FilterGroup label="Nhóm thẻ">
            <select
              className={`${cls.select} w-[160px]`}
              value={nhomThe}
              onChange={(e) => setNhomThe(e.target.value)}
            >
              <option value="">-- Tất cả --</option>
              <option>THẺ THÁNG XE MÁY</option>
              <option>THẺ THÁNG Ô TÔ</option>
            </select>
          </FilterGroup>
        </div>
        <div className="flex gap-2">
          <button className={cls.btnSearch}>
            <Search className="w-3.5 h-3.5" />
            Tìm kiếm
          </button>
          <button className={cls.btnReset}>
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
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
          <span className="text-sm font-medium text-gray-700">
            Thời hạn thẻ tháng
          </span>
        </div>
        <div className="p-2">
          <DataTable columns={columns} data={mockData} />
          <Pagination
            currentPage={page}
            totalPages={3}
            totalRecords={mockData.length}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
