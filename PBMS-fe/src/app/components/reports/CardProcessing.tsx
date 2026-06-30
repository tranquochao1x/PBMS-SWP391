import { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
import { cls } from "../common/ui";
import { DateInput, FilterGroup } from "../common/DateInput";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";
import { adminCardService } from "../../../services/adminCardService";

const thaoTacColors: Record<string, string> = {
  "Thêm thẻ mới": cls.badge.blue,
  "Gia hạn thẻ": cls.badge.green,
  "Khóa thẻ": cls.badge.red,
  "Mở thẻ": cls.badge.green,
  "Cập nhật biển số": cls.badge.amber,
  "Xóa thẻ": cls.badge.red,
};

const columns: Column[] = [
  { key: "stt", label: "STT", width: "40px" },
  { key: "thoiGian", label: "Thời gian" },
  { key: "cardNo", label: "CardNo" },
  { key: "nhomThe", label: "Nhóm thẻ" },
  {
    key: "thaoTac", label: "Thao tác",
    render: (v: string) => <span className={thaoTacColors[v] || cls.badge.gray}>{v}</span>,
  },
  { key: "chuThe", label: "Chủ thẻ" },
  { key: "bienSo", label: "Biển số" },
  { key: "nguoiThaoTac", label: "Người thao tác" },
];

export default function CardProcessing() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hanhDong, setHanhDong] = useState("");
  const [nguoiDung, setNguoiDung] = useState("");
  const [nhomThe, setNhomThe] = useState("");
  const [page, setPage] = useState(1);
  const [cardGroupsList, setCardGroupsList] = useState<string[]>([]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const result = await adminCardService.getCardHistories({
        keyword,
        fromDate,
        toDate,
        hanhDong,
        nguoiDung,
        nhomThe
      });
      setData(result);
      setError("");
    } catch (err: any) {
      setError(err.message || "Không thể tải lịch sử.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    
    // Load card groups dynamically for filters
    adminCardService.getAllCardGroups()
      .then(groups => setCardGroupsList(groups.map(g => g.groupName)))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchHistory();
  };

  const handleReset = () => {
    setKeyword("");
    setFromDate("");
    setToDate("");
    setHanhDong("");
    setNguoiDung("");
    setNhomThe("");
    setPage(1);
    
    setLoading(true);
    adminCardService.getCardHistories({})
      .then(res => {
        setData(res);
        setError("");
      })
      .catch(err => setError(err.message || "Lỗi tải lịch sử."))
      .finally(() => setLoading(false));
  };

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, idx) => ({
    ...item,
    stt: (page - 1) * itemsPerPage + idx + 1
  }));

  return (
    <div className="space-y-2">
      <div className={cls.filterSection}>
        <div className="flex flex-wrap gap-2 items-end mb-2">
          <FilterGroup label="Từ khóa">
            <input 
              className={`${cls.input} w-[150px]`} 
              placeholder="Biển số, số thẻ, chủ..." 
              value={keyword} 
              onChange={e => setKeyword(e.target.value)} 
            />
          </FilterGroup>
          <DateInput label="Từ ngày" value={fromDate} onChange={setFromDate} />
          <DateInput label="Đến ngày" value={toDate} onChange={setToDate} />
          <FilterGroup label="Hành động">
            <select className={`${cls.select} w-[160px]`} value={hanhDong} onChange={e => setHanhDong(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>Thêm thẻ mới</option>
              <option>Gia hạn thẻ</option>
              <option>Khóa thẻ</option>
              <option>Mở thẻ</option>
              <option>Cập nhật biển số</option>
              <option>Xóa thẻ</option>
            </select>
          </FilterGroup>
          <FilterGroup label="Người dùng">
            <select className={`${cls.select} w-[110px]`} value={nguoiDung} onChange={e => setNguoiDung(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>admin</option>
              <option>staff01</option>
              <option>staff02</option>
            </select>
          </FilterGroup>
          <FilterGroup label="Nhóm thẻ">
            <select className={`${cls.select} w-[160px]`} value={nhomThe} onChange={e => setNhomThe(e.target.value)}>
              <option value="">-- Tất cả --</option>
              {cardGroupsList.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </FilterGroup>
        </div>
        <div className="flex gap-2">
          <button className={cls.btnSearch} onClick={handleSearch}><Search className="w-3.5 h-3.5" />Tìm kiếm</button>
          <button className={cls.btnReset} onClick={handleReset}><RotateCcw className="w-3.5 h-3.5" />Reset</button>
        </div>
      </div>

      <div className={cls.sectionCard}>
        <div className="px-3 py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">Lịch sử thẻ</span>
        </div>
        <div className="p-2">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Đang tải lịch sử thẻ...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded bg-gray-50">Không có dữ liệu lịch sử thẻ.</div>
          ) : (
            <>
              <DataTable columns={columns} data={paginatedData} />
              <Pagination currentPage={page} totalPages={totalPages} totalRecords={data.length} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
