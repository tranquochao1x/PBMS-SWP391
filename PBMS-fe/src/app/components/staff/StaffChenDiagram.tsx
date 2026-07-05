import { Share2 } from "lucide-react";

/* ── SVG primitives ─────────────────────────────────────────────── */

function EntityRect({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  return (
    <g>
      <rect x={cx - 70} y={cy - 24} width={140} height={48} rx={5}
        fill="white" stroke="#0f172a" strokeWidth={2.5} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={12}
        fontWeight="700" fill="#0f172a">{label}</text>
    </g>
  );
}

function Diamond({ cx, cy, label, hw = 62, hh = 28 }:
  { cx: number; cy: number; label: string; hw?: number; hh?: number }) {
  const pts = `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`;
  return (
    <g>
      <polygon points={pts} fill="#fef9c3" stroke="#92400e" strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10}
        fontWeight="700" fill="#78350f">{label}</text>
    </g>
  );
}

function Attr({ cx, cy, label, pk, dbl }: {
  cx: number; cy: number; label: string; pk?: boolean; dbl?: boolean;
}) {
  const tw = label.length * 5.3;
  const rx = Math.max(46, tw / 2 + 10);
  return (
    <g>
      {dbl && <ellipse cx={cx} cy={cy} rx={rx + 4} ry={21}
        fill="none" stroke="#64748b" strokeWidth={1.5} />}
      <ellipse cx={cx} cy={cy} rx={rx} ry={18}
        fill="white" stroke="#475569" strokeWidth={1.5} />
      <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize={10} fill="#1e293b">{label}</text>
      {pk && <line x1={cx - tw / 2} y1={cy + 9} x2={cx + tw / 2} y2={cy + 9}
        stroke="#1e293b" strokeWidth={1.2} />}
    </g>
  );
}

function AL({ ax, ay, ex, ey }: { ax: number; ay: number; ex: number; ey: number }) {
  return <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="#94a3b8" strokeWidth={1} />;
}

function CL({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth={1.5} />;
}

function CardN({ x, y, n }: { x: number; y: number; n: string }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={13}
    fontWeight="800" fill="#dc2626">{n}</text>;
}

/* ── Layout constants ───────────────────────────────────────────── */
// Entity centers
const E = {
  user:    { cx: 120,  cy: 350 },
  cust:    { cx: 120,  cy: 620 },
  cgrp:    { cx: 410,  cy: 100 },
  card:    { cx: 410,  cy: 360 },
  chist:   { cx: 410,  cy: 630 },
  lane:    { cx: 730,  cy: 100 },
  ticket:  { cx: 730,  cy: 360 },
  sassign: { cx: 730,  cy: 630 },
  alert:   { cx: 1030, cy: 360 },
};

// Relationship diamond centers
const D = {
  classifies:  { cx: 410,  cy: 230 },   // CardGroup → Card
  owns:        { cx: 265,  cy: 490 },   // Customer  → Card
  generates:   { cx: 570,  cy: 360 },   // Card      → Ticket
  processes:   { cx: 730,  cy: 230 },   // Lane      → Ticket
  handles:     { cx: 410,  cy: 295 },   // User      → Ticket
  assignedTo:  { cx: 410,  cy: 500 },   // User      → StaffAssignment
  hasAssign:   { cx: 795,  cy: 500 },   // Lane      → StaffAssignment
  hasHistory:  { cx: 355,  cy: 500 },   // Card      → CardHistory
  procCard:    { cx: 230,  cy: 605 },   // User      → CardHistory
  triggers:    { cx: 880,  cy: 225 },   // Lane      → AlertEvent
  monitors:    { cx: 575,  cy: 295 },   // User      → AlertEvent
};

const CANVAS_W = 1160;
const CANVAS_H = 800;

export default function StaffChenDiagram() {
  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">
          Chen Diagram — Parking Building Management System
        </span>
      </div>

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex flex-wrap items-center gap-6">
        <span className="text-xs font-semibold text-gray-500">Legend:</span>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg width={40} height={22}><rect x={2} y={3} width={36} height={16} rx={4} fill="white" stroke="#0f172a" strokeWidth={2.5} /></svg>
          Entity
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg width={40} height={22}><polygon points="20,2 38,11 20,20 2,11" fill="#fef9c3" stroke="#92400e" strokeWidth={1.5} /></svg>
          Relationship
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg width={54} height={22}><ellipse cx={27} cy={11} rx={25} ry={9} fill="white" stroke="#475569" strokeWidth={1.5} /><text x={27} y={15} textAnchor="middle" fontSize={9} fontFamily="system-ui">attr</text></svg>
          Attribute
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg width={58} height={22}><ellipse cx={29} cy={11} rx={28} ry={10} fill="none" stroke="#475569" strokeWidth={1.5} /><ellipse cx={29} cy={11} rx={24} ry={7} fill="white" stroke="#475569" strokeWidth={1.5} /><text x={29} y={15} textAnchor="middle" fontSize={8} fontFamily="system-ui">multi</text></svg>
          Multi-valued
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="font-bold text-red-600 text-sm">1 / N / M</span>
          Cardinality
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="text-gray-800 font-mono text-sm underline">id</span>
          Primary Key
        </div>
      </div>

      {/* Diagram */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-auto">
        <svg width={CANVAS_W} height={CANVAS_H}
          style={{ display: "block", minWidth: CANVAS_W }}
          fontFamily="system-ui, -apple-system, sans-serif">

          <rect width={CANVAS_W} height={CANVAS_H} fill="#f8fafc" />
          {Array.from({ length: Math.ceil(CANVAS_H / 20) }, (_, r) =>
            Array.from({ length: Math.ceil(CANVAS_W / 20) }, (_, c) => (
              <circle key={`${r}-${c}`} cx={c * 20} cy={r * 20} r={0.8} fill="#e2e8f0" />
            ))
          )}

          {/* ── LAYER 1: Attribute lines (behind everything) ── */}
          {/* User attrs */}
          <AL ax={22} ay={285} ex={E.user.cx} ey={E.user.cy} />
          <AL ax={20} ay={350} ex={E.user.cx} ey={E.user.cy} />
          <AL ax={22} ay={420} ex={E.user.cx} ey={E.user.cy} />

          {/* Customer attrs */}
          <AL ax={22} ay={555} ex={E.cust.cx} ey={E.cust.cy} />
          <AL ax={20} ay={622} ex={E.cust.cx} ey={E.cust.cy} />
          <AL ax={22} ay={690} ex={E.cust.cx} ey={E.cust.cy} />

          {/* CardGroup attrs */}
          <AL ax={310} ay={35} ex={E.cgrp.cx} ey={E.cgrp.cy} />
          <AL ax={410} ay={20} ex={E.cgrp.cx} ey={E.cgrp.cy} />
          <AL ax={510} ay={35} ex={E.cgrp.cx} ey={E.cgrp.cy} />

          {/* Card attrs */}
          <AL ax={305} ay={295} ex={E.card.cx} ey={E.card.cy} />
          <AL ax={295} ay={362} ex={E.card.cx} ey={E.card.cy} />
          <AL ax={305} ay={428} ex={E.card.cx} ey={E.card.cy} />

          {/* CardHistory attrs */}
          <AL ax={300} ay={570} ex={E.chist.cx} ey={E.chist.cy} />
          <AL ax={295} ay={632} ex={E.chist.cx} ey={E.chist.cy} />
          <AL ax={300} ay={697} ex={E.chist.cx} ey={E.chist.cy} />

          {/* Lane attrs */}
          <AL ax={625} ay={35} ex={E.lane.cx} ey={E.lane.cy} />
          <AL ax={730} ay={20} ex={E.lane.cx} ey={E.lane.cy} />
          <AL ax={838} ay={35} ex={E.lane.cx} ey={E.lane.cy} />

          {/* Ticket attrs */}
          <AL ax={620} ay={295} ex={E.ticket.cx} ey={E.ticket.cy} />
          <AL ax={613} ay={362} ex={E.ticket.cx} ey={E.ticket.cy} />
          <AL ax={620} ay={428} ex={E.ticket.cx} ey={E.ticket.cy} />

          {/* StaffAssignment attrs */}
          <AL ax={620} ay={570} ex={E.sassign.cx} ey={E.sassign.cy} />
          <AL ax={612} ay={632} ex={E.sassign.cx} ey={E.sassign.cy} />
          <AL ax={620} ay={697} ex={E.sassign.cx} ey={E.sassign.cy} />

          {/* AlertEvent attrs */}
          <AL ax={1130} ay={295} ex={E.alert.cx} ey={E.alert.cy} />
          <AL ax={1140} ay={362} ex={E.alert.cx} ey={E.alert.cy} />
          <AL ax={1130} ay={428} ex={E.alert.cx} ey={E.alert.cy} />

          {/* ── LAYER 2: Entity–Relationship connector lines ── */}

          {/* CLASSIFIES: CardGroup ↔ Card */}
          <CL x1={E.cgrp.cx} y1={E.cgrp.cy + 24} x2={D.classifies.cx} y2={D.classifies.cy + 28} />
          <CL x1={D.classifies.cx} y1={D.classifies.cy - 28} x2={E.card.cx} y2={E.card.cy - 24} />

          {/* OWNS: Customer ↔ Card */}
          <CL x1={E.cust.cx + 70} y1={E.cust.cy - 14} x2={D.owns.cx + 50} y2={D.owns.cy + 20} />
          <CL x1={D.owns.cx - 15} y1={D.owns.cy - 25} x2={E.card.cx - 65} y2={E.card.cy + 14} />

          {/* GENERATES: Card ↔ Ticket */}
          <CL x1={E.card.cx + 70} y1={E.card.cy} x2={D.generates.cx - 62} y2={D.generates.cy} />
          <CL x1={D.generates.cx + 62} y1={D.generates.cy} x2={E.ticket.cx - 70} y2={E.ticket.cy} />

          {/* PROCESSES: Lane ↔ Ticket */}
          <CL x1={E.lane.cx} y1={E.lane.cy + 24} x2={D.processes.cx} y2={D.processes.cy + 28} />
          <CL x1={D.processes.cx} y1={D.processes.cy - 28} x2={E.ticket.cx} y2={E.ticket.cy - 24} />

          {/* HANDLES: User ↔ Ticket (route via diamond above card row) */}
          <CL x1={E.user.cx + 55} y1={E.user.cy - 18} x2={D.handles.cx - 55} y2={D.handles.cy - 8} />
          <CL x1={D.handles.cx + 62} y1={D.handles.cy} x2={E.ticket.cx - 65} y2={E.ticket.cy - 20} />

          {/* ASSIGNED_TO: User ↔ StaffAssignment */}
          <CL x1={E.user.cx + 60} y1={E.user.cy + 18} x2={D.assignedTo.cx - 55} y2={D.assignedTo.cy - 10} />
          <CL x1={D.assignedTo.cx + 62} y1={D.assignedTo.cy} x2={E.sassign.cx - 70} y2={E.sassign.cy - 10} />

          {/* HAS_ASSIGNMENT: Lane ↔ StaffAssignment (offset right) */}
          <CL x1={E.lane.cx + 50} y1={E.lane.cy + 20} x2={D.hasAssign.cx - 5} y2={D.hasAssign.cy - 28} />
          <CL x1={D.hasAssign.cx - 5} y1={D.hasAssign.cy + 28} x2={E.sassign.cx + 50} y2={E.sassign.cy - 20} />

          {/* HAS_HISTORY: Card ↔ CardHistory */}
          <CL x1={E.card.cx - 18} y1={E.card.cy + 24} x2={D.hasHistory.cx} y2={D.hasHistory.cy - 28} />
          <CL x1={D.hasHistory.cx} y1={D.hasHistory.cy + 28} x2={E.chist.cx - 18} y2={E.chist.cy - 24} />

          {/* PROCESSES_CARD: User ↔ CardHistory */}
          <CL x1={E.user.cx + 35} y1={E.user.cy + 24} x2={D.procCard.cx - 28} y2={D.procCard.cy - 18} />
          <CL x1={D.procCard.cx + 40} y1={D.procCard.cy + 10} x2={E.chist.cx - 65} y2={E.chist.cy + 8} />

          {/* TRIGGERS: Lane ↔ AlertEvent */}
          <CL x1={E.lane.cx + 55} y1={E.lane.cy + 15} x2={D.triggers.cx - 50} y2={D.triggers.cy - 18} />
          <CL x1={D.triggers.cx + 45} y1={D.triggers.cy + 18} x2={E.alert.cx - 65} y2={E.alert.cy - 20} />

          {/* MONITORS: User ↔ AlertEvent (long arc above) */}
          <CL x1={E.user.cx + 68} y1={E.user.cy - 20} x2={D.monitors.cx - 62} y2={D.monitors.cy} />
          <CL x1={D.monitors.cx + 62} y1={D.monitors.cy} x2={E.alert.cx - 68} y2={E.alert.cy - 20} />

          {/* ── LAYER 3: Attribute ellipses ── */}
          {/* User */}
          <Attr cx={22} cy={285} label="id" pk />
          <Attr cx={20} cy={350} label="role" />
          <Attr cx={22} cy={420} label="status" dbl />

          {/* Customer */}
          <Attr cx={22} cy={555} label="id" pk />
          <Attr cx={20} cy={622} label="code" />
          <Attr cx={22} cy={690} label="fullName" />

          {/* CardGroup */}
          <Attr cx={310} cy={35} label="id" pk />
          <Attr cx={410} cy={20} label="vehicleType" />
          <Attr cx={513} cy={35} label="price" />

          {/* Card */}
          <Attr cx={305} cy={295} label="id" pk />
          <Attr cx={295} cy={362} label="cardNo" />
          <Attr cx={305} cy={428} label="plateNo" />

          {/* CardHistory */}
          <Attr cx={298} cy={570} label="id" pk />
          <Attr cx={292} cy={632} label="action" />
          <Attr cx={298} cy={697} label="actionTime" />

          {/* Lane */}
          <Attr cx={623} cy={35} label="id" pk />
          <Attr cx={730} cy={20} label="type" />
          <Attr cx={840} cy={35} label="area" />

          {/* Ticket */}
          <Attr cx={618} cy={295} label="id" pk />
          <Attr cx={610} cy={362} label="ticketNo" />
          <Attr cx={618} cy={428} label="checkIn" />

          {/* StaffAssignment */}
          <Attr cx={618} cy={570} label="id" pk />
          <Attr cx={610} cy={632} label="shift" />
          <Attr cx={618} cy={697} label="workDate" />

          {/* AlertEvent */}
          <Attr cx={1133} cy={295} label="id" pk />
          <Attr cx={1143} cy={362} label="alertType" />
          <Attr cx={1133} cy={428} label="occurTime" />

          {/* ── LAYER 4: Entity rectangles ── */}
          <EntityRect cx={E.user.cx}    cy={E.user.cy}    label="User" />
          <EntityRect cx={E.cust.cx}    cy={E.cust.cy}    label="Customer" />
          <EntityRect cx={E.cgrp.cx}    cy={E.cgrp.cy}    label="CardGroup" />
          <EntityRect cx={E.card.cx}    cy={E.card.cy}    label="Card" />
          <EntityRect cx={E.chist.cx}   cy={E.chist.cy}   label="CardHistory" />
          <EntityRect cx={E.lane.cx}    cy={E.lane.cy}    label="Lane" />
          <EntityRect cx={E.ticket.cx}  cy={E.ticket.cy}  label="Ticket" />
          <EntityRect cx={E.sassign.cx} cy={E.sassign.cy} label="StaffAssign" />
          <EntityRect cx={E.alert.cx}   cy={E.alert.cy}   label="AlertEvent" />

          {/* ── LAYER 5: Relationship diamonds ── */}
          <Diamond cx={D.classifies.cx}  cy={D.classifies.cy}  label="CLASSIFIES" />
          <Diamond cx={D.owns.cx}        cy={D.owns.cy}        label="OWNS" />
          <Diamond cx={D.generates.cx}   cy={D.generates.cy}   label="GENERATES" hw={58} />
          <Diamond cx={D.processes.cx}   cy={D.processes.cy}   label="PROCESSES" />
          <Diamond cx={D.handles.cx}     cy={D.handles.cy}     label="HANDLES" />
          <Diamond cx={D.assignedTo.cx}  cy={D.assignedTo.cy}  label="ASSIGNED TO" hw={66} />
          <Diamond cx={D.hasAssign.cx}   cy={D.hasAssign.cy}   label="HAS ASSIGN" hw={62} />
          <Diamond cx={D.hasHistory.cx}  cy={D.hasHistory.cy}  label="HAS HISTORY" hw={68} />
          <Diamond cx={D.procCard.cx}    cy={D.procCard.cy}     label="PROC CARD" hw={60} />
          <Diamond cx={D.triggers.cx}    cy={D.triggers.cy}    label="TRIGGERS" hw={56} />
          <Diamond cx={D.monitors.cx}    cy={D.monitors.cy}    label="MONITORS" hw={56} />

          {/* ── LAYER 6: Cardinality labels ── */}
          {/* CLASSIFIES */}
          <CardN x={425} y={192} n="1" /><CardN x={425} y={272} n="N" />
          {/* OWNS */}
          <CardN x={207} y={550} n="1" /><CardN x={303} y={475} n="N" />
          {/* GENERATES */}
          <CardN x={498} y={352} n="1" /><CardN x={640} y={352} n="N" />
          {/* PROCESSES */}
          <CardN x={745} y={192} n="1" /><CardN x={745} y={272} n="N" />
          {/* HANDLES */}
          <CardN x={248} y={336} n="1" /><CardN x={494} y={318} n="N" />
          {/* ASSIGNED_TO */}
          <CardN x={248} y={430} n="1" /><CardN x={498} y={488} n="N" />
          {/* HAS_ASSIGNMENT */}
          <CardN x={788} y={370} n="1" /><CardN x={788} y={560} n="N" />
          {/* HAS_HISTORY */}
          <CardN x={370} y={430} n="1" /><CardN x={370} y={560} n="N" />
          {/* PROC_CARD */}
          <CardN x={165} y={396} n="1" /><CardN x={272} y={650} n="N" />
          {/* TRIGGERS */}
          <CardN x={796} y={180} n="1" /><CardN x={952} y={282} n="N" />
          {/* MONITORS */}
          <CardN x={248} y={318} n="1" /><CardN x={648} y={318} n="N" />
        </svg>
      </div>

      {/* Relationship table */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-3">
        <div className="text-xs font-semibold text-gray-600 mb-2">Relationships (11):</div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            ["CLASSIFIES",   "CardGroup → Card",          "1 : N"],
            ["OWNS",         "Customer → Card",            "1 : N"],
            ["GENERATES",    "Card → Ticket",              "1 : N"],
            ["PROCESSES",    "Lane → Ticket",              "1 : N"],
            ["HANDLES",      "User → Ticket",              "1 : N"],
            ["ASSIGNED TO",  "User → StaffAssignment",    "1 : N"],
            ["HAS ASSIGN",   "Lane → StaffAssignment",    "1 : N"],
            ["HAS HISTORY",  "Card → CardHistory",        "1 : N"],
            ["PROC CARD",    "User → CardHistory",        "1 : N"],
            ["TRIGGERS",     "Lane → AlertEvent",         "1 : N"],
            ["MONITORS",     "User → AlertEvent",         "1 : N"],
          ].map(([r, desc, card]) => (
            <div key={r} className="flex items-center gap-1.5 text-[10px] text-gray-600">
              <div className="w-2 h-2 rotate-45 bg-amber-200 border border-amber-500 flex-shrink-0" />
              <span className="font-mono font-semibold text-amber-800 mr-0.5">{r}</span>
              <span className="text-gray-400">{desc}</span>
              <span className="ml-auto font-bold text-red-600">{card}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
