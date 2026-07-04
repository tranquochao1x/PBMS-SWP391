import { useState } from "react";
import { List, RefreshCw, Calendar, Settings2, AlertTriangle } from "lucide-react";
import CardList from "./CardList";
import CardRenew from "./CardRenew";
import MonthlyCards from "../reports/MonthlyCards";
import CardProcessing from "../reports/CardProcessing";
import CardViolationRules from "./CardViolationRules";

type Tab = "list" | "renew" | "monthly" | "processing" | "violations";

const tabs: { key: Tab; label: string; icon: typeof List }[] = [
  { key: "list",       label: "Danh sách thẻ",       icon: List },
  { key: "renew",      label: "Gia hạn thẻ",          icon: RefreshCw },
  { key: "monthly",    label: "Thời hạn thẻ tháng",   icon: Calendar },
  { key: "violations", label: "Quy tắc phạt",        icon: AlertTriangle },
  { key: "processing", label: "Xử lý thẻ",            icon: Settings2 },
];

export default function CardManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("list");

  return (
    <div className="space-y-2">
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-300 bg-white rounded-t shadow-sm">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "list"       && <CardList />}
      {activeTab === "renew"      && <CardRenew />}
      {activeTab === "monthly"    && <MonthlyCards />}
      {activeTab === "violations" && <CardViolationRules />}
      {activeTab === "processing" && <CardProcessing />}
    </div>
  );
}
