import { useState } from "react";
import { getLocalTodayStr } from "../../../utils/dateUtils";
import { AlertOctagon, Plus, X } from "lucide-react";
import { cls } from "../common/ui";

type VStatus =
  | "Pending Approval"
  | "Approved-Unpaid"
  | "Paid"
  | "Waived"
  | "Rejected";

type VType = "Wrong Slot" | "Overnight" | "Overtime";

interface Violation {
  id: string;
  vehiclePlate: string;
  user: string;
  monthlyCard: string;
  slotCode: string;
  type: VType;
  amount: number;
  evidence: string;
  relatedRequestId: string;
  date: string;
  status: VStatus;
}

const MY_REPORTS: Violation[] = [
  { id: "VIO-001", vehiclePlate: "51A-12345", user: "Nguyễn Văn A", monthlyCard: "MC-C-001", slotCode: "B1-A02", type: "Wrong Slot", amount: 200000, evidence: "Camera B1 06:55", relatedRequestId: "REQ-005", date: "2026-06-13", status: "Pending Approval" },
  { id: "VIO-003", vehiclePlate: "51C-11111", user: "Lê Văn C",     monthlyCard: "MC-C-003", slotCode: "B1-B02", type: "Overtime",   amount: 100000, evidence: "Camera B1 20:30", relatedRequestId: "",        date: "2026-06-11", status: "Paid" },
  { id: "VIO-005", vehiclePlate: "51A-33333", user: "Hoàng Văn E",  monthlyCard: "MC-C-005", slotCode: "B1-A04", type: "Overnight",  amount: 500000, evidence: "Camera B1 22:50", relatedRequestId: "",        date: "2026-06-09", status: "Approved-Unpaid" },
  { id: "VIO-007", vehiclePlate: "51B-55555", user: "",              monthlyCard: "",          slotCode: "B2-A03", type: "Wrong Slot", amount: 200000, evidence: "Camera B2 14:30", relatedRequestId: "",        date: "2026-06-08", status: "Rejected" },
];

const statusBadge: Record<VStatus, string> = {
  "Pending Approval": cls.badge.amber,
  "Approved-Unpaid":  cls.badge.red,
  "Paid":             cls.badge.green,
  "Waived":           "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-700",
  "Rejected":         cls.badge.gray,
};

const emptyForm = { vehiclePlate: "", user: "", monthlyCard: "", slotCode: "", type: "Wrong Slot" as VType, amount: "", evidence: "", relatedRequestId: "" };

export default function StaffViolations() {
  const [tab, setTab] = useState<"create" | "reports">("create");
  const [reports, setReports] = useState<Violation[]>(MY_REPORTS);
  const [form, setForm] = useState(emptyForm);
  const [submitDone, setSubmitDone] = useState<Violation | null>(null);
  const [formError, setFormError] = useState("");

  const handleSubmit = () => {
    setFormError("");
    if (!form.vehiclePlate.trim()) return setFormError("Biển số xe là bắt buộc.");
    if (!form.slotCode.trim()) return setFormError("Mã slot là bắt buộc.");
    if (!form.amount || isNaN(Number(form.amount))) return setFormError("Số tiền phạt phải là số hợp lệ.");
    if (!form.evidence.trim()) return setFormError("Bằng chứng là bắt buộc.");

    const newV: Violation = {
      id: `VIO-${String(reports.length + 8).padStart(3, "0")}`,
      vehiclePlate: form.vehiclePlate,
      user: form.user,
      monthlyCard: form.monthlyCard,
      slotCode: form.slotCode,
      type: form.type,
      amount: Number(form.amount),
      evidence: form.evidence,
      relatedRequestId: form.relatedRequestId,
      date: getLocalTodayStr(),
      status: "Pending Approval",
    };
    setReports(prev => [newV, ...prev]);
    setSubmitDone(newV);
    setForm(emptyForm);
  };

  return (
    <div className={cls.pageWrapper}>
      <div className="flex items-center gap-2 mb-3">
        <AlertOctagon className="w-5 h-5 text-orange-500" />
        <h1 className="text-base font-semibold text-gray-800">Vi phạm</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-3 border-b border-gray-200">
        {[{ key: "create", label: "Tạo vi phạm" }, { key: "reports", label: "Báo cáo của tôi" }].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key as "create" | "reports"); setSubmitDone(null); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Create */}
      {tab === "create" && (
        <div className="max-w-xl">
          {submitDone ? (
            <div className={`${cls.sectionCard} p-6 text-center`}>
              <div className="text-green-600 text-lg font-semibold mb-2">Vi phạm đã được tạo!</div>
              <p className="text-sm text-gray-500 mb-1">Mã vi phạm: <strong>{submitDone.id}</strong></p>
              <p className="text-sm text-gray-500 mb-4">Trạng thái: <span className={cls.badge.amber}>Pending Approval</span></p>
              <button onClick={() => setSubmitDone(null)} className={cls.btnAdd}>
                <Plus className="w-3.5 h-3.5" />Tạo vi phạm mới
              </button>
            </div>
          ) : (
            <div className={`${cls.sectionCard} p-4`}>
              <h2 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">Thông tin vi phạm</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Biển số xe <span className="text-red-500">*</span></label>
                    <input className={`${cls.input} w-full`} placeholder="51A-12345" value={form.vehiclePlate} onChange={e => setForm(p => ({ ...p, vehiclePlate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Mã slot <span className="text-red-500">*</span></label>
                    <input className={`${cls.input} w-full`} placeholder="B1-A01" value={form.slotCode} onChange={e => setForm(p => ({ ...p, slotCode: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Người dùng (không bắt buộc)</label>
                    <input className={`${cls.input} w-full`} placeholder="Tên người dùng" value={form.user} onChange={e => setForm(p => ({ ...p, user: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Thẻ tháng (không bắt buộc)</label>
                    <input className={`${cls.input} w-full`} placeholder="MC-C-001" value={form.monthlyCard} onChange={e => setForm(p => ({ ...p, monthlyCard: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Loại vi phạm <span className="text-red-500">*</span></label>
                    <select className={`${cls.select} w-full`} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as VType }))}>
                      <option value="Wrong Slot">Wrong Slot</option>
                      <option value="Overnight">Overnight</option>
                      <option value="Overtime">Overtime</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Số tiền phạt (VNĐ) <span className="text-red-500">*</span></label>
                    <input type="number" className={`${cls.input} w-full`} placeholder="200000" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-0.5">Bằng chứng <span className="text-red-500">*</span></label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-h-[70px]"
                    placeholder="Mô tả bằng chứng, hình ảnh camera..."
                    value={form.evidence}
                    onChange={e => setForm(p => ({ ...p, evidence: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-0.5">Request liên quan (không bắt buộc)</label>
                  <input className={`${cls.input} w-full`} placeholder="REQ-001" value={form.relatedRequestId} onChange={e => setForm(p => ({ ...p, relatedRequestId: e.target.value }))} />
                </div>
                {formError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-2 py-1.5">{formError}</p>}
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSubmit} className={cls.btnSearch}>
                    <Plus className="w-3.5 h-3.5" />Tạo vi phạm
                  </button>
                  <button onClick={() => { setForm(emptyForm); setFormError(""); }} className={cls.btnReset}>
                    <X className="w-3.5 h-3.5" />Xóa form
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Reports */}
      {tab === "reports" && (
        <div className={cls.sectionCard}>
          <div className={cls.tableWrapper}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  {["ID", "Biển số", "Người dùng", "Slot", "Loại", "Số tiền", "Ngày", "Trạng thái"].map(h => (
                    <th key={h} className={cls.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((v, i) => (
                  <tr key={v.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className={cls.td}><span className="font-mono text-xs text-orange-700">{v.id}</span></td>
                    <td className={cls.td}>{v.vehiclePlate}</td>
                    <td className={cls.td}>{v.user || "—"}</td>
                    <td className={cls.td}>{v.slotCode}</td>
                    <td className={cls.td}>{v.type}</td>
                    <td className={cls.td}>{v.amount.toLocaleString("vi-VN")}</td>
                    <td className={cls.td}>{v.date}</td>
                    <td className={cls.td}><span className={statusBadge[v.status]}>{v.status}</span></td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm">Chưa có báo cáo nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
