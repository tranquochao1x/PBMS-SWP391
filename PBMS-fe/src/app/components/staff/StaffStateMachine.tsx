import { GitBranch } from "lucide-react";

const C = {
  slate:  { bg: "#f1f5f9", br: "#64748b", tx: "#334155" },
  blue:   { bg: "#dbeafe", br: "#2563eb", tx: "#1e40af" },
  green:  { bg: "#dcfce7", br: "#16a34a", tx: "#14532d" },
  amber:  { bg: "#fef3c7", br: "#d97706", tx: "#92400e" },
  red:    { bg: "#fee2e2", br: "#dc2626", tx: "#7f1d1d" },
} as const;
type CKey = keyof typeof C;

function Box({ x, y, w, h, label, sub, c, final: f }: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; c: CKey; final?: boolean;
}) {
  const { bg, br, tx } = C[c];
  return (
    <g>
      {f && (
        <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={9}
          fill="none" stroke={br} strokeWidth="1.5" strokeDasharray="4 2" />
      )}
      <rect x={x} y={y} width={w} height={h} rx={6} fill={bg} stroke={br} strokeWidth="1.5" />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)}
        textAnchor="middle" fontSize="11" fontWeight="700" fill={tx}>{label}</text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10}
          textAnchor="middle" fontSize="9" fill={tx} opacity="0.65">{sub}</text>
      )}
    </g>
  );
}

function Lbl({ x, y, text, color = "#475569" }: { x: number; y: number; text: string; color?: string }) {
  const w = text.length * 5.3 + 10;
  return (
    <g>
      <rect x={x - w / 2} y={y - 8} width={w} height={15} rx={3}
        fill="white" stroke="#e2e8f0" strokeWidth="0.8" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="9" fill={color} fontWeight="500">{text}</text>
    </g>
  );
}

function InitDot({ cx: x, cy: y, tx, ty }: { cx: number; cy: number; tx: number; ty: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill="#1e293b" />
      <line x1={x + 8} y1={y} x2={tx} y2={ty} stroke="#1e293b" strokeWidth="1.5" markerEnd="url(#ah)" />
    </g>
  );
}

export default function StaffStateMachine() {
  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">
          State Machine Diagram — Parking Building Management System
        </span>
      </div>

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex flex-wrap items-center gap-5">
        <span className="text-xs font-semibold text-gray-500">Chú thích:</span>
        {([
          ["Trạng thái ban đầu", "slate"],
          ["Đang xử lý / hoạt động", "blue"],
          ["Thành công / kết thúc bình thường", "green"],
          ["Cảnh báo / hết hạn", "amber"],
          ["Hủy / lỗi", "red"],
        ] as [string, CKey][]).map(([label, c]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className="w-3 h-3 rounded border"
              style={{ background: C[c].bg, borderColor: C[c].br }} />
            {label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg width="28" height="14">
            <rect x="1" y="3" width="26" height="8" rx="4" fill="none"
              stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
          </svg>
          Trạng thái kết thúc (final)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg width="28" height="14">
            <line x1="2" y1="7" x2="22" y2="7" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
            <polygon points="22,4 28,7 22,10" fill="#94a3b8" />
          </svg>
          Chuyển trạng thái hủy
        </div>
      </div>

      {/* Diagram */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-auto">
        <svg
          width={880} height={810}
          fontFamily="system-ui, -apple-system, sans-serif"
          style={{ display: "block" }}
        >
          <defs>
            <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
            </marker>
          </defs>

          <rect width={880} height={810} fill="#f8fafc" />

          {/* ══════════════════════════════════════════════
              SM1: Vé gửi xe (Ticket Lifecycle)
              ══════════════════════════════════════════════ */}
          <rect x={10} y={10} width={858} height={240} rx={8}
            fill="white" stroke="#bfdbfe" strokeWidth="1.5" />
          <rect x={10} y={10} width={858} height={32} rx={8} fill="#eff6ff" />
          <rect x={10} y={30} width={858} height={12} fill="#eff6ff" />
          <text x={26} y={31} fontSize="12" fontWeight="700" fill="#1e40af">
            ① Vé gửi xe — Ticket Lifecycle
          </text>

          {/* Initial */}
          <InitDot cx={52} cy={120} tx={78} ty={120} />

          {/* States */}
          <Box x={80}  y={95}  w={135} h={50} label="Khởi tạo"        c="slate" />
          <Box x={295} y={95}  w={165} h={50} label="Đang hoạt động"  c="blue"  />
          <Box x={545} y={95}  w={145} h={50} label="Hoàn thành"      c="green" final />
          <Box x={295} y={190} w={165} h={50} label="Đã hủy"          c="red"   final />

          {/* Khởi tạo → Đang hoạt động */}
          <path d="M 215 120 L 295 120" stroke="#2563eb" strokeWidth="1.5"
            fill="none" markerEnd="url(#ah)" />
          <Lbl x={255} y={108} text="Xe vào / Tạo vé" color="#1e40af" />

          {/* Đang hoạt động → Hoàn thành */}
          <path d="M 460 120 L 545 120" stroke="#16a34a" strokeWidth="1.5"
            fill="none" markerEnd="url(#ah)" />
          <Lbl x={502} y={108} text="Xe ra / Tính tiền" color="#14532d" />

          {/* Khởi tạo → Đã hủy (curve) */}
          <path d="M 147 145 C 147 215 295 215 295 215"
            stroke="#dc2626" strokeWidth="1.5" fill="none"
            strokeDasharray="5 3" markerEnd="url(#ah)" />
          <Lbl x={195} y={198} text="Hủy" color="#dc2626" />

          {/* Đang hoạt động → Đã hủy */}
          <path d="M 377 145 L 377 190" stroke="#dc2626" strokeWidth="1.5"
            fill="none" strokeDasharray="5 3" markerEnd="url(#ah)" />
          <Lbl x={400} y={168} text="Hủy" color="#dc2626" />


          {/* ══════════════════════════════════════════════
              SM2: Thẻ xe (Card Lifecycle)
              ══════════════════════════════════════════════ */}
          <rect x={10} y={265} width={858} height={235} rx={8}
            fill="white" stroke="#a7f3d0" strokeWidth="1.5" />
          <rect x={10} y={265} width={858} height={32} rx={8} fill="#f0fdf4" />
          <rect x={10} y={285} width={858} height={12} fill="#f0fdf4" />
          <text x={26} y={286} fontSize="12" fontWeight="700" fill="#065f46">
            ② Thẻ xe — Card Lifecycle
          </text>

          {/* Initial */}
          <InitDot cx={45} cy={370} tx={68} ty={370} />

          {/* States */}
          <Box x={70}  y={345} w={158} h={50} label="Chưa kích hoạt" c="slate" />
          <Box x={308} y={345} w={145} h={50} label="Hoạt động"      c="green" />
          <Box x={533} y={345} w={135} h={50} label="Hết hạn"        c="amber" final />
          <Box x={308} y={440} w={145} h={50} label="Bị khóa"        c="red"   final />

          {/* Chưa KH → Hoạt động */}
          <path d="M 228 370 L 308 370" stroke="#16a34a" strokeWidth="1.5"
            fill="none" markerEnd="url(#ah)" />
          <Lbl x={268} y={357} text="Kích hoạt" color="#14532d" />

          {/* Hoạt động → Hết hạn */}
          <path d="M 453 362 L 533 362" stroke="#d97706" strokeWidth="1.5"
            fill="none" markerEnd="url(#ah)" />
          <Lbl x={493} y={349} text="Hết hạn" color="#92400e" />

          {/* Hết hạn → Hoạt động (gia hạn, arc above) */}
          <path d="M 533 378 C 533 410 453 410 453 378"
            stroke="#16a34a" strokeWidth="1.5" fill="none" markerEnd="url(#ah)" />
          <Lbl x={493} y={418} text="Gia hạn" color="#14532d" />

          {/* Hoạt động → Bị khóa */}
          <path d="M 393 395 L 393 440" stroke="#dc2626" strokeWidth="1.5"
            fill="none" markerEnd="url(#ah)" />
          <Lbl x={418} y={418} text="Khóa thẻ" color="#dc2626" />

          {/* Bị khóa → Hoạt động (left arc) */}
          <path d="M 308 465 C 260 465 260 370 308 370"
            stroke="#16a34a" strokeWidth="1.5" fill="none" markerEnd="url(#ah)" />
          <Lbl x={248} y={418} text="Mở khóa" color="#14532d" />


          {/* ══════════════════════════════════════════════
              SM3: Phân công nhân viên
              ══════════════════════════════════════════════ */}
          <rect x={10} y={515} width={858} height={280} rx={8}
            fill="white" stroke="#ddd6fe" strokeWidth="1.5" />
          <rect x={10} y={515} width={858} height={32} rx={8} fill="#faf5ff" />
          <rect x={10} y={535} width={858} height={12} fill="#faf5ff" />
          <text x={26} y={536} fontSize="12" fontWeight="700" fill="#6d28d9">
            ③ Phân công nhân viên — Staff Assignment
          </text>

          {/* Initial */}
          <InitDot cx={24} cy={615} tx={45} ty={615} />

          {/* States */}
          <Box x={47}  y={590} w={148} h={50} label="Chưa phân công" c="slate" />
          <Box x={268} y={590} w={142} h={50} label="Đã phân công"   c="blue"  />
          <Box x={478} y={590} w={128} h={50} label="Đang trực"      c="green" />
          <Box x={677} y={590} w={148} h={50} label="Đã kết thúc"    c="slate" final />
          <Box x={300} y={705} w={210} h={50} label="Đã hủy"         c="red"   final />

          {/* Chưa PC → Đã PC */}
          <path d="M 195 615 L 268 615" stroke="#2563eb" strokeWidth="1.5"
            fill="none" markerEnd="url(#ah)" />
          <Lbl x={231} y={602} text="Phân công" color="#1e40af" />

          {/* Đã PC → Đang trực */}
          <path d="M 410 615 L 478 615" stroke="#16a34a" strokeWidth="1.5"
            fill="none" markerEnd="url(#ah)" />
          <Lbl x={444} y={602} text="Bắt đầu ca" color="#14532d" />

          {/* Đang trực → Đã kết thúc */}
          <path d="M 606 615 L 677 615" stroke="#475569" strokeWidth="1.5"
            fill="none" markerEnd="url(#ah)" />
          <Lbl x={641} y={602} text="Kết thúc ca" color="#334155" />

          {/* Đã PC → Đã hủy */}
          <path d="M 339 640 C 339 680 360 705 360 705"
            stroke="#dc2626" strokeWidth="1.5" fill="none"
            strokeDasharray="5 3" markerEnd="url(#ah)" />
          <Lbl x={318} y={675} text="Hủy" color="#dc2626" />

          {/* Đang trực → Đã hủy */}
          <path d="M 542 640 C 542 685 450 705 450 705"
            stroke="#dc2626" strokeWidth="1.5" fill="none"
            strokeDasharray="5 3" markerEnd="url(#ah)" />
          <Lbl x={520} y={680} text="Hủy" color="#dc2626" />

          {/* Đã kết thúc → Đã hủy (không áp dụng - note) */}
        </svg>
      </div>

      {/* Summary table */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            title: "① Vé gửi xe", color: "#1e40af", bg: "#eff6ff",
            states: ["Khởi tạo", "Đang hoạt động", "Hoàn thành ✓", "Đã hủy ✗"],
          },
          {
            title: "② Thẻ xe", color: "#065f46", bg: "#f0fdf4",
            states: ["Chưa kích hoạt", "Hoạt động", "Hết hạn ⚠", "Bị khóa ✗"],
          },
          {
            title: "③ Phân công nhân viên", color: "#6d28d9", bg: "#faf5ff",
            states: ["Chưa phân công", "Đã phân công", "Đang trực", "Đã kết thúc ✓", "Đã hủy ✗"],
          },
        ].map(sm => (
          <div key={sm.title} className="bg-white border border-gray-200 rounded shadow-sm p-3">
            <div className="text-xs font-bold mb-2 pb-1.5 border-b border-gray-100"
              style={{ color: sm.color }}>{sm.title}</div>
            <div className="space-y-1">
              {sm.states.map(s => (
                <div key={s} className="text-xs text-gray-600 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: sm.color }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
