import { useState } from "react";
import {
  Search,
  RotateCcw,
  Plus,
  Trash2,
  X,
  Save,
  Edit,
  Eye,
} from "lucide-react";
import { cls } from "../common/ui";
import { DateInput, FilterGroup } from "../common/DateInput";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";
import CardViolationRules from "./CardViolationRules";

// TODO: Load from backend API
const initialData: any[] = [];

interface CardFormData {
  nhomThe: string;
  maThe: string;
  cardNo: string;
  bienSo: string;
  khachHang: string;
  ngayDangKy: string;
  ngayHetHan: string;
  trangThai: string;
  ghiChu: string;
  tangGuiXe: string;
}

const defaultForm: CardFormData = {
  nhomThe: "",
  maThe: "",
  cardNo: "",
  bienSo: "",
  khachHang: "",
  ngayDangKy: "",
  ngayHetHan: "",
  trangThai: "Hoạt động",
  ghiChu: "",
  tangGuiXe: "",
};

export default function CardList() {
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [nhomKH, setNhomKH] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [nhomThe, setNhomThe] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CardFormData>(defaultForm);
  const [data] = useState(initialData);

  const allSelected = selected.size === data.length;

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(data.map((d) => d.id)));
  };

  const columns: Column[] = [
    { key: "cardNo", label: "CardNo" },
    { key: "maThe", label: "Mã thẻ" },
    { key: "nhomThe", label: "Nhóm thẻ" },
    { key: "bienSo", label: "Biển số" },
    { key: "tangGuiXe", label: "Tầng" },
    {
      key: "ngayHetHan",
      label: "Ngày hết hạn",
      render: (v: string) => v || <span className="text-gray-400">---</span>,
    },
    { key: "khachHang", label: "Khách hàng" },
    { key: "diaChi", label: "Địa chỉ" },
    { key: "ngayDangKy", label: "Ngày đăng ký" },
    {
      key: "trangThai",
      label: "Trạng thái",
      render: (v: string) => (
        <span className={v === "Hoạt động" ? cls.badge.green : cls.badge.red}>
          {v}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* Filters */}
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
          <DateInput label="Từ ngày" value={fromDate} onChange={setFromDate} />
          <DateInput label="Đến ngày" value={toDate} onChange={setToDate} />
          <FilterGroup label="Trạng thái">
            <select
              className={`${cls.select} w-[130px]`}
              value={trangThai}
              onChange={(e) => setTrangThai(e.target.value)}
            >
              <option value="">-- Tất cả --</option>
              <option>Hoạt động</option>
              <option>Khóa</option>
            </select>
          </FilterGroup>
          <FilterGroup label="Nhóm thẻ">
            <select
              className={`${cls.select} w-[160px]`}
              value={nhomThe}
              onChange={(e) => setNhomThe(e.target.value)}
            >
              <option value="">-- Tất cả --</option>
              <option>THẺ LƯỢT XE MÁY</option>
              <option>THẺ LƯỢT Ô TÔ</option>
              <option>THẺ THÁNG XE MÁY</option>
              <option>THẺ THÁNG Ô TÔ</option>
            </select>
          </FilterGroup>
        </div>
        <div className="flex flex-wrap gap-2">
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

      <div className={cls.sectionCard}>
        <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Danh sách thẻ
          </span>
          {selected.size > 0 && (
            <span className="text-xs text-blue-600">
              Đã chọn: {selected.size} thẻ
            </span>
          )}
        </div>
        <div className="p-2">
          <DataTable
            columns={columns}
            data={data}
            hasCheckbox
            selectedRows={selected}
            onSelectRow={toggleRow}
            onSelectAll={toggleAll}
            allSelected={allSelected}
          />
          <Pagination
            currentPage={page}
            totalPages={3}
            totalRecords={data.length}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Card Violation Rules */}
      <CardViolationRules />

      {/* Add Card Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[520px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-3 bg-blue-600 rounded-t-lg">
              <span className="text-white text-sm font-semibold">
                Thêm thẻ mới
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Nhóm thẻ <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`${cls.select} w-full`}
                    value={form.nhomThe}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nhomThe: e.target.value }))
                    }
                  >
                    <option value="">-- Chọn nhóm thẻ --</option>
                    <option>THẺ LƯỢT XE MÁY</option>
                    <option>THẺ LƯỢT Ô TÔ</option>
                    <option>THẺ THÁNG XE MÁY</option>
                    <option>THẺ THÁNG Ô TÔ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Mã thẻ <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`${cls.input} w-full`}
                    placeholder="T001"
                    value={form.maThe}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, maThe: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    CardNo <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`${cls.input} w-full`}
                    placeholder="0001234567"
                    value={form.cardNo}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, cardNo: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Biển số
                  </label>
                  <input
                    className={`${cls.input} w-full`}
                    placeholder="59A-123.45"
                    value={form.bienSo}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, bienSo: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Tầng gửi xe <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`${cls.select} w-full`}
                    value={form.tangGuiXe}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, tangGuiXe: e.target.value }))
                    }
                  >
                    <option value="">-- Chọn tầng --</option>
                    <option>Tầng 1</option>
                    <option>Tầng 2</option>
                    <option>Tầng 3</option>
                    <option>Tầng 4</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Khách hàng
                  </label>
                  <input
                    className={`${cls.input} w-full`}
                    placeholder="Nhập tên khách hàng"
                    value={form.khachHang}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, khachHang: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Ngày đăng ký
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className={`${cls.input} w-full pr-7`}
                      value={form.ngayDangKy}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, ngayDangKy: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Ngày hết hạn
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className={`${cls.input} w-full pr-7`}
                      value={form.ngayHetHan}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, ngayHetHan: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Trạng thái
                  </label>
                  <select
                    className={`${cls.select} w-full`}
                    value={form.trangThai}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, trangThai: e.target.value }))
                    }
                  >
                    <option>Hoạt động</option>
                    <option>Khóa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Ghi chú
                  </label>
                  <input
                    className={`${cls.input} w-full`}
                    placeholder="Ghi chú..."
                    value={form.ghiChu}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, ghiChu: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">
              <button
                className={cls.btnSearch}
                onClick={() => setShowModal(false)}
              >
                <Save className="w-3.5 h-3.5" />
                Lưu
              </button>
              <button
                className={cls.btnReset}
                onClick={() => setShowModal(false)}
              >
                <X className="w-3.5 h-3.5" />
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
