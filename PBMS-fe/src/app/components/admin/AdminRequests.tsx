import { useState, useEffect } from "react";
import { ClipboardList, Eye, CheckCircle, XCircle, UserCheck, X, RefreshCw } from "lucide-react";
import { cls } from "../common/ui";
import { adminCardService, RequestSupportDto } from "../../../services/adminCardService";
import { staffService, StaffMinimalDto } from "../../../services/staffService";

const statusBadge: Record<string, string> = {
  PENDING:    cls.badge.amber,
  PROCESSING: cls.badge.blue,
  RESOLVED:   cls.badge.green,
  APPROVED:   cls.badge.green,
  REJECTED:   cls.badge.red,
  CANCELLED:  cls.badge.gray,
};

const mapStatusToVi = (status: string) => {
  switch (status) {
    case "PENDING": return "Chờ xử lý";
    case "PROCESSING": return "Đang xử lý";
    case "RESOLVED":
    case "APPROVED": return "Đã giải quyết";
    case "REJECTED": return "Bị từ chối";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
};

export default function AdminRequests() {
  const [requests, setRequests] = useState<RequestSupportDto[]>([]);
  const [staffs, setStaffs] = useState<StaffMinimalDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  
  const [viewItem, setViewItem] = useState<RequestSupportDto | null>(null);
  
  const [approveItem, setApproveItem] = useState<RequestSupportDto | null>(null);
  const [approveNote, setApproveNote] = useState("");

  const [rejectItem, setRejectItem] = useState<RequestSupportDto | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  
  const [assignItem, setAssignItem] = useState<RequestSupportDto | null>(null);
  const [assignStaffId, setAssignStaffId] = useState<number | "">("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [reqData, staffData] = await Promise.all([
        adminCardService.getAllRequests(),
        staffService.getActiveStaffList(),
      ]);
      setRequests(reqData);
      setStaffs(staffData);
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải danh sách yêu cầu hoặc nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter(r => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterDate) {
      const datePart = r.createdAt ? r.createdAt.substring(0, 10) : "";
      if (datePart !== filterDate) return false;
    }
    return true;
  });

  const handleApprove = async () => {
    if (!approveItem) return;
    try {
      setError("");
      const updated = await adminCardService.approveRequest(approveItem.requestId, approveNote.trim());
      setRequests(prev => prev.map(r => r.requestId === updated.requestId ? updated : r));
      setApproveItem(null);
      setApproveNote("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Duyệt yêu cầu thất bại.");
    }
  };

  const handleReject = async () => {
    if (!rejectItem) return;
    try {
      setError("");
      const updated = await adminCardService.rejectRequest(rejectItem.requestId, rejectReason.trim());
      setRequests(prev => prev.map(r => r.requestId === updated.requestId ? updated : r));
      setRejectItem(null);
      setRejectReason("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Từ chối yêu cầu thất bại.");
    }
  };

  const handleAssign = async () => {
    if (!assignItem || !assignStaffId) return;
    try {
      setError("");
      const updated = await adminCardService.assignRequestStaff(assignItem.requestId, Number(assignStaffId));
      setRequests(prev => prev.map(r => r.requestId === updated.requestId ? updated : r));
      setAssignItem(null);
      setAssignStaffId("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Phân công nhân viên thất bại.");
    }
  };

  return (
    <div className={cls.pageWrapper}>
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        <h1 className="text-base font-semibold text-gray-800">Yêu cầu hỗ trợ từ Staff & Khách hàng</h1>
      </div>

      {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2.5">{error}</div>}

      <div className={`${cls.filterSection} flex flex-wrap gap-2 items-end`}>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Trạng thái</label>
          <select className={cls.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="RESOLVED">Đã giải quyết</option>
            <option value="REJECTED">Bị từ chối</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Ngày tạo</label>
          <input type="date" className={cls.input} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <button className={cls.btnSearch} onClick={fetchData}>Tìm kiếm</button>
        <button className={cls.btnReset} onClick={() => { setFilterStatus(""); setFilterDate(""); }}>
          <RefreshCw className="w-3.5 h-3.5" />Reset
        </button>
      </div>

      <div className={cls.sectionCard}>
        <div className={cls.tableWrapper}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {["Mã đơn", "Tiêu đề", "Người gửi", "Trạng thái", "Tạo lúc", "Phân công", "Thao tác"].map(h => (
                  <th key={h} className={cls.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">Không có dữ liệu</td></tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.requestId} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-gray-100/30 transition-colors`}>
                    <td className={cls.td}><span className="font-mono text-xs text-blue-700">{r.requestNo}</span></td>
                    
                    {/* Cột tiêu đề: Plain text, không hiệu ứng */}
                    <td className="px-2 py-1.5 text-sm border-r border-gray-200 text-gray-800 break-words">{r.subject}</td>
                    
                    <td className={cls.td}>{r.senderName}</td>
                    <td className={cls.td}><span className={statusBadge[r.status] || cls.badge.gray}>{mapStatusToVi(r.status)}</span></td>
                    <td className={cls.td}>{r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : "—"}</td>
                    <td className={cls.td}>{r.assignedStaffName || <span className="text-gray-400 text-xs">Chưa phân công</span>}</td>
                    <td className={cls.td}>
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => setViewItem(r)} className="h-6 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 flex items-center gap-1">
                          <Eye className="w-3 h-3" />Xem
                        </button>
                        {(r.status === "PENDING" || r.status === "PROCESSING") && (
                          <button onClick={() => { setApproveItem(r); setApproveNote(""); }} className="h-6 px-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded border border-green-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />Duyệt
                          </button>
                        )}
                        {r.status !== "RESOLVED" && r.status !== "APPROVED" && r.status !== "REJECTED" && (
                          <button onClick={() => { setRejectItem(r); setRejectReason(""); }} className="h-6 px-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded border border-red-200 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />Từ chối
                          </button>
                        )}
                        {r.status !== "RESOLVED" && r.status !== "APPROVED" && r.status !== "REJECTED" && (
                          <button onClick={() => { setAssignItem(r); setAssignStaffId(r.assignedStaffId || ""); }} className="h-6 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs rounded border border-purple-200 flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />Phân công
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5 border border-gray-150">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Chi tiết yêu cầu – {viewItem.requestNo}</h3>
              <button onClick={() => setViewItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-2 text-sm max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Mã đơn:</span>
                <span className="font-mono text-blue-700">{viewItem.requestNo}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Tiêu đề:</span>
                <span className="font-medium text-gray-800">{viewItem.subject}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Người gửi:</span>
                <span className="font-medium">{viewItem.senderName || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Trạng thái:</span>
                <span className={statusBadge[viewItem.status] || cls.badge.gray}>{mapStatusToVi(viewItem.status)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Tạo lúc:</span>
                <span>{viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString("vi-VN") : "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Phân công cho:</span>
                <span>{viewItem.assignedStaffName || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Xử lý lúc:</span>
                <span>{viewItem.processingAt ? new Date(viewItem.processingAt).toLocaleString("vi-VN") : "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Hoàn thành lúc:</span>
                <span>{viewItem.resolvedAt ? new Date(viewItem.resolvedAt).toLocaleString("vi-VN") : "—"}</span>
              </div>

              <div className="space-y-1 bg-gray-50 rounded p-2.5 border border-gray-200 mt-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nội dung chi tiết:</div>
                <div className="text-gray-700 whitespace-pre-wrap text-xs font-mono">{viewItem.description}</div>
              </div>

              {viewItem.adminNote && (
                <div className="space-y-1 bg-emerald-50/50 rounded p-2.5 border border-emerald-200 text-emerald-800 mt-2">
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Phản hồi của Admin:</div>
                  <div className="text-gray-700 whitespace-pre-wrap text-xs">{viewItem.adminNote}</div>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setViewItem(null)} className={cls.btnSecondary}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5 border border-gray-150">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Duyệt & Giải quyết yêu cầu</h3>
              <button onClick={() => setApproveItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Yêu cầu: <strong className="font-mono text-blue-700">{approveItem.requestNo}</strong></p>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 min-h-[90px] resize-none"
              value={approveNote}
              onChange={e => setApproveNote(e.target.value)}
              placeholder="Ghi chú phản hồi gửi người dùng (tùy chọn)..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setApproveItem(null)} className={cls.btnSecondary}>Hủy</button>
              <button onClick={handleApprove} className="h-[34px] px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded flex items-center gap-1.5 cursor-pointer">
                <CheckCircle className="w-3.5 h-3.5" />Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5 border border-gray-150">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Từ chối yêu cầu</h3>
              <button onClick={() => setRejectItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Yêu cầu: <strong className="font-mono text-blue-700">{rejectItem.requestNo}</strong></p>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 min-h-[90px] resize-none"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối (bắt buộc)..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRejectItem(null)} className={cls.btnSecondary}>Hủy</button>
              <button onClick={handleReject} disabled={!rejectReason.trim()} className={`${cls.btnDanger} ${!rejectReason.trim() ? "opacity-50 cursor-not-allowed" : ""}`}>
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5 border border-gray-150">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Phân công nhân viên</h3>
              <button onClick={() => setAssignItem(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Yêu cầu: <strong className="font-mono text-blue-700">{assignItem.requestNo}</strong></p>
            <select
              className={`${cls.select} w-full`}
              value={assignStaffId}
              onChange={e => setAssignStaffId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">-- Chọn nhân viên --</option>
              {staffs.map(s => (
                <option key={s.staffId} value={s.staffId}>
                  {s.fullName} ({s.staffCode})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setAssignItem(null)} className={cls.btnSecondary}>Hủy</button>
              <button onClick={handleAssign} disabled={!assignStaffId} className={`${cls.btnSearch} ${!assignStaffId ? "opacity-50 cursor-not-allowed" : ""}`}>
                <UserCheck className="w-3.5 h-3.5" />Phân công
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
