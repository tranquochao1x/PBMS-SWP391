import { useState } from "react";
import { AlertTriangle, Eye, CheckCircle, XCircle, X, RefreshCw } from "lucide-react";
import { cls } from "../common/ui";

type VStatus =
  | "Pending Approval"
  | "Approved-Unpaid"
  | "Paid"
  | "Waived"
  | "Refund Pending"
  | "Refund Disputed"
  | "Refunded"
  | "Rejected";

type VType = "Wrong Slot" | "Overnight" | "Overtime";

interface Violation {
  id: string;
  vehiclePlate: string;
  user: string;
  monthlyCard: string;
  slot: string;
  type: VType;
  amount: number;
  evidence: string;
  relatedRequestId: string;
  createdBy: string;
  status: VStatus;
  date: string;
}

const SAMPLE: Violation[] = [
  { id: "VIO-001", vehiclePlate: "51A-12345", user: "Nguyễn Văn A", monthlyCard: "MC-C-001", slot: "B1-A02", type: "Wrong Slot",  amount: 200000, evidence: "Camera B1 06:55", relatedRequestId: "REQ-005", createdBy: "staff01", status: "Pending Approval", date: "2026-06-13" },
  { id: "VIO-002", vehiclePlate: "51B-67890", user: "Trần Thị B",   monthlyCard: "MC-C-002", slot: "B2-B01", type: "Overnight",    amount: 500000, evidence: "Camera B2 23:00",  relatedRequestId: "",        createdBy: "staff02", status: "Approved-Unpaid", date: "2026-06-12" },
  { id: "VIO-003", vehiclePlate: "51C-11111", user: "Lê Văn C",     monthlyCard: "MC-C-003", slot: "B1-B02", type: "Overtime",     amount: 100000, evidence: "Camera B1 20:30",  relatedRequestId: "",        createdBy: "staff01", status: "Paid",            date: "2026-06-11" },
  { id: "VIO-004", vehiclePlate: "51D-22222", user: "Phạm Thị D",   monthlyCard: "MC-C-004", slot: "B2-A03", type: "Wrong Slot",   amount: 200000, evidence: "Camera B2 09:10",  relatedRequestId: "REQ-008", createdBy: "staff02", status: "Waived",          date: "2026-06-10" },
  { id: "VIO-005", vehiclePlate: "51A-33333", user: "Hoàng Văn E",  monthlyCard: "MC-C-005", slot: "B1-A04", type: "Overnight",    amount: 500000, evidence: "Camera B1 22:50",  relatedRequestId: "",        createdBy: "staff01", status: "Refund Pending",   date: "2026-06-09" },
  { id: "VIO-006", vehiclePlate: "51B-44444", user: "Đỗ Thị F",     monthlyCard: "MC-C-006", slot: "B2-B02", type: "Overtime",     amount: 150000, evidence: "Camera B2 19:00",  relatedRequestId: "",        createdBy: "staff02", status: "Rejected",        date: "2026-06-08" },
];

const statusBadge: Record<VStatus, string> = {
  "Pending Approval": cls.badge.amber,
  "Approved-Unpaid":  cls.badge.red,
  "Paid":             cls.badge.green,
  "Waived":           "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-700",
  "Refund Pending":   cls.badge.amber,
  "Refund Disputed":  "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700",
  "Refunded":         cls.badge.green,
  "Rejected":         cls.badge.gray,
};

export default function AdminViolations() {
  const [data, setData] = useState<Violation[]>(SAMPLE);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [viewItem, setViewItem] = useState<Violation | null>(null);
  const [approveItem, setApproveItem] = useState<Violation | null>(null);
  const [rejectItem, setRejectItem] = useState<Violation | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = data.filter(v => {
    if (filterStatus && v.status !== filterStatus) return false;
    if (filterType && v.type !== filterType) return false;
    if (filterDate && v.date !== filterDate) return false;
    return true;
  });

  const doApprove = () => {
    if (!approveItem) return;
    setData(prev => prev.map(v => v.id === approveItem.id ? { ...v, status: "Approved-Unpaid" as VStatus } : v));
    setApproveItem(null);
  };

  const doReject = () => {
    if (!rejectItem || !rejectReason.trim()) return;
    setData(prev => prev.map(v => v.id === rejectItem.id ? { ...v, status: "Rejected" as VStatus } : v));
    setRejectItem(null);
    setRejectReason("");
  };

  return (
    <div className={cls.pageWrapper}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h1 className="text-base font-semibold text-gray-800">Vi phạm</h1>
      </div>

      <div className={`${cls.filterSection} flex flex-wrap gap-2 items-end`}>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Trạng thái</label>
          <select className={cls.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả</option>
            {(Object.keys(statusBadge) as VStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Loại</label>
          <select className={cls.select} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="Wrong Slot">Wrong Slot</option>
            <option value="Overnight">Overnight</option>
            <option value="Overtime">Overtime</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Ngày</label>
          <input type="date" className={cls.input} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <button className={cls.btnSearch}>Tìm kiếm</button>
        <button className={cls.btnReset} onClick={() => { setFilterStatus(""); setFilterType(""); setFilterDate(""); }}>
          <RefreshCw className="w-3.5 h-3.5" />Reset
        </button>
      </div>

      <div className={cls.sectionCard}>
        <div className={cls.tableWrapper}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {["ID", "Biển số", "Người dùng", "Thẻ tháng", "Slot", "Loại", "Số tiền", "Bằng chứng", "Req liên quan", "Tạo bởi", "Trạng thái", "Thao tác"].map(h => (
                  <th key={h} className={cls.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className={cls.td}><span className="font-mono text-xs text-amber-700">{v.id}</span></td>
                  <td className={cls.td}>{v.vehiclePlate}</td>
                  <td className={cls.td}>{v.user}</td>
                  <td className={cls.td}>{v.monthlyCard}</td>
                  <td className={cls.td}>{v.slot}</td>
                  <td className={cls.td}>{v.type}</td>
                  <td className={cls.td}>{v.amount.toLocaleString("vi-VN")}</td>
                  <td className={cls.td}><span className="text-xs text-gray-500 truncate max-w-[80px] block">{v.evidence}</span></td>
                  <td className={cls.td}>{v.relatedRequestId || "—"}</td>
                  <td className={cls.td}>{v.createdBy}</td>
                  <td className={cls.td}><span className={statusBadge[v.status]}>{v.status}</span></td>
                  <td className={cls.td}>
                    <div className="flex gap-1">
                      <button onClick={() => setViewItem(v)} className="h-6 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                      </button>
                      {v.status === "Pending Approval" && (
                        <>
                          <button onClick={() => setApproveItem(v)} className="h-6 px-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded border border-green-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />Duyệt
                          </button>
                          <button onClick={() => { setRejectItem(v); setRejectReason(""); }} className="h-6 px-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded border border-red-200 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />Từ chối
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="text-center py-8 text-gray-400 text-sm">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Chi tiết vi phạm – {viewItem.id}</h3>
              <button onClick={() => setViewItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ["ID", viewItem.id], ["Biển số", viewItem.vehiclePlate], ["Người dùng", viewItem.user],
                ["Thẻ tháng", viewItem.monthlyCard], ["Slot", viewItem.slot], ["Loại", viewItem.type],
                ["Số tiền", `${viewItem.amount.toLocaleString("vi-VN")} VNĐ`], ["Bằng chứng", viewItem.evidence],
                ["Req liên quan", viewItem.relatedRequestId || "—"], ["Tạo bởi", viewItem.createdBy],
                ["Ngày", viewItem.date], ["Trạng thái", viewItem.status],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-gray-100 pb-1">
                  <span className="text-gray-500 text-xs">{k}: </span>
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

      {/* Approve Modal */}
      {approveItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Duyệt vi phạm</h3>
              <button onClick={() => setApproveItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Xác nhận duyệt vi phạm <strong>{approveItem.id}</strong>? Trạng thái sẽ chuyển thành <span className={cls.badge.red}>Approved-Unpaid</span>.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setApproveItem(null)} className={cls.btnSecondary}>Hủy</button>
              <button onClick={doApprove} className={cls.btnSearch}><CheckCircle className="w-3.5 h-3.5" />Xác nhận duyệt</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Từ chối vi phạm</h3>
              <button onClick={() => setRejectItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Vi phạm: <strong>{rejectItem.id}</strong></p>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Lý do từ chối <span className="text-red-500">*</span></label>
              <textarea
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-h-[70px]"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRejectItem(null)} className={cls.btnSecondary}>Hủy</button>
              <button onClick={doReject} disabled={!rejectReason.trim()} className={`${cls.btnDanger} ${!rejectReason.trim() ? "opacity-50 cursor-not-allowed" : ""}`}>
                <XCircle className="w-3.5 h-3.5" />Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
