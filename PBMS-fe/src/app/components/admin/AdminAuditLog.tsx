import { useState } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { cls } from "../common/ui";

type EventType =
  | "Slot Override"
  | "Alternative Slot Proposed"
  | "Alternative Slot Accepted"
  | "Alternative Slot Rejected"
  | "Alternative Slot Expired"
  | "Force Check-out"
  | "Slot Disabled"
  | "Slot Enabled"
  | "Reservation Cancelled"
  | "Privilege Locked"
  | "Privilege Restored"
  | "Refund Status Updated";

interface AuditLog {
  id: string;
  eventType: EventType;
  performedBy: string;
  time: string;
  vehicle: string;
  oldSlot: string;
  newSlot: string;
  reason: string;
  reservationId: string;
  requestId: string;
  detail: string;
}

const SAMPLE: AuditLog[] = [
  { id: "LOG-001", eventType: "Slot Override",               performedBy: "staff01",  time: "2026-06-13 08:20", vehicle: "51A-12345", oldSlot: "B1-A01", newSlot: "B1-A03", reason: "Staff override khi vào",      reservationId: "RES-001", requestId: "",       detail: "Slot được staff ghi đè thủ công" },
  { id: "LOG-002", eventType: "Alternative Slot Proposed",   performedBy: "staff02",  time: "2026-06-13 08:45", vehicle: "51B-67890", oldSlot: "B1-B02", newSlot: "B1-B04", reason: "Slot B1-B02 đã bị chiếm",    reservationId: "RES-004", requestId: "",       detail: "Hold 30 phút" },
  { id: "LOG-003", eventType: "Alternative Slot Accepted",   performedBy: "user01",   time: "2026-06-13 09:05", vehicle: "51B-67890", oldSlot: "B1-B02", newSlot: "B1-B04", reason: "User chấp nhận slot thay thế", reservationId: "RES-004", requestId: "",       detail: "" },
  { id: "LOG-004", eventType: "Force Check-out",             performedBy: "staff01",  time: "2026-06-12 21:00", vehicle: "51C-11111", oldSlot: "B2-A02", newSlot: "",        reason: "Hết giờ, xe chưa ra",        reservationId: "",        requestId: "",       detail: "Force checkout bởi staff" },
  { id: "LOG-005", eventType: "Slot Disabled",               performedBy: "admin",    time: "2026-06-10 09:00", vehicle: "",          oldSlot: "B1-A05", newSlot: "",        reason: "Bảo trì slot",               reservationId: "",        requestId: "",       detail: "Slot B1-A05 vô hiệu hóa" },
  { id: "LOG-006", eventType: "Slot Enabled",                performedBy: "admin",    time: "2026-06-11 08:00", vehicle: "",          oldSlot: "B1-A05", newSlot: "",        reason: "Bảo trì hoàn tất",           reservationId: "",        requestId: "",       detail: "Slot B1-A05 kích hoạt lại" },
  { id: "LOG-007", eventType: "Reservation Cancelled",       performedBy: "system",   time: "2026-06-12 10:00", vehicle: "51D-22222", oldSlot: "B2-B01", newSlot: "",        reason: "No-show 2 giờ sau giờ đến",  reservationId: "RES-006", requestId: "",       detail: "Tự động hủy bởi hệ thống" },
  { id: "LOG-008", eventType: "Privilege Locked",            performedBy: "system",   time: "2026-06-11 12:00", vehicle: "51A-12345", oldSlot: "",        newSlot: "",        reason: "Đủ 3 no-show trong 30 ngày", reservationId: "",        requestId: "",       detail: "Khóa 7 ngày" },
  { id: "LOG-009", eventType: "Privilege Restored",          performedBy: "system",   time: "2026-06-12 12:00", vehicle: "51A-12345", oldSlot: "",        newSlot: "",        reason: "Hết thời gian khóa",         reservationId: "",        requestId: "",       detail: "Đặt lại no-show counter" },
  { id: "LOG-010", eventType: "Refund Status Updated",       performedBy: "admin",    time: "2026-06-09 15:30", vehicle: "51A-33333", oldSlot: "",        newSlot: "",        reason: "Admin khởi tạo hoàn tiền",   reservationId: "",        requestId: "REQ-007", detail: "Refund Pending → Refunded" },
];

const EVENT_TYPES: EventType[] = [
  "Slot Override","Alternative Slot Proposed","Alternative Slot Accepted","Alternative Slot Rejected","Alternative Slot Expired",
  "Force Check-out","Slot Disabled","Slot Enabled","Reservation Cancelled","Privilege Locked","Privilege Restored","Refund Status Updated",
];

const eventBadgeColor: Record<string, string> = {
  "Slot Override":                cls.badge.amber,
  "Alternative Slot Proposed":    cls.badge.blue,
  "Alternative Slot Accepted":    cls.badge.green,
  "Alternative Slot Rejected":    cls.badge.red,
  "Alternative Slot Expired":     cls.badge.gray,
  "Force Check-out":              cls.badge.red,
  "Slot Disabled":                cls.badge.gray,
  "Slot Enabled":                 cls.badge.green,
  "Reservation Cancelled":        cls.badge.red,
  "Privilege Locked":             "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700",
  "Privilege Restored":           cls.badge.green,
  "Refund Status Updated":        cls.badge.amber,
};

export default function AdminAuditLog() {
  const [filterEvent, setFilterEvent] = useState("");
  const [filterPerformer, setFilterPerformer] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterSlot, setFilterSlot] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filtered = SAMPLE.filter(l => {
    if (filterEvent && l.eventType !== filterEvent) return false;
    if (filterPerformer && !l.performedBy.toLowerCase().includes(filterPerformer.toLowerCase())) return false;
    if (filterVehicle && !l.vehicle.toLowerCase().includes(filterVehicle.toLowerCase())) return false;
    if (filterSlot && !l.oldSlot.includes(filterSlot) && !l.newSlot.includes(filterSlot)) return false;
    if (filterDate && !l.time.startsWith(filterDate)) return false;
    return true;
  });

  return (
    <div className={cls.pageWrapper}>
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-blue-600" />
        <h1 className="text-base font-semibold text-gray-800">Nhật ký vận hành</h1>
      </div>

      <div className={`${cls.filterSection} flex flex-wrap gap-2 items-end`}>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Loại sự kiện</label>
          <select className={cls.select} style={{ minWidth: 200 }} value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
            <option value="">Tất cả</option>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Người thực hiện</label>
          <input className={cls.input} placeholder="Nhập tên..." value={filterPerformer} onChange={e => setFilterPerformer(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Biển số xe</label>
          <input className={cls.input} placeholder="VD: 51A-..." value={filterVehicle} onChange={e => setFilterVehicle(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Slot</label>
          <input className={cls.input} placeholder="VD: B1-A01" value={filterSlot} onChange={e => setFilterSlot(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Ngày</label>
          <input type="date" className={cls.input} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <button className={cls.btnSearch}>Tìm kiếm</button>
        <button className={cls.btnReset} onClick={() => { setFilterEvent(""); setFilterPerformer(""); setFilterVehicle(""); setFilterSlot(""); setFilterDate(""); }}>
          <RefreshCw className="w-3.5 h-3.5" />Reset
        </button>
      </div>

      <div className={cls.sectionCard}>
        <div className={cls.tableWrapper}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {["Log ID", "Loại sự kiện", "Người thực hiện", "Thời gian", "Xe", "Slot cũ", "Slot mới", "Lý do", "Reservation ID", "Request ID", "Chi tiết"].map(h => (
                  <th key={h} className={cls.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className={cls.td}><span className="font-mono text-xs text-gray-600">{l.id}</span></td>
                  <td className={cls.td}><span className={eventBadgeColor[l.eventType] ?? cls.badge.gray}>{l.eventType}</span></td>
                  <td className={cls.td}>{l.performedBy}</td>
                  <td className={cls.td}>{l.time}</td>
                  <td className={cls.td}>{l.vehicle || "—"}</td>
                  <td className={cls.td}>{l.oldSlot || "—"}</td>
                  <td className={cls.td}>{l.newSlot || "—"}</td>
                  <td className={cls.td}><span className="text-xs text-gray-600 max-w-[120px] block truncate" title={l.reason}>{l.reason || "—"}</span></td>
                  <td className={cls.td}>{l.reservationId || "—"}</td>
                  <td className={cls.td}>{l.requestId || "—"}</td>
                  <td className={cls.td}><span className="text-xs text-gray-500">{l.detail || "—"}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="text-center py-8 text-gray-400 text-sm">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
