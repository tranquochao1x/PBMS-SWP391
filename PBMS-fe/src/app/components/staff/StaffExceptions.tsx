import { useState, useEffect } from "react";
import {
  LifeBuoy,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  Eye,
  X,
  FileText,
  Upload,
} from "lucide-react";
import {
  adminCardService,
  RequestSupportDto,
} from "../../../services/adminCardService";

interface SupportForm {
  subject: string;
  message: string;
}

const faqs = [
  {
    q: "Nhân viên quên mật khẩu đăng nhập phải làm gì?",
    a: "Vui lòng liên hệ quản trị viên hệ thống qua email hoặc hotline bên dưới để được đặt lại mật khẩu.",
  },
  {
    q: "Không thể xác nhận xe vào hoặc xe ra thì xử lý thế nào?",
    a: "Hãy kiểm tra kết nối mạng, thiết bị quét vé và camera. Nếu vẫn không hoạt động, gửi yêu cầu hỗ trợ kèm mô tả lỗi.",
  },
  {
    q: "Thông tin biển số xe bị nhận diện sai thì làm gì?",
    a: "Kiểm tra lại hình ảnh từ camera, đối chiếu vé xe và gửi yêu cầu hỗ trợ nếu cần điều chỉnh dữ liệu.",
  },
  {
    q: "Thiết bị quét mã QR không hoạt động thì xử lý thế nào?",
    a: "Thử khởi động lại thiết bị và kiểm tra kết nối. Nếu lỗi vẫn còn, gửi yêu cầu hỗ trợ kỹ thuật.",
  },
  {
    q: "Nhân viên có thể chỉnh sửa dữ liệu vé tháng không?",
    a: "Nhân viên chỉ có thể thực hiện các chức năng được phân quyền. Các thay đổi quan trọng cần gửi yêu cầu để quản trị viên xác nhận.",
  },
];

const contactItems = [
  {
    icon: Phone,
    label: "Hotline nội bộ",
    value: "1900 6789",
    wrapperClass: "border-blue-200 bg-blue-50",
    iconClass: "text-blue-600",
  },
  {
    icon: Mail,
    label: "Email kỹ thuật",
    value: "admin@parking.vn",
    wrapperClass: "border-emerald-200 bg-emerald-50",
    iconClass: "text-emerald-600",
  },
  {
    icon: MessageCircle,
    label: "Thời gian hỗ trợ",
    value: "T2–T7: 07:00–22:00",
    wrapperClass: "border-amber-200 bg-amber-50",
    iconClass: "text-amber-600",
  },
];

const mapStatusToVi = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Chờ xử lý";
    case "PROCESSING":
      return "Đang xử lý";
    case "RESOLVED":
    case "APPROVED":
      return "Đã giải quyết";
    case "REJECTED":
      return "Bị từ chối";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "px-2 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200";
    case "PROCESSING":
      return "px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200";
    case "RESOLVED":
    case "APPROVED":
      return "px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "REJECTED":
      return "px-2 py-0.5 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200";
    case "CANCELLED":
      return "px-2 py-0.5 text-xs font-semibold rounded bg-gray-50 text-gray-700 border border-gray-200";
    default:
      return "px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-800 border border-gray-300";
  }
};

export default function StaffExceptions() {
  const [activeTab, setActiveTab] = useState<"general" | "lost-ticket">("general");

  // --- Hỗ trợ chung State ---
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState<SupportForm>({
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [requests, setRequests] = useState<RequestSupportDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<RequestSupportDto | null>(null);

  // --- Mất vé xe State ---
  const [lostForm, setLostForm] = useState({
    name: "",
    cccd: "",
    address: "",
    plate: "",
    vehicleType: "Xe máy",
    ticketType: "Đậu xe lượt",
    entryTime: "",
    cardId: "",
    cccdFront: null as File | null,
    cccdBack: null as File | null,
    vehicleRegistration: null as File | null,
    confirmed: false,
    date: new Date().toISOString().split("T")[0],
    signature: "",
  });
  const [isSubmittingLost, setIsSubmittingLost] = useState(false);
  const [lostSent, setLostSent] = useState(false);
  const [lostError, setLostError] = useState("");

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
      setError("Không thể tải lịch sử yêu cầu hỗ trợ.");
    } finally {
      setLoading(false);
    }
  };

  const subjectValid = form.subject.trim().length > 0;
  const messageValid = form.message.trim().length > 0;
  const formValid = subjectValid && messageValid;

  const handleSend = async () => {
    if (!formValid) return;

    try {
      setError("");
      await adminCardService.createSupportRequest({
        subject: form.subject.trim(),
        description: form.message.trim(),
        requestType: "SUPPORT",
      });
      setSent(true);
      setForm({
        subject: "",
        message: "",
      });
      fetchRequests();
      setTimeout(() => {
        setSent(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gửi yêu cầu hỗ trợ thất bại.");
    }
  };

  const renderDescription = (desc: string) => {
    const isLostTicket = desc.includes("**BÁO MẤT VÉ XE**");
    
    const extractImg = (tag: string) => {
      const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`);
      const match = desc.match(regex);
      return match ? match[1] : null;
    };
  
    const cccdFront = extractImg("IMG_CCCD_FRONT");
    const cccdBack = extractImg("IMG_CCCD_BACK");
    const vReg = extractImg("IMG_VEHICLE_REG");
  
    let textDesc = desc
      .replace(/\[IMG_CCCD_FRONT\][\s\S]*?\[\/IMG_CCCD_FRONT\]/g, "")
      .replace(/\[IMG_CCCD_BACK\][\s\S]*?\[\/IMG_CCCD_BACK\]/g, "")
      .replace(/\[IMG_VEHICLE_REG\][\s\S]*?\[\/IMG_VEHICLE_REG\]/g, "");
  
    if (isLostTicket) {
      const lines = textDesc.split("\n").filter(l => l.trim() !== "" && !l.includes("**BÁO MẤT VÉ XE**"));
      return (
        <div className="mt-2 space-y-3">
          <div className="bg-red-50 text-red-700 font-bold px-3 py-2 rounded border border-red-200 text-center">
            📄 BIÊN BẢN THẤT LẠC THẺ XE
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-sm space-y-2">
            {lines.map((line, idx) => {
              const parts = line.replace("- ", "").split(":");
              if (parts.length < 2) return <div key={idx} className="text-gray-700">{line}</div>;
              const key = parts[0].trim();
              const val = parts.slice(1).join(":").trim();
              return (
                <div key={idx} className="flex flex-col sm:flex-row py-1.5 border-b border-gray-50 last:border-0">
                  <span className="font-semibold text-gray-500 sm:w-1/3">{key}</span>
                  <span className="text-gray-900 font-medium sm:w-2/3">{val}</span>
                </div>
              );
            })}
          </div>
          
          {(cccdFront || cccdBack || vReg) && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">Ảnh chứng minh đính kèm</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {cccdFront && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500 block">CCCD (Mặt trước)</span>
                    <img src={cccdFront} alt="CCCD Front" className="w-full h-32 object-cover rounded border border-gray-300 shadow-sm" />
                  </div>
                )}
                {cccdBack && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500 block">CCCD (Mặt sau)</span>
                    <img src={cccdBack} alt="CCCD Back" className="w-full h-32 object-cover rounded border border-gray-300 shadow-sm" />
                  </div>
                )}
                {vReg && (
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-xs font-medium text-gray-500 block">Cà vẹt xe</span>
                    <img src={vReg} alt="Vehicle Registration" className="w-full h-40 object-cover rounded border border-gray-300 shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
  
    return (
      <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
        {textDesc}
      </div>
    );
  };

  const isCardIdValid = /^KZP\d{7}$/.test(lostForm.cardId.trim());

  const lostFormValid =
    lostForm.name.trim() !== "" &&
    lostForm.cccd.trim() !== "" &&
    lostForm.plate.trim() !== "" &&
    isCardIdValid &&
    lostForm.confirmed &&
    lostForm.signature.trim() !== "";

  const handleSendLostTicket = async () => {
    if (!lostFormValid || isSubmittingLost) return;

    try {
      setIsSubmittingLost(true);
      setLostError("");

      const toBase64 = (file: File) => new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      let cccdFrontB64 = "";
      let cccdBackB64 = "";
      let vRegB64 = "";
      if (lostForm.cccdFront) cccdFrontB64 = await toBase64(lostForm.cccdFront);
      if (lostForm.cccdBack) cccdBackB64 = await toBase64(lostForm.cccdBack);
      if (lostForm.vehicleRegistration) vRegB64 = await toBase64(lostForm.vehicleRegistration);

      let description = `**BÁO MẤT VÉ XE**\n- Họ tên: ${lostForm.name}\n- CCCD: ${lostForm.cccd}\n- Địa chỉ: ${lostForm.address}\n- Biển số xe: ${lostForm.plate} (${lostForm.vehicleType})\n- Hình thức đặt: ${lostForm.ticketType}\n- Ngày giờ vào: ${lostForm.entryTime}\n- Mã thẻ: ${lostForm.cardId}\n- Đã nộp phí 100.000 VNĐ: Xác nhận\n- Ngày: ${lostForm.date}\n- Ký tên: ${lostForm.signature}`;
      
      if (cccdFrontB64) description += `\n[IMG_CCCD_FRONT]${cccdFrontB64}[/IMG_CCCD_FRONT]`;
      if (cccdBackB64) description += `\n[IMG_CCCD_BACK]${cccdBackB64}[/IMG_CCCD_BACK]`;
      if (vRegB64) description += `\n[IMG_VEHICLE_REG]${vRegB64}[/IMG_VEHICLE_REG]`;
      
      await adminCardService.createSupportRequest({
        subject: `Báo thất lạc thẻ xe - ${lostForm.plate}`,
        description: description,
        requestType: "LOST_CARD",
      });

      setLostSent(true);
      setLostForm({
        ...lostForm,
        name: "",
        cccd: "",
        address: "",
        plate: "",
        entryTime: "",
        cardId: "",
        cccdFront: null,
        cccdBack: null,
        vehicleRegistration: null,
        confirmed: false,
        signature: "",
      });
      fetchRequests();
      setTimeout(() => {
        setLostSent(false);
        setActiveTab("general");
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setLostError(err.message || "Gửi báo mất thẻ thất bại.");
    } finally {
      setIsSubmittingLost(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-8">
      {/* Tiêu đề & Tabs */}
      <div className="flex flex-col gap-2 rounded border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-semibold text-gray-700">
            Hỗ trợ dành cho nhân viên
          </span>
        </div>
        
        <div className="flex space-x-4 border-t border-gray-100 pt-2 mt-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`text-sm font-medium pb-1.5 border-b-2 transition-colors ${
              activeTab === "general"
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Hỗ trợ chung
          </button>
          <button
            onClick={() => setActiveTab("lost-ticket")}
            className={`text-sm font-medium pb-1.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "lost-ticket"
                ? "border-red-500 text-red-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            Báo mất vé xe
          </button>
        </div>
      </div>

      {activeTab === "general" ? (
        <>
          {/* Thông tin liên hệ */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {contactItems.map(
              ({ icon: Icon, label, value, wrapperClass, iconClass }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${wrapperClass}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className={`h-4 w-4 ${iconClass}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">{label}</div>
                    <div
                      className="truncate text-sm font-semibold text-gray-800"
                      title={value}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

      {/* Câu hỏi thường gặp */}
      <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2.5">
          <MessageCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">
            Câu hỏi thường gặp
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-sm font-medium text-gray-700">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-blue-100 bg-blue-50/40 px-4 pb-3 text-sm text-gray-600">
                    <p className="pt-2 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form gửi yêu cầu */}
        <div className="lg:col-span-1 overflow-hidden rounded border border-gray-200 bg-white shadow-sm h-fit">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2.5">
            <Send className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Gửi yêu cầu hỗ trợ
            </span>
          </div>

          <div className="space-y-3 p-4">
            {sent ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
                <p className="text-sm font-semibold text-emerald-700">
                  Yêu cầu đã được gửi thành công!
                </p>
                <p className="text-center text-xs text-gray-500">
                  Quản trị viên sẽ kiểm tra và phản hồi yêu cầu của bạn sớm
                  nhất.
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                    {error}
                  </div>
                )}

                {/* Tiêu đề */}
                <div>
                  <label
                    htmlFor="staff-support-subject"
                    className="mb-1 block text-xs font-medium text-gray-600"
                  >
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="staff-support-subject"
                    type="text"
                    maxLength={150}
                    className="h-[36px] w-full rounded border border-gray-300 px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    placeholder="Nhập tiêu đề yêu cầu..."
                    value={form.subject}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, subject: e.target.value }))
                    }
                  />
                  <div className="mt-1 text-right text-[10px] text-gray-400">
                    {form.subject.length}/150
                  </div>
                </div>

                {/* Nội dung */}
                <div>
                  <label
                    htmlFor="staff-support-message"
                    className="mb-1 block text-xs font-medium text-gray-600"
                  >
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="staff-support-message"
                    maxLength={1000}
                    className="h-28 w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    placeholder="Mô tả chi tiết vấn đề cần hỗ trợ..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                  />
                  <div className="mt-1 text-right text-[10px] text-gray-400">
                    {form.message.length}/1000
                  </div>
                </div>

                {/* Nút gửi */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!formValid}
                    className="flex h-[36px] w-full items-center justify-center gap-1.5 rounded bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Gửi yêu cầu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lịch sử yêu cầu */}
        <div className="lg:col-span-2 overflow-hidden rounded border border-gray-200 bg-white shadow-sm flex flex-col h-fit">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                Lịch sử yêu cầu đã gửi
              </span>
            </div>
            <button
              onClick={fetchRequests}
              className="text-xs text-blue-600 hover:underline"
            >
              Tải lại
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">
                    Mã đơn
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">
                    Tiêu đề
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">
                    Ngày gửi
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-400 text-sm"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-400 text-sm"
                    >
                      Chưa có yêu cầu hỗ trợ nào
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr
                      key={req.requestId}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-mono text-blue-700">
                        {req.requestNo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 break-words">
                        {req.subject}
                      </td>
                      <td className="px-4 py-3">
                        <span className={statusBadgeClass(req.status)}>
                          {mapStatusToVi(req.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleString("vi-VN")
                          : "—"}
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
      </>
      ) : (
        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm flex flex-col h-fit">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 bg-red-50/50">
            <FileText className="h-5 w-5 text-red-600" />
            <span className="text-base font-bold text-red-800 uppercase">
              Thông Báo Thất Lạc Thẻ Xe
            </span>
          </div>

          <div className="p-5">
            {lostSent ? (
              <div className="flex flex-col items-center gap-2 py-10">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
                <p className="text-base font-semibold text-emerald-700">
                  Biên bản báo mất vé đã được gửi thành công!
                </p>
                <p className="text-center text-sm text-gray-500">
                  Ban quản lý sẽ kiểm tra và phê duyệt yêu cầu này.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {lostError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                    {lostError}
                  </div>
                )}
                
                {/* Thông tin khách hàng */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">1. Thông tin khách hàng</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Tên <span className="text-red-500">*</span></label>
                      <input type="text" className="h-[38px] w-full rounded border border-gray-300 px-3 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none" value={lostForm.name} onChange={e => setLostForm({...lostForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">CCCD <span className="text-red-500">*</span></label>
                      <input type="text" className="h-[38px] w-full rounded border border-gray-300 px-3 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none" value={lostForm.cccd} onChange={e => setLostForm({...lostForm, cccd: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">Địa chỉ</label>
                      <input type="text" className="h-[38px] w-full rounded border border-gray-300 px-3 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none" value={lostForm.address} onChange={e => setLostForm({...lostForm, address: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Biển số xe <span className="text-red-500">*</span></label>
                      <input type="text" className="h-[38px] w-full rounded border border-gray-300 px-3 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none" value={lostForm.plate} onChange={e => setLostForm({...lostForm, plate: e.target.value})} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Loại xe</label>
                      <div className="flex gap-4 h-[38px] items-center">
                        <label className="flex items-center gap-1.5 text-sm">
                          <input type="radio" name="vehicleType" value="Xe máy" checked={lostForm.vehicleType === "Xe máy"} onChange={e => setLostForm({...lostForm, vehicleType: e.target.value})} /> Xe máy
                        </label>
                        <label className="flex items-center gap-1.5 text-sm">
                          <input type="radio" name="vehicleType" value="Xe ô tô" checked={lostForm.vehicleType === "Xe ô tô"} onChange={e => setLostForm({...lostForm, vehicleType: e.target.value})} /> Xe ô tô
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Hình thức đặt</label>
                      <div className="flex flex-wrap gap-4 items-center h-[38px]">
                        <label className="flex items-center gap-1.5 text-sm">
                          <input type="radio" name="ticketType" value="Đậu xe tháng" checked={lostForm.ticketType === "Đậu xe tháng"} onChange={e => setLostForm({...lostForm, ticketType: e.target.value})} /> Đậu xe tháng
                        </label>
                        <label className="flex items-center gap-1.5 text-sm">
                          <input type="radio" name="ticketType" value="Đậu xe ngày" checked={lostForm.ticketType === "Đậu xe ngày"} onChange={e => setLostForm({...lostForm, ticketType: e.target.value})} /> Đậu xe ngày
                        </label>
                        <label className="flex items-center gap-1.5 text-sm">
                          <input type="radio" name="ticketType" value="Đậu xe lượt" checked={lostForm.ticketType === "Đậu xe lượt"} onChange={e => setLostForm({...lostForm, ticketType: e.target.value})} /> Đậu xe lượt
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Ngày giờ vào</label>
                      <input type="datetime-local" className="h-[38px] w-full rounded border border-gray-300 px-3 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none" value={lostForm.entryTime} onChange={e => setLostForm({...lostForm, entryTime: e.target.value})} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Mã thẻ <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="VD: KZP0000001" className={`h-[38px] w-full rounded border px-3 text-sm outline-none focus:ring-1 ${lostForm.cardId.trim() && !isCardIdValid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-400 focus:ring-red-100'}`} value={lostForm.cardId} onChange={e => setLostForm({...lostForm, cardId: e.target.value.toUpperCase()})} />
                      {lostForm.cardId.trim() !== "" && !isCardIdValid && (
                        <div className="text-[10px] text-red-500 mt-1">Mã thẻ phải có định dạng KZP kèm 7 chữ số (VD: KZP0000001).</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* File đính kèm */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">2. Tải ảnh chứng minh</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">1. CCCD (Mặt trước)</label>
                      <input type="file" accept="image/*" className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" onChange={e => setLostForm({...lostForm, cccdFront: e.target.files?.[0] || null})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">2. CCCD (Mặt sau)</label>
                      <input type="file" accept="image/*" className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" onChange={e => setLostForm({...lostForm, cccdBack: e.target.files?.[0] || null})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">3. Cà vẹt xe</label>
                      <input type="file" accept="image/*" className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" onChange={e => setLostForm({...lostForm, vehicleRegistration: e.target.files?.[0] || null})} />
                    </div>
                  </div>
                </div>

                {/* Cam kết */}
                <div className="space-y-4 bg-yellow-50 p-4 rounded border border-yellow-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500" checked={lostForm.confirmed} onChange={e => setLostForm({...lostForm, confirmed: e.target.checked})} />
                    <span className="text-sm text-gray-800 leading-relaxed font-medium">
                      Thẻ xe của tôi đã bị thất lạc và hiện không thể tìm thấy. Tôi xác nhận các thông tin đã khai trên là đúng sự thật và đồng ý thực hiện đầy đủ các quy định của Ban Quản lý, bao gồm việc nộp phí 100.000 VNĐ để Ban Quản Lý làm lại thẻ đã mất.
                    </span>
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Ngày</label>
                      <input type="date" className="h-[38px] w-full rounded border border-gray-300 px-3 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none bg-white" value={lostForm.date} onChange={e => setLostForm({...lostForm, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Ký (Ghi rõ họ tên) <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Nhập họ và tên để thay cho chữ ký..." className="h-[38px] w-full rounded border border-gray-300 px-3 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none bg-white" value={lostForm.signature} onChange={e => setLostForm({...lostForm, signature: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end border-t border-gray-200 pt-5">
                  <button
                    type="button"
                    onClick={handleSendLostTicket}
                    disabled={!lostFormValid || isSubmittingLost}
                    className="flex h-[40px] items-center justify-center gap-1.5 rounded bg-red-600 px-6 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmittingLost ? "Đang xử lý..." : "Gửi biên bản thất lạc"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-150">
            <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 text-sm">
                Chi tiết yêu cầu – {selectedRequest.requestNo}
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-sm max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Tiêu đề:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedRequest.subject}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Trạng thái:</span>
                <span className="col-span-2">
                  <span className={statusBadgeClass(selectedRequest.status)}>
                    {mapStatusToVi(selectedRequest.status)}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Người gửi:</span>
                <span className="col-span-2 text-gray-800">
                  {selectedRequest.senderName || "—"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">
                  Thời gian gửi:
                </span>
                <span className="col-span-2 text-gray-800">
                  {selectedRequest.createdAt
                    ? new Date(selectedRequest.createdAt).toLocaleString(
                        "vi-VN",
                      )
                    : "—"}
                </span>
              </div>

              <div className="space-y-1 mt-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Nội dung chi tiết:
                </div>
                {renderDescription(selectedRequest.description)}
              </div>

              {selectedRequest.adminNote && (
                <div className="space-y-1 bg-emerald-50/50 rounded p-2.5 border border-emerald-200 text-emerald-800">
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    Phản hồi của Admin:
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap text-xs">
                    {selectedRequest.adminNote}
                  </div>
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
