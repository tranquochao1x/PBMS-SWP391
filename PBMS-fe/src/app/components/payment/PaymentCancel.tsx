import { useEffect, useState } from "react";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function PaymentCancel() {
  const [countdown, setCountdown] = useState(8);

  // Tự về trang chủ sau 8 giây
  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = "/";
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1_000);
    return () => clearTimeout(t);
  }, [countdown]);

  const params = new URLSearchParams(window.location.search);
  const orderCode = params.get("orderCode");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-8 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <XCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Đã hủy thanh toán</h1>
          <p className="mt-1 text-red-100 text-sm">
            Bạn đã hủy giao dịch. Chưa có khoản tiền nào bị trừ.
          </p>
        </div>

        {/* Detail */}
        <div className="p-6 space-y-4">
          {orderCode && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng (đã hủy)</span>
                <span className="font-mono font-semibold text-gray-700">{orderCode}</span>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 text-center">
            Bạn có thể quay lại và thực hiện thanh toán bất kỳ lúc nào.
          </p>

          {/* Redirect notice */}
          <div className="flex items-center justify-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-xs text-orange-600">
            <span>
              Tự động về trang chủ sau{" "}
              <span className="font-bold font-mono">{countdown}</span> giây...
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
