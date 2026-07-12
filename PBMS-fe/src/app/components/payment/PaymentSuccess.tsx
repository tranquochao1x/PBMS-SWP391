import { useEffect, useState } from "react";
import { CheckCircle2, ArrowLeft, CreditCard } from "lucide-react";

interface VnPaySuccessParams {
  vnp_ResponseCode?: string;
  vnp_TransactionNo?: string;
  vnp_TxnRef?: string;
}

function parseQueryParams(): VnPaySuccessParams {
  const params = new URLSearchParams(window.location.search);
  return {
    vnp_ResponseCode:  params.get("vnp_ResponseCode")  ?? undefined,
    vnp_TransactionNo: params.get("vnp_TransactionNo") ?? undefined,
    vnp_TxnRef:        params.get("vnp_TxnRef")        ?? undefined,
  };
}

export default function PaymentSuccess() {
  const [params, setParams] = useState<VnPaySuccessParams>({});
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setParams(parseQueryParams());
  }, []);

  // Tự về trang chủ sau 5 giây
  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = "/";
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1_000);
    return () => clearTimeout(t);
  }, [countdown]);

  const isConfirmed = params.vnp_ResponseCode === "00";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isConfirmed ? "Thanh toán thành công!" : "Đang xử lý..."}
          </h1>
          <p className="mt-1 text-emerald-100 text-sm">
            {isConfirmed
              ? "Thẻ gửi xe của bạn đã được kích hoạt."
              : "Hệ thống đang xác nhận giao dịch của bạn."}
          </p>
        </div>

        {/* Detail */}
        <div className="p-6 space-y-4">
          {/* Transaction info */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2 text-sm">
            {params.vnp_TxnRef && (
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-mono font-semibold text-gray-800">{params.vnp_TxnRef}</span>
              </div>
            )}
            {params.vnp_TransactionNo && (
              <div className="flex justify-between">
                <span className="text-gray-500">Mã giao dịch VNPay</span>
                <span className="font-mono text-xs text-gray-700 truncate max-w-[180px]">{params.vnp_TransactionNo}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái</span>
              <span className={`font-semibold ${isConfirmed ? "text-emerald-600" : "text-amber-600"}`}>
                {isConfirmed ? "✓ Thành công" : "Thất bại / Hủy"}
              </span>
            </div>
          </div>

          {/* Redirect notice */}
          <div className="flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-600">
            <CreditCard className="h-3.5 w-3.5 shrink-0" />
            <span>
              Tự động về trang chủ sau{" "}
              <span className="font-bold font-mono">{countdown}</span> giây...
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
