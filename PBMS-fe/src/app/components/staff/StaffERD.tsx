import { Database } from "lucide-react";

interface Field { name: string; type: string; pk?: boolean; fk?: boolean; notNull?: boolean; }
interface Entity { id: string; label: string; labelEn: string; color: string; header: string; fields: Field[]; x: number; y: number; w: number; }

const ROW_H = 22;
const HEADER_H = 38;

const entities: Entity[] = [
  /* ─── Column A ─── */
  {
    id: "user", label: "User", labelEn: "System Users (Admin / Staff / Member)",
    color: "#7c3aed", header: "#ede9fe", x: 30, y: 30, w: 232,
    fields: [
      { name: "id",           type: "INT",     pk: true },
      { name: "username",     type: "VARCHAR",  notNull: true },
      { name: "password",     type: "VARCHAR",  notNull: true },
      { name: "fullName",     type: "VARCHAR",  notNull: true },
      { name: "role",         type: "ENUM",     notNull: true },
      { name: "email",        type: "VARCHAR" },
      { name: "phone",        type: "VARCHAR" },
      { name: "department",   type: "VARCHAR" },
      { name: "joinDate",     type: "DATE" },
      { name: "portrait",     type: "VARCHAR" },
      { name: "status",       type: "ENUM",     notNull: true },
    ],
  },
  {
    id: "customer", label: "Customer", labelEn: "Registered Customers",
    color: "#0369a1", header: "#e0f2fe", x: 30, y: 340, w: 228,
    fields: [
      { name: "id",       type: "INT",     pk: true },
      { name: "code",     type: "VARCHAR",  notNull: true },
      { name: "fullName", type: "VARCHAR",  notNull: true },
      { name: "phone",    type: "VARCHAR" },
      { name: "email",    type: "VARCHAR" },
      { name: "address",  type: "TEXT" },
      { name: "status",   type: "ENUM",     notNull: true },
    ],
  },
  {
    id: "staffassign", label: "StaffAssignment", labelEn: "Lane Staff Assignments",
    color: "#6d28d9", header: "#ede9fe", x: 30, y: 558, w: 235,
    fields: [
      { name: "id",         type: "INT",   pk: true },
      { name: "staffId",    type: "INT",   fk: true, notNull: true },
      { name: "laneId",     type: "INT",   fk: true, notNull: true },
      { name: "shift",      type: "ENUM",  notNull: true },
      { name: "workDate",   type: "DATE",  notNull: true },
      { name: "status",     type: "ENUM",  notNull: true },
      { name: "note",       type: "TEXT" },
    ],
  },

  /* ─── Column B ─── */
  {
    id: "cardgroup", label: "CardGroup", labelEn: "Card Groups & Pricing",
    color: "#b45309", header: "#fef3c7", x: 322, y: 30, w: 248,
    fields: [
      { name: "id",          type: "INT",      pk: true },
      { name: "name",        type: "VARCHAR",  notNull: true },
      { name: "vehicleType", type: "ENUM",     notNull: true },
      { name: "ticketType",  type: "ENUM",     notNull: true },
      { name: "price",       type: "DECIMAL",  notNull: true },
      { name: "description", type: "TEXT" },
      { name: "status",      type: "ENUM",     notNull: true },
    ],
  },
  {
    id: "card", label: "Card", labelEn: "Parking Cards",
    color: "#0f766e", header: "#ccfbf1", x: 322, y: 250, w: 248,
    fields: [
      { name: "id",          type: "INT",     pk: true },
      { name: "cardNo",      type: "VARCHAR",  notNull: true },
      { name: "cardCode",    type: "VARCHAR",  notNull: true },
      { name: "groupId",     type: "INT",     fk: true, notNull: true },
      { name: "customerId",  type: "INT",     fk: true },
      { name: "plateNo",     type: "VARCHAR" },
      { name: "registDate",  type: "DATE",    notNull: true },
      { name: "expireDate",  type: "DATE" },
      { name: "status",      type: "ENUM",    notNull: true },
      { name: "note",        type: "TEXT" },
    ],
  },
  {
    id: "cardhistory", label: "CardHistory", labelEn: "Card Processing History",
    color: "#059669", header: "#d1fae5", x: 322, y: 522, w: 248,
    fields: [
      { name: "id",         type: "INT",      pk: true },
      { name: "cardId",     type: "INT",      fk: true, notNull: true },
      { name: "staffId",    type: "INT",      fk: true, notNull: true },
      { name: "action",     type: "ENUM",     notNull: true },
      { name: "actionTime", type: "DATETIME", notNull: true },
      { name: "detail",     type: "TEXT" },
      { name: "status",     type: "ENUM" },
    ],
  },

  /* ─── Column C ─── */
  {
    id: "lane", label: "Lane", labelEn: "Parking Lanes",
    color: "#065f46", header: "#d1fae5", x: 628, y: 30, w: 242,
    fields: [
      { name: "id",       type: "INT",     pk: true },
      { name: "name",     type: "VARCHAR",  notNull: true },
      { name: "type",     type: "ENUM",    notNull: true },
      { name: "area",     type: "VARCHAR",  notNull: true },
      { name: "status",   type: "ENUM",    notNull: true },
    ],
  },
  {
    id: "ticket", label: "Ticket", labelEn: "Parking Tickets",
    color: "#be123c", header: "#ffe4e6", x: 628, y: 206, w: 258,
    fields: [
      { name: "id",          type: "INT",      pk: true },
      { name: "ticketNo",    type: "VARCHAR",  notNull: true },
      { name: "cardId",      type: "INT",      fk: true },
      { name: "laneInId",    type: "INT",      fk: true, notNull: true },
      { name: "laneOutId",   type: "INT",      fk: true },
      { name: "staffId",     type: "INT",      fk: true, notNull: true },
      { name: "plateNo",     type: "VARCHAR" },
      { name: "vehicleType", type: "ENUM",     notNull: true },
      { name: "ticketType",  type: "ENUM",     notNull: true },
      { name: "checkIn",     type: "DATETIME", notNull: true },
      { name: "checkOut",    type: "DATETIME" },
      { name: "fee",         type: "DECIMAL" },
      { name: "status",      type: "ENUM",     notNull: true },
      { name: "portrait",    type: "VARCHAR" },
    ],
  },
  {
    id: "alert", label: "AlertEvent", labelEn: "Security Alert Events",
    color: "#dc2626", header: "#fee2e2", x: 628, y: 566, w: 250,
    fields: [
      { name: "id",        type: "INT",      pk: true },
      { name: "alertType", type: "ENUM",     notNull: true },
      { name: "message",   type: "VARCHAR",  notNull: true },
      { name: "occurTime", type: "DATETIME", notNull: true },
      { name: "laneId",    type: "INT",      fk: true },
      { name: "staffId",   type: "INT",      fk: true },
      { name: "status",    type: "ENUM" },
    ],
  },
];

function entityHeight(e: Entity) { return HEADER_H + e.fields.length * ROW_H + 8; }

interface Rel {
  from: string; fromSide: "right"|"bottom"|"left"|"top";
  to: string;   toSide:   "right"|"bottom"|"left"|"top";
  label: string; color: string;
}

const relations: Rel[] = [
  { from: "cardgroup",   fromSide: "bottom", to: "card",        toSide: "top",   label: "1 : N", color: "#b45309" },
  { from: "customer",    fromSide: "right",  to: "card",        toSide: "left",  label: "1 : N", color: "#0369a1" },
  { from: "card",        fromSide: "right",  to: "ticket",      toSide: "left",  label: "1 : N", color: "#0f766e" },
  { from: "card",        fromSide: "bottom", to: "cardhistory",  toSide: "top",   label: "1 : N", color: "#059669" },
  { from: "lane",        fromSide: "bottom", to: "ticket",      toSide: "top",   label: "1 : N", color: "#065f46" },
  { from: "user",        fromSide: "right",  to: "ticket",      toSide: "top",   label: "1 : N", color: "#7c3aed" },
  { from: "user",        fromSide: "right",  to: "staffassign", toSide: "right", label: "1 : N", color: "#6d28d9" },
  { from: "lane",        fromSide: "left",   to: "staffassign", toSide: "right", label: "1 : N", color: "#065f46" },
  { from: "user",        fromSide: "right",  to: "cardhistory", toSide: "top",   label: "1 : N", color: "#7c3aed" },
  { from: "lane",        fromSide: "bottom", to: "alert",       toSide: "top",   label: "1 : N", color: "#dc2626" },
];

function getSidePoint(e: Entity, side: "right"|"bottom"|"left"|"top"): [number, number] {
  const h = entityHeight(e);
  switch (side) {
    case "right":  return [e.x + e.w,     e.y + h / 2];
    case "left":   return [e.x,            e.y + h / 2];
    case "bottom": return [e.x + e.w / 2, e.y + h];
    case "top":    return [e.x + e.w / 2, e.y];
  }
}

function RelLine({ rel, emap }: { rel: Rel; emap: Record<string, Entity> }) {
  const from = emap[rel.from]; const to = emap[rel.to];
  if (!from || !to) return null;
  const [x1, y1] = getSidePoint(from, rel.fromSide);
  const [x2, y2] = getSidePoint(to, rel.toSide);
  const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2;
  const cp1x = rel.fromSide === "right" || rel.fromSide === "left" ? x1 + (x2 - x1) * 0.5 : x1;
  const cp1y = rel.fromSide === "bottom" || rel.fromSide === "top" ? y1 + (y2 - y1) * 0.5 : y1;
  const cp2x = rel.toSide   === "right" || rel.toSide   === "left" ? x2 - (x2 - x1) * 0.5 : x2;
  const cp2y = rel.toSide   === "bottom" || rel.toSide  === "top"  ? y2 - (y2 - y1) * 0.5 : y2;
  const d = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  const lw = rel.label.length * 5 + 10;
  return (
    <g>
      <path d={d} fill="none" stroke={rel.color} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.75" />
      <circle cx={x1} cy={y1} r={3.5} fill={rel.color} opacity="0.8" />
      <circle cx={x2} cy={y2} r={3.5} fill="white" stroke={rel.color} strokeWidth="1.5" />
      <rect x={mx - lw / 2} y={my - 9} width={lw} height={16} rx={4} fill="white" stroke={rel.color} strokeWidth="1" opacity="0.95" />
      <text x={mx} y={my + 4} textAnchor="middle" fontSize="9" fill={rel.color} fontWeight="600">{rel.label}</text>
    </g>
  );
}

function EntityBox({ e }: { e: Entity }) {
  const h = entityHeight(e);
  return (
    <g>
      <rect x={e.x + 3} y={e.y + 3} width={e.w} height={h} rx={6} fill="#00000012" />
      <rect x={e.x} y={e.y} width={e.w} height={h} rx={6} fill="white" stroke={e.color} strokeWidth="1.5" />
      <rect x={e.x} y={e.y} width={e.w} height={HEADER_H} rx={6} fill={e.header} />
      <rect x={e.x} y={e.y + HEADER_H - 6} width={e.w} height={6} fill={e.header} />
      <text x={e.x + e.w / 2} y={e.y + 15} textAnchor="middle" fontSize="12" fontWeight="700" fill={e.color}>{e.label}</text>
      <text x={e.x + e.w / 2} y={e.y + 29} textAnchor="middle" fontSize="8" fill={e.color} opacity="0.65">{e.labelEn}</text>
      <line x1={e.x} y1={e.y + HEADER_H} x2={e.x + e.w} y2={e.y + HEADER_H} stroke={e.color} strokeWidth="1" opacity="0.25" />
      {e.fields.map((f, i) => {
        const fy = e.y + HEADER_H + 4 + i * ROW_H;
        return (
          <g key={f.name}>
            {i % 2 === 1 && <rect x={e.x + 1} y={fy} width={e.w - 2} height={ROW_H} fill="#f9fafb" />}
            {f.pk && <>
              <rect x={e.x + 5} y={fy + 5} width={18} height={12} rx={2} fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
              <text x={e.x + 14} y={fy + 14} textAnchor="middle" fontSize="7" fontWeight="700" fill="#92400e">PK</text>
            </>}
            {f.fk && !f.pk && <>
              <rect x={e.x + 5} y={fy + 5} width={18} height={12} rx={2} fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
              <text x={e.x + 14} y={fy + 14} textAnchor="middle" fontSize="7" fontWeight="700" fill="#1d4ed8">FK</text>
            </>}
            <text x={e.x + 28} y={fy + 14} fontSize="9.5" fill="#1f2937" fontFamily="monospace">{f.name}</text>
            <text x={e.x + e.w - 5} y={fy + 14} textAnchor="end" fontSize="8.5" fill="#6b7280" fontFamily="monospace">
              {f.type}{f.notNull ? " NN" : ""}
            </text>
          </g>
        );
      })}
    </g>
  );
}

const CANVAS_W = 940;
const CANVAS_H = Math.max(...entities.map(e => e.y + entityHeight(e))) + 30;

export default function StaffERD() {
  const emap = Object.fromEntries(entities.map(e => [e.id, e]));

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex items-center gap-2">
        <Database className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">
          Entity Relationship Diagram — Parking Building Management System
        </span>
        <span className="ml-auto text-xs text-gray-400">{entities.length} tables · {relations.length} relationships</span>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex flex-wrap gap-5 items-center">
        <span className="text-xs font-semibold text-gray-500">Legend:</span>
        {[["PK", "#fef08a", "#ca8a04", "#92400e", "Primary Key"], ["FK", "#dbeafe", "#3b82f6", "#1d4ed8", "Foreign Key"]].map(([b, bg, br, tx, lbl]) => (
          <div key={b as string} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span style={{ background: bg as string, border: `1px solid ${br}`, borderRadius: 3, padding: "1px 5px", fontSize: 10, fontWeight: 700, color: tx as string }}>{b}</span>
            {lbl}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="text-gray-700 font-mono text-xs">NN</span> NOT NULL
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg width="34" height="12">
            <line x1="0" y1="6" x2="26" y2="6" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx="3" cy="6" r="2.5" fill="#6b7280" />
            <circle cx="30" cy="6" r="2.5" fill="white" stroke="#6b7280" strokeWidth="1.5" />
          </svg>
          1:N Relationship
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { col: "Column A — Users & Assignments", color: "#7c3aed", items: ["User", "Customer", "StaffAssignment"] },
          { col: "Column B — Cards & History",     color: "#0f766e", items: ["CardGroup", "Card", "CardHistory"] },
          { col: "Column C — Lanes & Tickets",     color: "#be123c", items: ["Lane", "Ticket", "AlertEvent"] },
        ].map(g => (
          <div key={g.col} className="bg-white border border-gray-200 rounded shadow-sm px-3 py-2">
            <div className="text-[10px] font-bold mb-1.5" style={{ color: g.color }}>{g.col}</div>
            <div className="flex flex-wrap gap-1">
              {g.items.map(t => (
                <span key={t} className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-auto">
        <svg width={CANVAS_W} height={CANVAS_H} style={{ display: "block", minWidth: CANVAS_W }} fontFamily="system-ui, -apple-system, sans-serif">
          <rect width={CANVAS_W} height={CANVAS_H} fill="#f8fafc" />
          {Array.from({ length: Math.ceil(CANVAS_H / 20) }, (_, r) =>
            Array.from({ length: Math.ceil(CANVAS_W / 20) }, (_, c) => (
              <circle key={`${r}-${c}`} cx={c * 20} cy={r * 20} r={0.8} fill="#e2e8f0" />
            ))
          )}
          <line x1={310} y1={0} x2={310} y2={CANVAS_H} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="6 3" />
          <line x1={616} y1={0} x2={616} y2={CANVAS_H} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="6 3" />
          {relations.map((rel, i) => <RelLine key={i} rel={rel} emap={emap} />)}
          {entities.map(e => <EntityBox key={e.id} e={e} />)}
        </svg>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-3">
        <div className="text-xs font-semibold text-gray-600 mb-2">Relationships:</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          {[
            { f: "CardGroup",  t: "Card",           c: "1:N", d: "A card group contains many cards" },
            { f: "Customer",   t: "Card",           c: "1:N", d: "A customer owns many cards" },
            { f: "Card",       t: "Ticket",         c: "1:N", d: "A card generates many tickets" },
            { f: "Card",       t: "CardHistory",    c: "1:N", d: "A card has many history records" },
            { f: "Lane",       t: "Ticket",         c: "1:N", d: "A lane processes many tickets" },
            { f: "User",       t: "Ticket",         c: "1:N", d: "A staff handles many tickets" },
            { f: "User",       t: "StaffAssignment",c: "1:N", d: "A staff has many assignments" },
            { f: "Lane",       t: "StaffAssignment",c: "1:N", d: "A lane has many assignments" },
            { f: "User",       t: "CardHistory",    c: "1:N", d: "A staff processes many card actions" },
            { f: "Lane",       t: "AlertEvent",     c: "1:N", d: "A lane generates many alerts" },
          ].map(r => (
            <div key={r.f + r.t} className="flex items-center gap-1.5 text-[10px] text-gray-600 py-0.5">
              <span className="font-mono font-semibold text-gray-700">{r.f}</span>
              <span className="text-red-500 font-bold">{r.c}</span>
              <span className="font-mono font-semibold text-gray-700">{r.t}</span>
              <span className="text-gray-400">— {r.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
