import { useState } from "react";
import { AlertCircle, Eye, X, RefreshCw, MessageSquare, Flag } from "lucide-react";
import { cls } from "../common/ui";

type PenaltyStatus =
  | "Pending Approval"
  | "Approved-Unpaid"
  | "Paid"
  | "Waived"
  | "Refund Pending"
  | "Refund Disputed"
  | "Refunded"
  | "Rejected";

type PenaltyType = "Wrong Slot" | "Overnight" | "Overtime";

interface Penalty {
  id: string;
  vehicle: string;
  type: PenaltyType;
  amount: number;
  date: string;
  status: PenaltyStatus;
}

const SAMPLE: Penalty[] = [
  { id: "PEN-001", vehicle: "51A-12345", type: "Wrong Slot",  amount: 200000, date: "2026-06-10", status: "Approved-Unpaid" },
  { id: "PEN-002", vehicle: "51A-12345", type: "Overnight",   amount: 500000, date: "2026-06-08", status: "Paid" },
  { id: "PEN-003", vehicle: "51A-12345", type: "Overtime",    amount: 100000, date: "2026-06-05", status: "Refund Pending" },
  { id: "PEN-004", vehicle: "51A-12345", type: "Wrong Slot",  amount: 200000, date: "2026-06-01", status: "Waived" },
  { id: "PEN-005", vehicle: "51A-12345", type: "Overtime",    amount: 150000, date: "2026-05-28", status: "Refunded" },
];

const statusBadge: Record<PenaltyStatus, string> = {
  "Pending Approval": cls.badge.gray,
  "Approved-Unpaid":  cls.badge.red,
  "Paid":             cls.badge.green,
  "Waived":           "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-700",
  "Refund Pending":   cls.badge.amber,
  "Refund Disputed":  "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700",
  "Refunded":         cls.badge.green,
  "Rejected":         cls.badge.gray,
};

function canSubmitAppeal(status: PenaltyStatus) {
  return status === "Approved-Unpaid";
}
function canReportRefund(status: PenaltyStatus) {
  return status === "Refund Pending" || status === "Refunded";
}

export default function UserMyPenalties() {
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewItem, setViewItem] = useState<Penalty | null>(null);
  const [appealItem, setAppealItem] = useState<Penalty | null>(null);
  const [appealNote, setAppealNote] = useState("");
  const [appealDone, setAppealDone] = useState(false);

  const filtered = SAMPLE.filter(p => {
    if (filterDate && p.date !== filterDate) return false;
    if (filterType && p.type !== filterType) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className={cls.pageWrapper}>
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h1 className="text-base font-semibold text-gray-800">Phạt của tôi</h1>
      </div>

      {/* Filters */}
      <div className={`${cls.filterSection} flex flex-wrap gap-2 items-end`}>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Ngày</label>
          <input type="date" className={cls.input} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
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
          <label className="block text-xs text-gray-500 mb-0.5">Trạng thái</label>
          <select className={cls.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả</option>
            {(Object.keys(statusBadge) as PenaltyStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button className={cls.btnSearch}><Eye className="w-3.5 h-3.5" />Tìm kiếm</button>
        <button className={cls.btnReset} onClick={() => { setFilterDate(""); setFilterType(""); setFilterStatus(""); }}>
          <RefreshCw className="w-3.5 h-3.5" />Reset
        </button>
      </div>

      {/* Table */}
      <div className={cls.sectionCard}>
        <div className={cls.tableWrapper}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {["Mã phạt", "Biển số", "Loại", "Số tiền (VNĐ)", "Ngày", "Trạng thái", "Thao tác"].map(h => (
                  <th key={h} className={cls.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className={cls.td}><span className="font-mono text-xs text-red-700">{p.id}</span></td>
                  <td className={cls.td}>{p.vehicle}</td>
                  <td className={cls.td}>{p.type}</td>
                  <td className={cls.td}><span className="font-medium">{p.amount.toLocaleString("vi-VN")}</span></td>
                  <td className={cls.td}>{p.date}</td>
                  <td className={cls.td}><span className={statusBadge[p.status]}>{p.status}</span></td>
                  <td className={cls.td}>
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => setViewItem(p)} className="h-6 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 flex items-center gap-1">
                        <Eye className="w-3 h-3" />Xem
                      </button>
                      {canSubmitAppeal(p.status) && (
                        <button onClick={() => { setAppealItem(p); setAppealNote(""); setAppealDone(false); }} className="h-6 px-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs rounded border border-amber-200 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />Khiếu nại
                        </button>
                      )}
                      {canReportRefund(p.status) && (
                        <button className="h-6 px-2 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs rounded border border-orange-200 flex items-center gap-1">
                          <Flag className="w-3 h-3" />Báo chưa hoàn tiền
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">Không có dữ liệu</td></tr>
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
              <h3 className="font-semibold text-gray-800">Chi tiết phạt – {viewItem.id}</h3>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Mã phạt", viewItem.id],
                ["Biển số", viewItem.vehicle],
                ["Loại vi phạm", viewItem.type],
                ["Số tiền", `${viewItem.amount.toLocaleString("vi-VN")} VNĐ`],
                ["Ngày", viewItem.date],
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

      {/* Appeal Modal */}
      {appealItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Gửi khiếu nại</h3>
              <button onClick={() => setAppealItem(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            {appealDone ? (
              <div className="text-center py-4">
                <div className="text-green-600 font-semibold mb-2">Khiếu nại đã được gửi!</div>
                <p className="text-sm text-gray-500">Chúng tôi sẽ xem xét và phản hồi sớm nhất.</p>
                <button onClick={() => setAppealItem(null)} className={`${cls.btnSearch} mt-4 mx-auto`}>Đóng</button>
              </div>
            ) : (
              <>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Mã phạt (tự điền)</label>
                    <input className={`${cls.input} w-full bg-gray-50`} value={appealItem.id} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Biển số (tự điền)</label>
                    <input className={`${cls.input} w-full bg-gray-50`} value={appealItem.vehicle} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Nội dung khiếu nại <span className="text-red-500">*</span></label>
                    <textarea
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-h-[80px]"
                      value={appealNote}
                      onChange={e => setAppealNote(e.target.value)}
                      placeholder="Mô tả lý do khiếu nại..."
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setAppealItem(null)} className={cls.btnSecondary}>Hủy</button>
                  <button onClick={() => appealNote.trim() && setAppealDone(true)} className={cls.btnSearch}>
                    <MessageSquare className="w-3.5 h-3.5" />Gửi khiếu nại
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
