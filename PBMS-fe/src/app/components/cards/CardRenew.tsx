import { useState } from "react";
import { Search, RotateCcw, RefreshCw, X, CreditCard, Calendar } from "lucide-react";
import { cls } from "../common/ui";
import { FilterGroup } from "../common/DateInput";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";

interface CardItem {
  id: number;
  cardNo: string;
  maThe: string;
  bienSo: string;
  khachHang: string;
  nhomThe: string;
  ngayHetHan: string;
  trangThai: string;
  tangGuiXe: string;
}

const cardData: CardItem[] = [
  { id: 1, cardNo: "0002100001", maThe: "TM001", bienSo: "59A-123.45", khachHang: "Nguyễn Văn An", nhomThe: "THẺ THÁNG XE MÁY", ngayHetHan: "2024-01-20", trangThai: "Sắp hết hạn", tangGuiXe: "Tầng 1" },
  { id: 2, cardNo: "0002100002", maThe: "TM002", bienSo: "51F-888.88", khachHang: "Trần Thị Bích", nhomThe: "THẺ THÁNG Ô TÔ", ngayHetHan: "2024-01-18", trangThai: "Hết hạn", tangGuiXe: "Tầng 2" },
  { id: 3, cardNo: "0002100003", maThe: "TM003", bienSo: "29X3-144.84", khachHang: "Lê Văn Cường", nhomThe: "THẺ THÁNG XE MÁY", ngayHetHan: "2024-01-25", trangThai: "Sắp hết hạn", tangGuiXe: "Tầng 1" },
  { id: 4, cardNo: "0002100004", maThe: "TM004", bienSo: "30G-456.78", khachHang: "Phạm Thị Duyên", nhomThe: "THẺ THÁNG Ô TÔ", ngayHetHan: "2024-02-28", trangThai: "Còn hạn", tangGuiXe: "Tầng 3" },
  { id: 5, cardNo: "0002100005", maThe: "TM005", bienSo: "43A-999.11", khachHang: "Hoàng Văn Em", nhomThe: "THẺ THÁNG XE MÁY", ngayHetHan: "2024-01-10", trangThai: "Hết hạn", tangGuiXe: "Tầng 2" },
  { id: 6, cardNo: "0002100006", maThe: "TM006", bienSo: "61C-333.55", khachHang: "Vũ Thị Phương", nhomThe: "THẺ THÁNG XE MÁY", ngayHetHan: "2025-03-31", trangThai: "Còn hạn", tangGuiXe: "Tầng 3" },
];

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

const priceMap: Record<string, Record<number, string>> = {
  "THẺ THÁNG XE MÁY": { 1: "100.000", 3: "280.000", 6: "530.000" },
  "THẺ THÁNG Ô TÔ": { 1: "1.000.000", 3: "2.800.000", 6: "5.300.000" },
};

export default function CardRenew() {
  const [cardNo, setCardNo] = useState("");
  const [maThe, setMaThe] = useState("");
  const [bienSo, setBienSo] = useState("");
  const [nhomThe, setNhomThe] = useState("");
  const [khachHang, setKhachHang] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CardItem | null>(null);
  const [renewMonths, setRenewMonths] = useState<1 | 3 | 6>(1);
  const [ghiChu, setGhiChu] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const newExpiry = selected ? addMonths(selected.ngayHetHan < "2024-01-15" ? "2024-01-15" : selected.ngayHetHan, renewMonths) : "";
  const price = selected ? (priceMap[selected.nhomThe]?.[renewMonths] ?? "---") : "";

  const handleRenew = () => {
    setSuccessMsg(`Gia hạn thẻ ${selected?.maThe} thành công! Ngày hết hạn mới: ${newExpiry}`);
    setTimeout(() => setSuccessMsg(""), 3000);
    setSelected(null);
    setGhiChu("");
  };

  const columns: Column[] = [
    { key: "cardNo", label: "CardNo" },
    { key: "maThe", label: "Mã thẻ" },
    { key: "bienSo", label: "Biển số" },
    { key: "tangGuiXe", label: "Tầng" },
    { key: "khachHang", label: "Khách hàng" },
    { key: "nhomThe", label: "Nhóm thẻ" },
    {
      key: "ngayHetHan", label: "Ngày hết hạn hiện tại",
      render: (v: string, row: CardItem) => (
        <span className={
          row.trangThai === "Hết hạn" ? "text-red-600 font-medium" :
          row.trangThai === "Sắp hết hạn" ? "text-amber-600 font-medium" : "text-gray-700"
        }>{v}</span>
      ),
    },
    {
      key: "trangThai", label: "Trạng thái",
      render: (v: string) => (
        <span className={v === "Hết hạn" ? cls.badge.red : v === "Sắp hết hạn" ? cls.badge.amber : cls.badge.green}>{v}</span>
      ),
    },
    {
      key: "action", label: "Chọn", width: "65px",
      render: (_: any, row: CardItem) => (
        <button
          onClick={() => { setSelected(row); setRenewMonths(1); setGhiChu(""); }}
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            selected?.id === row.id
              ? "bg-blue-600 text-white border-blue-600"
              : "text-blue-600 border-blue-300 hover:bg-blue-50"
          }`}
        >
          {selected?.id === row.id ? "Đã chọn" : "Chọn"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* Toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2.5 rounded shadow-lg flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className={cls.filterSection}>
        <div className="flex flex-wrap gap-2 items-end mb-2">
          <FilterGroup label="CardNo">
            <input className={`${cls.input} w-[140px]`} placeholder="Nhập CardNo..." value={cardNo} onChange={e => setCardNo(e.target.value)} />
          </FilterGroup>
          <FilterGroup label="Mã thẻ">
            <input className={`${cls.input} w-[120px]`} placeholder="TM001..." value={maThe} onChange={e => setMaThe(e.target.value)} />
          </FilterGroup>
          <FilterGroup label="Biển số">
            <input className={`${cls.input} w-[130px]`} placeholder="59A-123.45" value={bienSo} onChange={e => setBienSo(e.target.value)} />
          </FilterGroup>
          <FilterGroup label="Nhóm thẻ">
            <select className={`${cls.select} w-[180px]`} value={nhomThe} onChange={e => setNhomThe(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>THẺ THÁNG XE MÁY</option>
              <option>THẺ THÁNG Ô TÔ</option>
            </select>
          </FilterGroup>
          <FilterGroup label="Khách hàng">
            <input className={`${cls.input} w-[150px]`} placeholder="Tên khách hàng..." value={khachHang} onChange={e => setKhachHang(e.target.value)} />
          </FilterGroup>
        </div>
        <div className="flex gap-2">
          <button className={cls.btnSearch}><Search className="w-3.5 h-3.5" />Tìm kiếm</button>
          <button className={cls.btnReset} onClick={() => { setCardNo(""); setMaThe(""); setBienSo(""); setNhomThe(""); setKhachHang(""); }}>
            <RotateCcw className="w-3.5 h-3.5" />Reset
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Left: Table */}
        <div className={`${cls.sectionCard} flex-1 min-w-0`}>
          <div className="px-3 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Danh sách thẻ tháng</span>
          </div>
          <div className="p-2">
            <DataTable columns={columns} data={cardData} />
            <Pagination currentPage={page} totalPages={1} totalRecords={cardData.length} onPageChange={setPage} />
          </div>
        </div>

        {/* Right: Renew form */}
        <div className="w-[290px] flex-shrink-0">
          <div className={cls.sectionCard}>
            <div className="px-3 py-2.5 bg-blue-600 rounded-t border-b border-blue-700 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Form gia hạn thẻ</span>
            </div>

            {!selected ? (
              <div className="p-6 text-center">
                <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Chọn thẻ cần gia hạn từ danh sách bên trái</p>
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {/* Card info */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />Thông tin thẻ
                  </p>
                  {[
                    { label: "CardNo", value: selected.cardNo },
                    { label: "Mã thẻ", value: selected.maThe },
                    { label: "Biển số", value: selected.bienSo },
                    { label: "Tầng gửi xe", value: selected.tangGuiXe },
                    { label: "Khách hàng", value: selected.khachHang || "---" },
                    { label: "Nhóm thẻ", value: selected.nhomThe },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-gray-500">{label}:</span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs pt-1 border-t border-blue-200 mt-1">
                    <span className="text-gray-500">Hết hạn hiện tại:</span>
                    <span className={`font-medium ${
                      selected.trangThai === "Hết hạn" ? "text-red-600" :
                      selected.trangThai === "Sắp hết hạn" ? "text-amber-600" : "text-gray-800"
                    }`}>{selected.ngayHetHan}</span>
                  </div>
                </div>

                {/* Renew options */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Thời gian gia hạn:</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([1, 3, 6] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setRenewMonths(m)}
                        className={`py-2 text-xs font-medium rounded border transition-colors ${
                          renewMonths === m
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        +{m} tháng
                      </button>
                    ))}
                  </div>
                </div>

                {/* New expiry and price */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />Ngày hết hạn mới:
                    </span>
                    <span className="font-bold text-green-700">{newExpiry}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Số tiền:</span>
                    <span className="font-bold text-blue-700">{price} VNĐ</span>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Ghi chú</label>
                  <textarea
                    className={`${cls.input} w-full h-14 py-1.5 resize-none text-xs`}
                    placeholder="Ghi chú gia hạn..."
                    value={ghiChu}
                    onChange={e => setGhiChu(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button className={`${cls.btnSearch} flex-1 justify-center`} onClick={handleRenew}>
                    <RefreshCw className="w-3.5 h-3.5" />Gia hạn
                  </button>
                  <button className={cls.btnReset} onClick={() => setSelected(null)}>
                    <X className="w-3.5 h-3.5" />Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
