import { useState } from "react";
import { getLocalTodayStr } from "../../../utils/dateUtils";
import { Calendar, CheckCircle, Car } from "lucide-react";
import { cls } from "../common/ui";

type SlotStatus = "available" | "reserved" | "occupied" | "disabled" | "selected";

interface Slot {
  code: string;
  floor: string;
  zone: string;
  num: string;
  status: SlotStatus;
}

const today = new Date();
const todayStr = getLocalTodayStr();
const nextDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  return d.toLocaleDateString("en-CA");
});

const MONTHLY_CARDS = [
  { id: "MC-C-001", label: "MC-C-001 – 51A-12345 (ô tô)", plate: "51A-12345", type: "car" },
  { id: "MC-C-002", label: "MC-C-002 – 51B-67890 (ô tô)", plate: "51B-67890", type: "car" },
];

function buildSlots(floor: string, zone: string): Slot[] {
  if (!floor || !zone) return [];
  const preset: Record<string, SlotStatus> = {
    "01": "available", "02": "reserved", "03": "occupied",
    "04": "available", "05": "disabled",
  };
  return ["01","02","03","04","05"].map(num => ({
    code: `${floor}-${zone}${num}`,
    floor, zone, num,
    status: preset[num] ?? "available",
  }));
}

const slotColorMap: Record<SlotStatus, string> = {
  available: "bg-green-100 border-green-400 text-green-800 hover:bg-green-200 cursor-pointer",
  reserved:  "bg-yellow-100 border-yellow-400 text-yellow-800 cursor-not-allowed",
  occupied:  "bg-red-100 border-red-400 text-red-800 cursor-not-allowed",
  disabled:  "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed",
  selected:  "bg-blue-500 border-blue-600 text-white cursor-pointer",
};

export default function UserReserveSlot() {
  const [cardId, setCardId] = useState("");
  const [date, setDate] = useState(todayStr);
  const [arrivalTime, setArrivalTime] = useState("08:00");
  const [floor, setFloor] = useState("");
  const [zone, setZone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const card = MONTHLY_CARDS.find(c => c.id === cardId);
  const slots = buildSlots(floor, zone);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status !== "available") return;
    setSelectedSlot(slot.code);
  };

  const getSlotStatus = (slot: Slot): SlotStatus => {
    if (slot.code === selectedSlot) return "selected";
    return slot.status;
  };

  const handleReserve = () => {
    setError("");
    if (!cardId) return setError("Vui lòng chọn thẻ tháng.");
    if (!date) return setError("Vui lòng chọn ngày đặt chỗ.");
    if (!floor || !zone) return setError("Vui lòng chọn tầng và khu vực.");
    if (!selectedSlot) return setError("Vui lòng chọn một slot trống trên bản đồ.");
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className={cls.pageWrapper}>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h1 className="text-base font-semibold text-gray-800">Đặt slot ô tô</h1>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 py-12">
          <div className="bg-white border border-green-200 rounded-lg p-8 max-w-md w-full text-center shadow-sm">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-700 mb-2">Đặt chỗ thành công!</h2>
            <p className="text-gray-600 text-sm mb-4">Reservation Confirmed</p>
            <div className="bg-gray-50 rounded p-4 text-left text-sm space-y-1.5 mb-6">
              <div className="flex justify-between"><span className="text-gray-500">Thẻ tháng:</span><span className="font-medium">{cardId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Biển số:</span><span className="font-medium">{card?.plate}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Ngày:</span><span className="font-medium">{date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Giờ dự kiến:</span><span className="font-medium">{arrivalTime}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Slot:</span><span className="font-medium text-blue-600">{selectedSlot}</span></div>
            </div>
            <button
              onClick={() => { setConfirmed(false); setCardId(""); setSelectedSlot(null); setFloor(""); setZone(""); }}
              className={cls.btnSearch}
            >
              Đặt chỗ mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cls.pageWrapper}>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h1 className="text-base font-semibold text-gray-800">Đặt slot ô tô</h1>
      </div>

      <div className="grid grid-cols-[380px_1fr] gap-3 flex-1 min-h-0">
        {/* Form */}
        <div className={`${cls.sectionCard} p-4 flex flex-col gap-3 overflow-y-auto`}>
          <h2 className="text-sm font-semibold text-gray-700 border-b pb-2">Thông tin đặt chỗ</h2>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Thẻ tháng ô tô <span className="text-red-500">*</span></label>
            <select className={`${cls.select} w-full`} value={cardId} onChange={e => { setCardId(e.target.value); setSelectedSlot(null); }}>
              <option value="">-- Chọn thẻ tháng --</option>
              {MONTHLY_CARDS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Biển số xe (tự điền)</label>
            <input className={`${cls.input} w-full bg-gray-50`} value={card?.plate ?? ""} readOnly placeholder="Chọn thẻ tháng để tự điền" />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Ngày đặt chỗ <span className="text-red-500">*</span></label>
            <select className={`${cls.select} w-full`} value={date} onChange={e => { setDate(e.target.value); setSelectedSlot(null); }}>
              {nextDays.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Giờ dự kiến đến <span className="text-red-500">*</span></label>
            <input type="time" className={`${cls.input} w-full`} value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tầng <span className="text-red-500">*</span></label>
              <select className={`${cls.select} w-full`} value={floor} onChange={e => { setFloor(e.target.value); setSelectedSlot(null); }}>
                <option value="">-- Chọn --</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Khu vực <span className="text-red-500">*</span></label>
              <select className={`${cls.select} w-full`} value={zone} onChange={e => { setZone(e.target.value); setSelectedSlot(null); }}>
                <option value="">-- Chọn --</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs mt-1">
            {[
              { color: "bg-green-100 border-green-400", label: "Trống" },
              { color: "bg-yellow-100 border-yellow-400", label: "Đã đặt" },
              { color: "bg-red-100 border-red-400", label: "Đang đỗ" },
              { color: "bg-gray-100 border-gray-300", label: "Vô hiệu" },
              { color: "bg-blue-500 border-blue-600", label: "Đã chọn" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded border ${l.color}`} />
                <span className="text-gray-600">{l.label}</span>
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-2 py-1.5">{error}</p>}

          <button onClick={handleReserve} className={`${cls.btnSearch} w-full justify-center mt-1`}>
            <Car className="w-4 h-4" />
            Đặt chỗ
          </button>
        </div>

        {/* Slot Map */}
        <div className={`${cls.sectionCard} p-4 flex flex-col`}>
          <h2 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">Bản đồ slot</h2>
          {(!floor || !zone) ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Chọn tầng và khu vực để xem bản đồ slot
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500 mb-3">Tầng <strong>{floor}</strong> – Khu <strong>{zone}</strong> | Ngày: {date}</p>
              <div className="flex flex-wrap gap-3">
                {slots.map(slot => {
                  const st = getSlotStatus(slot);
                  return (
                    <button
                      key={slot.code}
                      onClick={() => handleSlotClick(slot)}
                      className={`w-24 h-16 border-2 rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all ${slotColorMap[st]}`}
                    >
                      <Car className="w-5 h-5 opacity-70" />
                      <span>{slot.code}</span>
                    </button>
                  );
                })}
              </div>
              {selectedSlot && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  Slot đã chọn: <strong>{selectedSlot}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
