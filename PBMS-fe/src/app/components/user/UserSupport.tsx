import { useState, useEffect } from "react";
import { LifeBuoy, Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Send, CheckCircle, Eye, X } from "lucide-react";
import { adminCardService, RequestSupportDto } from "../../../services/adminCardService";

const faqs = [
  { q: "Làm thế nào để gia hạn thẻ tháng?", a: "Vào mục 'Thẻ tháng của tôi', chọn thẻ cần gia hạn và nhấn nút 'Gia hạn'. Chọn số tháng và thanh toán qua QR." },
  { q: "Tôi quên mật khẩu, phải làm gì?", a: "Vui lòng liên hệ với bộ phận hỗ trợ qua email hoặc số điện thoại bên dưới để được cấp lại mật khẩu." },
  { q: "Biển số xe trên thẻ bị sai, cần cập nhật ở đâu?", a: "Vào mục 'Thẻ tháng của tôi', nhấn 'Xem chi tiết' trên thẻ cần cập nhật. Liên hệ nhân viên tại bãi xe để yêu cầu chỉnh sửa." },
  { q: "Thẻ tháng hết hạn có còn vào được bãi không?", a: "Không. Thẻ hết hạn sẽ bị từ chối ở cổng vào. Vui lòng gia hạn trước ngày hết hạn để tránh gián đoạn." },
  { q: "Tôi có thể đặt thẻ tháng cho ô tô không?", a: "Có. Khi thêm thẻ mới, chọn 'THÈ THÁNG Ô TÔ' và chọn 'Tầng gửi xe' (Tầng B1 hoặc B2) cho phù hợp." },
];

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

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "PENDING": return "px-2 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200";
    case "PROCESSING": return "px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200";
    case "RESOLVED":
    case "APPROVED": return "px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "REJECTED": return "px-2 py-0.5 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200";
    case "CANCELLED": return "px-2 py-0.5 text-xs font-semibold rounded bg-gray-50 text-gray-700 border border-gray-200";
    default: return "px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-800 border border-gray-300";
  }
};

export default function UserSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [requests, setRequests] = useState<RequestSupportDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<RequestSupportDto | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminCardService.getMyRequests();
      setRequests(data);
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải danh sách yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!form.subject.trim() || !form.message.trim()) return;
    try {
      setError("");
      await adminCardService.createSupportRequest({
        subject: form.subject.trim(),
        description: form.message.trim(),
        requestType: "SUPPORT",
      });
      setSent(true);
      setForm({ subject: "", message: "" });
      fetchRequests();
      setTimeout(() => { setSent(false); }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gửi yêu cầu hỗ trợ thất bại.");
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-8">
      {/* Title */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex items-center gap-2">
        <LifeBuoy className="w-4 h-4 text-emerald-600" />
        <span className="text-sm font-semibold text-gray-700">Hỗ trợ</span>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: Phone,          label: "Hotline",    value: "1800 6789",              color: "bg-blue-50 border-blue-200",    ic: "text-blue-600" },
          { icon: Mail,           label: "Email",      value: "support@parking.vn",     color: "bg-emerald-50 border-emerald-200", ic: "text-emerald-600" },
          { icon: MessageCircle,  label: "Chat trực tiếp", value: "T2–T6: 08:00–17:00", color: "bg-amber-50 border-amber-200",  ic: "text-amber-600" },
        ].map(({ icon: Icon, label, value, color, ic }) => (
          <div key={label} className={`border rounded-lg px-4 py-3 flex items-center gap-3 ${color}`}>
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Icon className={`w-4 h-4 ${ic}`} />
            </div>
            <div>
              <div className="text-xs text-gray-500">{label}</div>
              <div className="text-sm font-semibold text-gray-800">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Câu hỏi thường gặp</span>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 pr-4">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 text-sm text-gray-600 bg-blue-50/40 border-t border-blue-100">
                  <p className="pt-2">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contact form */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded shadow-sm overflow-hidden h-fit">
          <div className="px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Gửi yêu cầu hỗ trợ</span>
          </div>
          <div className="p-4 space-y-3">
            {sent ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <p className="text-sm font-semibold text-emerald-700">Yêu cầu đã được gửi thành công!</p>
                <p className="text-xs text-gray-500">Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
              </div>
            ) : (
              <>
                {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                  <input
                    className="w-full h-[36px] border border-gray-300 rounded px-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    placeholder="Nhập tiêu đề yêu cầu..."
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nội dung <span className="text-red-500">*</span></label>
                  <textarea
                    className="w-full h-28 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none"
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSend}
                    disabled={!form.subject.trim() || !form.message.trim()}
                    className="flex items-center gap-1.5 h-[36px] px-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors w-full justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />Gửi yêu cầu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* History table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Lịch sử yêu cầu</span>
            </div>
            <button onClick={fetchRequests} className="text-xs text-blue-600 hover:underline">Tải lại</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">Mã đơn</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">Tiêu đề</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">Ngày gửi</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">Đang tải dữ liệu...</td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">Chưa có yêu cầu hỗ trợ nào</td>
                  </tr>
                ) : (
                  requests.map(req => (
                    <tr key={req.requestId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-blue-700">{req.requestNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 break-words">{req.subject}</td>
                      <td className="px-4 py-3">
                        <span className={statusBadgeClass(req.status)}>{mapStatusToVi(req.status)}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {req.createdAt ? new Date(req.createdAt).toLocaleString("vi-VN") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="h-6 w-6 rounded hover:bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-150">
            <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 text-sm">Chi tiết yêu cầu – {selectedRequest.requestNo}</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-3 text-sm max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Tiêu đề:</span>
                <span className="col-span-2 text-gray-800">{selectedRequest.subject}</span>
              </div>

              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Trạng thái:</span>
                <span className="col-span-2">
                  <span className={statusBadgeClass(selectedRequest.status)}>{mapStatusToVi(selectedRequest.status)}</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Người gửi:</span>
                <span className="col-span-2 text-gray-800">{selectedRequest.senderName || "—"}</span>
              </div>

              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Người xử lý:</span>
                <span className="col-span-2 text-gray-800">{selectedRequest.assignedStaffName || "Chưa phân công"}</span>
              </div>

              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Thời gian gửi:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString("vi-VN") : "—"}
                </span>
              </div>

              <div className="space-y-1 bg-gray-50 rounded p-2.5 border border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nội dung chi tiết:</div>
                <div className="text-gray-700 whitespace-pre-wrap text-xs font-mono">{selectedRequest.description}</div>
              </div>

              {selectedRequest.adminNote && (
                <div className="space-y-1 bg-emerald-50/50 rounded p-2.5 border border-emerald-200 text-emerald-800">
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Phản hồi của Admin:</div>
                  <div className="text-gray-700 whitespace-pre-wrap text-xs">{selectedRequest.adminNote}</div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-200">
              <button
                onClick={() => setSelectedRequest(null)}
                className="h-[32px] px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
