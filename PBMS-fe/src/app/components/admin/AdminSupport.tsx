import { useState } from "react";
import { LifeBuoy, Search, RotateCcw, Eye, MessageSquare, CheckCircle, X, Clock, User, Calendar } from "lucide-react";
import { cls } from "../common/ui";

type SupportStatus = "Chờ xử lý" | "Đang xử lý" | "Đã giải quyết" | "Từ chối";

interface SupportTicket {
  id: string;
  userName: string;
  userId: string;
  subject: string;
  message: string;
  createdAt: string;
  status: SupportStatus;
  assignedTo?: string;
  reply?: string;
  repliedAt?: string;
}

const initialTickets: SupportTicket[] = [
  { id: "SUP-001", userName: "Nguyễn Văn An",   userId: "user01", subject: "Không thể gia hạn thẻ tháng",       message: "Tôi bấm nút Gia hạn nhưng QR không hiện. Vui lòng hỗ trợ.",                                    createdAt: "2024-01-15 09:10", status: "Chờ xử lý" },
  { id: "SUP-002", userName: "Trần Thị Bích",   userId: "user02", subject: "Biển số xe bị sai trên thẻ tháng",   message: "Biển số xe trên thẻ TM005 bị ghi sai. Đúng là 43A-999.11 nhưng hệ thống ghi 43A-999.10.",       createdAt: "2024-01-14 14:30", status: "Đang xử lý", assignedTo: "staff01" },
  { id: "SUP-003", userName: "Nguyễn Văn An",   userId: "user01", subject: "Không vào được bãi dù thẻ còn hạn",  message: "Sáng nay 8:00 thẻ TM001 vẫn còn hạn đến 31/12 nhưng barrier không mở khi quét thẻ.",          createdAt: "2024-01-14 08:15", status: "Đã giải quyết", assignedTo: "staff02", reply: "Đã kiểm tra và reset thiết bị quét ở cổng vào. Mời bạn thử lại, thẻ đã hoạt động bình thường.", repliedAt: "2024-01-14 10:30" },
  { id: "SUP-004", userName: "Trần Thị Bích",   userId: "user02", subject: "Hỏi về chính sách đổi tầng gửi xe",  message: "Tôi muốn đổi từ Tầng B1 sang Tầng B2 cho thẻ ô tô. Có cần làm thủ tục gì không?",              createdAt: "2024-01-13 16:00", status: "Đã giải quyết", reply: "Bạn có thể đến quầy lễ tân để yêu cầu đổi tầng. Không mất phí, chỉ cần mang thẻ gốc.", repliedAt: "2024-01-13 17:15" },
  { id: "SUP-005", userName: "Nguyễn Văn An",   userId: "user01", subject: "Yêu cầu xuất hóa đơn tháng 12",      message: "Tôi cần hóa đơn VAT cho phí gửi xe tháng 12/2023 để quyết toán công ty. Vui lòng hỗ trợ.",       createdAt: "2024-01-12 10:00", status: "Đang xử lý", assignedTo: "staff01" },
  { id: "SUP-006", userName: "Trần Thị Bích",   userId: "user02", subject: "Không nhận được email xác nhận",      message: "Sau khi đăng ký thẻ tháng mới (TM010) tôi không nhận được email xác nhận. Vui lòng gửi lại.", createdAt: "2024-01-11 09:00", status: "Từ chối",     reply: "Vui lòng kiểm tra hộp thư Spam/Junk. Email đã được gửi đúng địa chỉ.", repliedAt: "2024-01-11 11:00" },
];

const STATUS_BADGE: Record<SupportStatus, string> = {
  "Chờ xử lý":    "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "Đang xử lý":   "bg-blue-100 text-blue-700 border border-blue-200",
  "Đã giải quyết":"bg-green-100 text-green-700 border border-green-200",
  "Từ chối":      "bg-red-100 text-red-700 border border-red-200",
};

const STAFF_LIST = ["staff01", "staff02", "staff03"];

/* ─── Detail / Reply Modal ─────────────────────────────────────────── */
function TicketModal({ ticket, onClose, onUpdate }: {
  ticket: SupportTicket;
  onClose: () => void;
  onUpdate: (id: string, changes: Partial<SupportTicket>) => void;
}) {
  const [reply, setReply] = useState(ticket.reply ?? "");
  const [status, setStatus] = useState<SupportStatus>(ticket.status);
  const [assigned, setAssigned] = useState(ticket.assignedTo ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onUpdate(ticket.id, {
        status,
        assignedTo: assigned || undefined,
        reply: reply.trim() || undefined,
        repliedAt: reply.trim() ? new Date().toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ticket.repliedAt,
      });
      setSaving(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-blue-600 sticky top-0">
          <span className="text-white text-sm font-semibold flex items-center gap-2">
            <LifeBuoy className="w-4 h-4" />{ticket.id} — {ticket.subject}
          </span>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* User info */}
          <div className="bg-gray-50 rounded-lg px-4 py-3 flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /><span className="font-medium">{ticket.userName}</span> ({ticket.userId})</div>
            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Gửi lúc: <span className="font-medium">{ticket.createdAt}</span></div>
            {ticket.repliedAt && <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" />Phản hồi: <span className="font-medium">{ticket.repliedAt}</span></div>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nội dung yêu cầu</label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-gray-700 leading-relaxed">
              {ticket.message}
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Trạng thái</label>
              <select className={`${cls.select} w-full`} value={status} onChange={e => setStatus(e.target.value as SupportStatus)}>
                <option>Chờ xử lý</option>
                <option>Đang xử lý</option>
                <option>Đã giải quyết</option>
                <option>Từ chối</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Giao cho nhân viên</label>
              <select className={`${cls.select} w-full`} value={assigned} onChange={e => setAssigned(e.target.value)}>
                <option value="">-- Chưa giao --</option>
                {STAFF_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Reply */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Phản hồi cho người dùng
              {ticket.reply && <span className="ml-1 text-gray-400">(đã có phản hồi trước)</span>}
            </label>
            <textarea
              className={`${cls.input} w-full h-28 py-2 resize-none`}
              placeholder="Nhập nội dung phản hồi cho người dùng..."
              value={reply}
              onChange={e => setReply(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 h-[34px] px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />{saving ? "Đang lưu..." : "Lưu & Cập nhật"}
          </button>
          <button onClick={onClose} className="h-[34px] px-3 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm rounded transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────── */
export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const handleUpdate = (id: string, changes: Partial<SupportTicket>) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));
  };

  const filtered = tickets.filter(t => {
    const matchKw = !keyword || t.id.toLowerCase().includes(keyword.toLowerCase()) ||
      t.userName.toLowerCase().includes(keyword.toLowerCase()) ||
      t.subject.toLowerCase().includes(keyword.toLowerCase());
    const matchStatus = !filterStatus || t.status === filterStatus;
    return matchKw && matchStatus;
  });

  const counts: Record<SupportStatus, number> = {
    "Chờ xử lý":    tickets.filter(t => t.status === "Chờ xử lý").length,
    "Đang xử lý":   tickets.filter(t => t.status === "Đang xử lý").length,
    "Đã giải quyết":tickets.filter(t => t.status === "Đã giải quyết").length,
    "Từ chối":      tickets.filter(t => t.status === "Từ chối").length,
  };

  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex items-center gap-2">
        <LifeBuoy className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">Xử lý đơn hỗ trợ người dùng</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {([
          ["Chờ xử lý",    counts["Chờ xử lý"],    "bg-yellow-50 border-yellow-200 text-yellow-700"],
          ["Đang xử lý",   counts["Đang xử lý"],   "bg-blue-50 border-blue-200 text-blue-700"],
          ["Đã giải quyết",counts["Đã giải quyết"],"bg-green-50 border-green-200 text-green-700"],
          ["Từ chối",      counts["Từ chối"],      "bg-red-50 border-red-200 text-red-700"],
        ] as [SupportStatus, number, string][]).map(([label, count, style]) => (
          <button
            key={label}
            onClick={() => setFilterStatus(filterStatus === label ? "" : label)}
            className={`border rounded shadow-sm px-4 py-3 text-left transition-all ${style} ${filterStatus === label ? "ring-2 ring-offset-1 ring-current" : ""}`}
          >
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-xs font-medium mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className={cls.filterSection}>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tìm kiếm</label>
            <input
              className={`${cls.input} w-[220px]`}
              placeholder="Mã, tên user, tiêu đề..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Trạng thái</label>
            <select className={`${cls.select} w-[160px]`} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option>Chờ xử lý</option>
              <option>Đang xử lý</option>
              <option>Đã giải quyết</option>
              <option>Từ chối</option>
            </select>
          </div>
          <button className={cls.btnSearch} onClick={() => {}}><Search className="w-3.5 h-3.5" />Tìm kiếm</button>
          <button className={cls.btnReset} onClick={() => { setKeyword(""); setFilterStatus(""); }}><RotateCcw className="w-3.5 h-3.5" />Reset</button>
        </div>
      </div>

      {/* Table */}
      <div className={cls.sectionCard}>
        <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Danh sách đơn hỗ trợ</span>
          <span className="text-xs text-gray-400">Tổng: {filtered.length} đơn</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Mã đơn", "Người dùng", "Tiêu đề", "Thời gian gửi", "Giao cho", "Trạng thái", "Thao tác"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Không có đơn hỗ trợ nào</td></tr>
              ) : filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}>
                  <td className="px-3 py-2 text-xs font-semibold text-blue-700">{t.id}</td>
                  <td className="px-3 py-2">
                    <div className="text-xs font-medium text-gray-800">{t.userName}</div>
                    <div className="text-[10px] text-gray-400">{t.userId}</div>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-700 max-w-[200px] truncate" title={t.subject}>{t.subject}</td>
                  <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.createdAt}</div>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {t.assignedTo
                      ? <span className="inline-flex px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">{t.assignedTo}</span>
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_BADGE[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-2 py-1 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />Xem
                      </button>
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-400 px-2 py-1 rounded transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />Phản hồi
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
