import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { GitBranch } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  er: { diagramPadding: 20, layoutDirection: "TB", minEntityWidth: 100, minEntityHeight: 75, entityPadding: 15, useMaxWidth: true },
  flowchart: { useMaxWidth: true, htmlLabels: false, curve: "basis" },
  stateDiagram: { useMaxWidth: true },
});

let chartCounter = 0;

function MermaidChart({ code, title }: { code: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const id = `mc-${++chartCounter}`;
    ref.current.innerHTML = "";
    setError(null);
    setLoading(true);
    mermaid.render(id, code)
      .then(({ svg }) => { if (ref.current) { ref.current.innerHTML = svg; setLoading(false); } })
      .catch(err => { setError(String(err)); setLoading(false); });
  }, [code]);

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">{title}</span>
      </div>
      <div className="p-4 overflow-auto min-h-[200px]">
        {loading && <div className="flex items-center justify-center h-32 text-gray-400 text-sm animate-pulse">Rendering diagram...</div>}
        {error
          ? <pre className="text-xs text-red-600 bg-red-50 p-3 rounded whitespace-pre-wrap">{error}</pre>
          : <div ref={ref} className="flex justify-center" />
        }
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   1. ER DIAGRAM
════════════════════════════════════════════════════════════════ */
const erDiagram = `erDiagram
    User {
        int     id          PK
        varchar username    "NOT NULL"
        varchar password    "NOT NULL"
        varchar fullName    "NOT NULL"
        enum    role        "admin | staff | user"
        varchar email
        varchar phone
        varchar department
        date    joinDate
        varchar portrait    "face capture path"
        enum    status      "active | inactive"
    }
    Customer {
        int     id       PK
        varchar code     "NOT NULL"
        varchar fullName "NOT NULL"
        varchar phone
        varchar email
        text    address
        enum    status   "active | inactive"
    }
    CardGroup {
        int     id          PK
        varchar name        "NOT NULL"
        enum    vehicleType "motorcycle | car"
        enum    ticketType  "single | monthly"
        decimal price       "NOT NULL"
        text    description
        enum    status      "active | inactive"
    }
    Card {
        int     id         PK
        varchar cardNo     "NOT NULL"
        varchar cardCode   "NOT NULL"
        int     groupId    FK
        int     customerId FK
        varchar plateNo
        date    registDate "NOT NULL"
        date    expireDate
        enum    status     "active | expired | locked"
        text    note
    }
    Lane {
        int     id     PK
        varchar name   "NOT NULL"
        enum    type   "entry | exit"
        varchar area   "NOT NULL"
        enum    status "active | inactive"
    }
    Ticket {
        int      id          PK
        varchar  ticketNo    "NOT NULL"
        int      cardId      FK
        int      laneInId    FK
        int      laneOutId   FK
        int      staffId     FK
        varchar  plateNo
        enum     vehicleType "motorcycle | car"
        enum     ticketType  "single | monthly"
        datetime checkIn     "NOT NULL"
        datetime checkOut
        decimal  fee
        enum     status      "active | completed | cancelled"
        varchar  portrait    "entry portrait path"
    }
    StaffAssignment {
        int  id       PK
        int  staffId  FK
        int  laneId   FK
        enum shift    "morning | afternoon | night"
        date workDate "NOT NULL"
        enum status   "assigned | on-duty | done | cancelled"
        text note
    }
    CardHistory {
        int      id         PK
        int      cardId     FK
        int      staffId    FK
        enum     action     "activate | renew | lock | unlock"
        datetime actionTime "NOT NULL"
        text     detail
        enum     status
    }
    AlertEvent {
        int      id        PK
        enum     alertType "unknown-card | expired | suspicious"
        varchar  message   "NOT NULL"
        datetime occurTime "NOT NULL"
        int      laneId    FK
        int      staffId   FK
        enum     status    "new | resolved"
    }

    CardGroup  ||--o{ Card           : "classifies"
    Customer   ||--o{ Card           : "owns"
    Card       ||--o{ Ticket         : "generates"
    Card       ||--o{ CardHistory    : "has history"
    Lane       ||--o{ Ticket         : "processes"
    User       ||--o{ Ticket         : "handles"
    User       ||--o{ StaffAssignment: "is assigned to"
    Lane       ||--o{ StaffAssignment: "has assignment"
    User       ||--o{ CardHistory    : "processes card"
    Lane       ||--o{ AlertEvent     : "triggers"
    User       ||--o{ AlertEvent     : "monitors"`;

/* ════════════════════════════════════════════════════════════════
   2a. STATE DIAGRAM — Ticket Lifecycle
════════════════════════════════════════════════════════════════ */
const stateTicket = `stateDiagram-v2
    direction LR

    Created   : Created
    Active    : Active
    Completed : Completed
    Cancelled : Cancelled

    [*]       --> Created   : Staff creates ticket
    Created   --> Active    : Vehicle enters / QR scanned
    Active    --> Completed : Vehicle exits + payment
    Created   --> Cancelled : Cancel before entry
    Active    --> Cancelled : Emergency cancel
    Completed --> [*]
    Cancelled --> [*]

    note right of Created
        QR code auto-generated
        License plate captured
        Entry time recorded
    end note

    note right of Active
        Vehicle is inside parking lot
        Duration being tracked
        Entry portrait stored
    end note

    note right of Completed
        Fee collected or waived
        Exit barrier opened
        Transaction logged
    end note`;

/* ════════════════════════════════════════════════════════════════
   2b. STATE DIAGRAM — Card Lifecycle
════════════════════════════════════════════════════════════════ */
const stateCard = `stateDiagram-v2
    direction LR

    Inactive      : Inactive
    Active        : Active
    ExpiringSoon  : Expiring Soon
    Expired       : Expired
    Locked        : Locked

    [*]          --> Inactive     : Card added to system
    Inactive     --> Active       : Card activated by staff
    Active       --> ExpiringSoon : Less than 14 days remaining
    ExpiringSoon --> Expired      : Expiration date reached
    Expired      --> Active       : User renews via portal + QR payment
    ExpiringSoon --> Active       : User renews before expiry
    Active       --> Locked       : Admin locks card
    Locked       --> Active       : Admin unlocks card

    note right of ExpiringSoon
        Warning badge shown on portal
        User notified to renew
    end note

    note right of Expired
        Entry denied at gate
        User self-renews via Member Portal
        Payment by QR code
    end note`;

/* ════════════════════════════════════════════════════════════════
   2c. STATE DIAGRAM — Staff Assignment Lifecycle
════════════════════════════════════════════════════════════════ */
const stateAssign = `stateDiagram-v2
    direction LR

    Unassigned : Unassigned
    Assigned   : Assigned
    OnDuty     : On Duty
    Completed  : Completed
    Cancelled  : Cancelled

    [*]        --> Unassigned : Lane has no staff coverage
    Unassigned --> Assigned   : Admin assigns staff to lane
    Assigned   --> OnDuty     : Shift starts
    OnDuty     --> Completed  : Shift ends normally
    Assigned   --> Cancelled  : Admin cancels assignment
    OnDuty     --> Cancelled  : Emergency cancellation

    Completed  --> [*]
    Cancelled  --> [*]

    note right of Assigned
        Staff notified of shift
        Shift: Morning / Afternoon / Night
    end note

    note right of OnDuty
        Staff at assigned lane
        Handling vehicle entry and exit
        Activity logged in system
    end note`;

/* ════════════════════════════════════════════════════════════════
   3. SCREEN FLOW DIAGRAM
════════════════════════════════════════════════════════════════ */
const screenFlow = `flowchart TB
    LOGIN([Login Screen])

    LOGIN -->|role: admin| ADMIN_PORTAL
    LOGIN -->|role: staff| STAFF_PORTAL
    LOGIN -->|role: user| USER_PORTAL

    subgraph ADMIN_PORTAL[Admin Portal]
        direction TB
        A_DASH[Dashboard - Admin Profile]

        subgraph A_RPT[Reports]
            direction LR
            A_R1[Vehicle Entry - Exit Report]
            A_R2[Single Ticket Revenue]
            A_R3[Alert Events]
        end

        subgraph A_CARDS[Card Management]
            direction LR
            A_T1[Card List]
            A_T2[Card History]
            A_T3[Card Groups]
        end

        subgraph A_CUS[Customer Management]
            A_K1[Customer List]
            A_K2[Customer Detail]
            A_K3[Card Detail + QR]
        end

        subgraph A_SYS[System]
            direction LR
            A_S1[User Management]
            A_S2[Staff Assignment]
        end

        A_DASH --> A_RPT & A_CARDS & A_CUS & A_SYS
        A_K1   --> A_K2 --> A_K3
    end

    subgraph STAFF_PORTAL[Staff Portal]
        direction TB
        S_DASH[Dashboard - Staff Profile]
        S_IN[Vehicle Entry\nPlate Scan + Portrait Capture]
        S_OUT[Vehicle Exit\nQR Scan + Portrait Verification]
        S_HIST[Transaction History]
        S_ERD[ERD Diagram]
        S_MER[Mermaid Diagrams]

        S_DASH --> S_IN & S_OUT & S_HIST & S_ERD & S_MER
    end

    subgraph USER_PORTAL[Member Portal]
        direction TB
        U_DASH[My Profile - Editable]
        U_CARDS[My Monthly Cards]
        U_DET[Card Detail + QR for Staff]
        U_RENEW[Renew Card + QR Payment]
        U_ADD[Add New Card + QR Payment]

        U_DASH --> U_CARDS
        U_CARDS --> U_DET & U_RENEW & U_ADD
    end

    style LOGIN fill:#1e3a5f,color:#fff,stroke:#1e3a5f
    style ADMIN_PORTAL fill:#eff6ff,stroke:#3b82f6
    style STAFF_PORTAL fill:#f0fdf4,stroke:#16a34a
    style USER_PORTAL  fill:#fdf4ff,stroke:#a855f7`;

/* ════════════════════════════════════════════════════════════════
   Tabs
════════════════════════════════════════════════════════════════ */
const TABS = [
  {
    key: "er",
    label: "① ER Diagram",
    title: "ER Diagram — Entity Relationships (9 tables)",
    diagram: erDiagram,
    desc: "Full database schema — 9 entities, 11 relationships, all fields with types and constraints",
  },
  {
    key: "state-ticket",
    label: "② State: Ticket",
    title: "State Diagram — Parking Ticket Lifecycle",
    diagram: stateTicket,
    desc: "Created → Active → Completed | Cancelled — tracks every parking session",
  },
  {
    key: "state-card",
    label: "③ State: Card",
    title: "State Diagram — Parking Card Lifecycle",
    diagram: stateCard,
    desc: "Inactive → Active ↔ Expiring Soon ↔ Expired | Locked — monthly card states",
  },
  {
    key: "state-assign",
    label: "④ State: Assignment",
    title: "State Diagram — Staff Assignment Lifecycle",
    diagram: stateAssign,
    desc: "Unassigned → Assigned → On Duty → Completed | Cancelled — lane coverage tracking",
  },
  {
    key: "screen-flow",
    label: "⑤ Screen Flow",
    title: "Screen Flow Diagram — Full Application Navigation",
    diagram: screenFlow,
    desc: "Admin Portal · Staff Portal · Member Portal — 3 roles, 20+ screens, complete navigation map",
  },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function StaffMermaid() {
  const [active, setActive] = useState<TabKey>("er");
  const current = TABS.find(t => t.key === active)!;

  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-2.5 flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">
          Mermaid Diagrams — Parking Building Management System
        </span>
        <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">mermaid v11</span>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActive(tab.key)}
              className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px ${
                active === tab.key
                  ? "border-blue-600 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <p className="text-xs text-gray-500">{current.desc}</p>
        </div>
      </div>

      {/* Chart */}
      <MermaidChart key={active} code={current.diagram} title={current.title} />

      {/* Source */}
      <details className="bg-white border border-gray-200 rounded shadow-sm">
        <summary className="px-4 py-2.5 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700 select-none flex items-center gap-1.5">
          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{"</>"}</span>
          View Mermaid source
        </summary>
        <pre className="px-4 pb-4 pt-2 text-xs text-gray-700 overflow-auto font-mono whitespace-pre leading-relaxed bg-gray-50 border-t border-gray-100">
          {current.diagram}
        </pre>
      </details>
    </div>
  );
}
