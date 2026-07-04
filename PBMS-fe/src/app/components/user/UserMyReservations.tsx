import { useState } from "react";
import { List, Eye, X, RefreshCw } from "lucide-react";
import { cls } from "../common/ui";

type ResStatus =
  | "Confirmed"
  | "Awaiting User Confirmation"
  | "Reassignment Required"
  | "Checked In"
  | "Completed"
  | "Cancelled by User"
  | "Cancelled by System"
  | "No-show";

interface Reservation {
  id: string;
  date: string;
  expectedArrival: string;
  floor: string;
  zone: string;
  slot: string;
  vehicle: string;
  status: ResStatus;
}

const SAMPLE: Reservation[] = [
  { id: "RES-001", date: "2026-06-13", expectedArrival: "08:00", floor: "B1", zone: "A", slot: "B1-A01", vehicle: "51A-12345", status: "Confirmed" },
  { id: "RES-002", date: "2026-06-12", expectedArrival: "09:30", floor: "B1", zone: "B", slot: "B1-B03", vehicle: "51A-12345", status: "Completed" },
  { id: "RES-003", date: "2026-06-11", expectedArrival: "07:45", floor: "B2", zone: "A", slot: "B2-A02", vehicle: "51A-12345", status: "No-show" },
  { id: "RES-004", date: "2026-06-14", expectedArrival: "10:00", floor: "B1", zone: "A", slot: "B1-A04", vehicle: "51A-12345", status: "Awaiting User Confirmation" },
  { id: "RES-005", date: "2026-06-10", expectedArrival: "08:30", floor: "B2", zone: "B", slot: "B2-B01", vehicle: "51A-12345", status: "Cancelled by User" },
  { id: "RES-006", date: "2026-06-09", expectedArrival: "09:00", floor: "B1", zone: "B", slot: "B1-B02", vehicle: "51A-12345", status: "Cancelled by System" },
  { id: "RES-007", date: "2026-06-15", expectedArrival: "08:15", floor: "B2", zone: "A", slot: "B2-A05", vehicle: "51A-12345", status: "Reassignment Required" },
  { id: "RES-008", date: "2026-06-08", expectedArrival: "07:00", floor: "B1", zone: "A", slot: "B1-A03", vehicle: "51A-12345", status: "Checked In" },
];

const statusBadge: Record<ResStatus, string> = {
  "Confirmed":                  cls.badge.green,
  "Awaiting User Confirmation": cls.badge.blue,
  "Reassignment Required":      "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700",
  "Checked In":                 "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-700",
  "Completed":                  cls.badge.gray,
  "Cancelled by User":          cls.badge.red,
  "Cancelled by System":        cls.badge.red,
  "No-show":                    "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-200 text-red-900",
};

function canCancel(res: Reservation): boolean {
  const arrival = new Date(`${res.date}T${res.expectedArrival}`);
  const now = new Date();
  const diffH = (arrival.getTime() - now.getTime()) / 3600000;
  return (res.status === "Confirmed" || res.status === "Awaiting User Confirmation") && diffH >= 6;
}

export default function UserMyReservations() {
  const [filterDate, setFilterDate] = useState("");
  const [filterSlot, setFilterSlot] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewItem, setViewItem] = useState<Reservation | null>(null);
  const [data, setData] = useState<Reservation[]>(SAMPLE);

  const filtered = data.filter(r => {
    if (filterDate && r.date !== filterDate) return false;
    if (filterSlot && !r.slot.toLowerCase().includes(filterSlot.toLowerCase())) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  const handleCancel = (id: string) => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: "Cancelled by User" as ResStatus } : r));
  };

  return (
    <div className={cls.pageWrapper}>
      <div className="flex items-center gap-2 mb-3">
        <List className="w-5 h-5 text-blue-600" />
        <h1 className="text-base font-semibold text-gray-800">Đặt chỗ của tôi</h1>
      </div>

      {/* Filters */}
      <div className={`${cls.filterSection} flex flex-wrap gap-2 items-end`}>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Ngày</label>
          <input type="date" className={cls.input} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Mã slot</label>
          <input className={cls.input} placeholder="VD: B1-A01" value={filterSlot} onChange={e => setFilterSlot(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Trạng thái</label>
          <select className={cls.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả</option>
            {(Object.keys(statusBadge) as ResStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button className={cls.btnSearch} onClick={() => {}}>
          <Eye className="w-3.5 h-3.5" />Tìm kiếm
        </button>
        <button className={cls.btnReset} onClick={() => { setFilterDate(""); setFilterSlot(""); setFilterStatus(""); }}>
          <RefreshCw className="w-3.5 h-3.5" />Reset
        </button>
      </div>

      {/* Table */}
      <div className={cls.sectionCard}>
        <div className={cls.tableWrapper}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {["ID", "Ngày", "Giờ dự kiến", "Tầng", "Khu", "Slot", "Xe", "Trạng thái", "Thao tác"].map(h => (
                  <th key={h} className={cls.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className={cls.td}><span className="font-mono text-xs text-blue-700">{r.id}</span></td>
                  <td className={cls.td}>{r.date}</td>
                  <td className={cls.td}>{r.expectedArrival}</td>
                  <td className={cls.td}>{r.floor}</td>
                  <td className={cls.td}>{r.zone}</td>
                  <td className={cls.td}><span className="font-medium">{r.slot}</span></td>
                  <td className={cls.td}>{r.vehicle}</td>
                  <td className={cls.td}><span className={statusBadge[r.status]}>{r.status}</span></td>
                  <td className={cls.td}>
                    <div className="flex gap-1">
                      <button onClick={() => setViewItem(r)} className="h-6 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 flex items-center gap-1">
                        <Eye className="w-3 h-3" />Xem
                      </button>
                      <button
                        onClick={() => canCancel(r) && handleCancel(r.id)}
                        disabled={!canCancel(r)}
                        className={`h-6 px-2 text-xs rounded border flex items-center gap-1 ${canCancel(r) ? "bg-red-50 hover:bg-red-100 text-red-700 border-red-200" : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"}`}
                        title={!canCancel(r) ? "Không thể hủy (< 6 giờ trước giờ đến hoặc trạng thái không hợp lệ)" : ""}
                      >
                        <X className="w-3 h-3" />Hủy
                      </button>
                      <button className="h-6 px-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded border border-green-200 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />Đặt lại
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-8 text-gray-400 text-sm">Không có dữ liệu</td></tr>
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
              <h3 className="font-semibold text-gray-800">Chi tiết đặt chỗ – {viewItem.id}</h3>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["ID", viewItem.id],
                ["Ngày", viewItem.date],
                ["Giờ dự kiến", viewItem.expectedArrival],
                ["Tầng", viewItem.floor],
                ["Khu vực", viewItem.zone],
                ["Slot", viewItem.slot],
                ["Biển số", viewItem.vehicle],
                ["Trạng thái", viewItem.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">{k}:</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setViewItem(null)} className={cls.btnSecondary}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
