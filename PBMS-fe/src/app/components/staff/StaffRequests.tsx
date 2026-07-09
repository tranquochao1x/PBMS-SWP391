import { useState } from "react";
import { ClipboardList, Eye, Play, MessageSquare, CheckCircle, X, RefreshCw } from "lucide-react";
import { cls } from "../common/ui";

type ReqType =
  | "Wrong Slot Parking Report"
  | "Cannot Enter"
  | "Cannot Exit"
  | "Monthly Card Information Error"
  | "Penalty Appeal"
  | "Vehicle Information Update"
  | "Report Refund Not Received";

type ReqStatus = "Pending" | "Processing" | "Resolved" | "Rejected";
type Priority = "High" | "Medium" | "Low";

interface StaffRequest {
  id: string;
  type: ReqType;
  user: string;
  vehicle: string;
  status: ReqStatus;
  priority: Priority;
  assignedAt: string;
  notes: string[];
}

const SAMPLE: StaffRequest[] = [
  { id: "REQ-002", type: "Wrong Slot Parking Report",       user: "Trần Thị B", vehicle: "51B-67890", status: "Processing", priority: "High",   assignedAt: "2026-06-13 08:10", notes: [] },
  { id: "REQ-006", type: "Cannot Exit",                     user: "Đỗ Thị F",   vehicle: "51B-44444", status: "Processing", priority: "High",   assignedAt: "2026-06-10 11:15", notes: ["Đã kiểm tra máy đọc thẻ"] },
  { id: "REQ-008", type: "Wrong Slot Parking Report",       user: "Vũ Thị H",   vehicle: "51D-66666", status: "Processing", priority: "Medium", assignedAt: "2026-06-09 16:30", notes: [] },
  { id: "REQ-009", type: "Monthly Card Information Error",  user: "Cao Văn I",   vehicle: "51A-77777", status: "Pending",    priority: "Low",    assignedAt: "2026-06-13 09:00", notes: [] },
  { id: "REQ-010", type: "Penalty Appeal",                  user: "Ngô Thị J",   vehicle: "51B-88888", status: "Pending",    priority: "Medium", assignedAt: "2026-06-13 10:30", notes: [] },
];

const statusBadge: Record<ReqStatus, string> = {
  Pending:    cls.badge.amber,
  Processing: cls.badge.blue,
  Resolved:   cls.badge.green,
  Rejected:   cls.badge.gray,
};

const priorityBadge: Record<Priority, string> = {
  High:   cls.badge.red,
  Medium: cls.badge.amber,
  Low:    cls.badge.gray,
};

const REQ_TYPES: ReqType[] = [
  "Wrong Slot Parking Report","Cannot Enter","Cannot Exit",
  "Monthly Card Information Error","Penalty Appeal",
  "Vehicle Information Update","Report Refund Not Received",
];

export default function StaffRequests() {
  const [data, setData] = useState<StaffRequest[]>(SAMPLE);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [viewItem, setViewItem] = useState<StaffRequest | null>(null);
  const [noteItem, setNoteItem] = useState<StaffRequest | null>(null);
  const [noteText, setNoteText] = useState("");
  const [resolveItem, setResolveItem] = useState<StaffRequest | null>(null);
  const [resolveNote, setResolveNote] = useState("");

  const filtered = data.filter(r => {
    if (filterType && r.type !== filterType) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterDate && !r.assignedAt.startsWith(filterDate)) return false;
    if (keyword && !r.id.includes(keyword) && !r.user.toLowerCase().includes(keyword.toLowerCase()) && !r.vehicle.includes(keyword)) return false;
    return true;
  });

  const startProcessing = (id: string) => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: "Processing" as ReqStatus } : r));
  };

  const addNote = () => {
    if (!noteItem || !noteText.trim()) return;
    setData(prev => prev.map(r => r.id === noteItem.id ? { ...r, notes: [...r.notes, noteText.trim()] } : r));
    setNoteItem(null);
    setNoteText("");
  };

  const markResolved = () => {
    if (!resolveItem || !resolveNote.trim()) return;
    setData(prev => prev.map(r => r.id === resolveItem.id ? { ...r, status: "Resolved" as ReqStatus, notes: [...r.notes, `[Giải quyết] ${resolveNote.trim()}`] } : r));
    setResolveItem(null);
    setResolveNote("");
  };

  return (
    <div className={cls.pageWrapper}>
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        <h1 className="text-base font-semibold text-gray-800">Yêu cầu được phân công</h1>
      </div>

      <div className={`${cls.filterSection} flex flex-wrap gap-2 items-end`}>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Loại</label>
          <select className={cls.select} style={{ minWidth: 180 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Tất cả</option>
            {REQ_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Trạng thái</label>
          <select className={cls.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Ngày</label>
          <input type="date" className={cls.input} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Từ khóa</label>
          <input className={cls.input} placeholder="ID, tên, biển số..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
        <button className={cls.btnSearch}>Tìm kiếm</button>
        <button className={cls.btnReset} onClick={() => { setFilterType(""); setFilterStatus(""); setFilterDate(""); setKeyword(""); }}>
          <RefreshCw className="w-3.5 h-3.5" />Reset
        </button>
      </div>

      <div className={cls.sectionCard}>
        <div className={cls.tableWrapper}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {["Request ID", "Loại", "Người dùng", "Xe", "Trạng thái", "Ưu tiên", "Phân công lúc", "Thao tác"].map(h => (
                  <th key={h} className={cls.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className={cls.td}><span className="font-mono text-xs text-blue-700">{r.id}</span></td>
                  <td className={cls.td}><span className="text-xs">{r.type}</span></td>
                  <td className={cls.td}>{r.user}</td>
                  <td className={cls.td}>{r.vehicle}</td>
                  <td className={cls.td}><span className={statusBadge[r.status]}>{r.status}</span></td>
                  <td className={cls.td}><span className={priorityBadge[r.priority]}>{r.priority}</span></td>
                  <td className={cls.td}>{r.assignedAt}</td>
                  <td className={cls.td}>
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => setViewItem(r)} className="h-6 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                      </button>
                      {r.status === "Pending" && (
                        <button onClick={() => startProcessing(r.id)} className="h-6 px-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs rounded border border-sky-200 flex items-center gap-1">
                          <Play className="w-3 h-3" />Bắt đầu
                        </button>
                      )}
                      {r.status !== "Resolved" && (
                        <button onClick={() => { setNoteItem(r); setNoteText(""); }} className="h-6 px-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs rounded border border-amber-200 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />Ghi chú
                        </button>
                      )}
                      {r.status === "Processing" && (
                        <button onClick={() => { setResolveItem(r); setResolveNote(""); }} className="h-6 px-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded border border-green-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />Hoàn tất
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm">Không có yêu cầu nào được phân công</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Chi tiết – {viewItem.id}</h3>
              <button onClick={() => setViewItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[["ID", viewItem.id],["Loại", viewItem.type],["Người dùng", viewItem.user],["Xe", viewItem.vehicle],["Trạng thái", viewItem.status],["Ưu tiên", viewItem.priority],["Phân công lúc", viewItem.assignedAt]].map(([k,v]) => (
                <div key={k} className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">{k}:</span><span className="font-medium">{v}</span>
                </div>
              ))}
              {viewItem.notes.length > 0 && (
                <div className="pt-1">
                  <span className="text-gray-500 text-xs">Ghi chú:</span>
                  <ul className="mt-1 space-y-1">
                    {viewItem.notes.map((n, i) => <li key={i} className="text-xs bg-gray-50 rounded px-2 py-1 border border-gray-100">{n}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setViewItem(null)} className={cls.btnSecondary}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {noteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Thêm ghi chú – {noteItem.id}</h3>
              <button onClick={() => setNoteItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <textarea className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-h-[80px]" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Nhập ghi chú..." />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setNoteItem(null)} className={cls.btnSecondary}>Hủy</button>
              <button onClick={addNote} disabled={!noteText.trim()} className={`${cls.btnSearch} ${!noteText.trim() ? "opacity-50 cursor-not-allowed" : ""}`}>Lưu ghi chú</button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Đánh dấu hoàn tất – {resolveItem.id}</h3>
              <button onClick={() => setResolveItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <textarea className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-h-[80px]" value={resolveNote} onChange={e => setResolveNote(e.target.value)} placeholder="Ghi chú giải quyết..." />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setResolveItem(null)} className={cls.btnSecondary}>Hủy</button>
              <button onClick={markResolved} disabled={!resolveNote.trim()} className={`${cls.btnSearch} ${!resolveNote.trim() ? "opacity-50 cursor-not-allowed" : ""}`}>
                <CheckCircle className="w-3.5 h-3.5" />Xác nhận hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
