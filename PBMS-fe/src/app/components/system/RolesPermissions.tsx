import { useState } from "react";
import { Shield, Save, Check } from "lucide-react";
import { cls } from "../common/ui";

interface Role {
  key: string;
  label: string;
  colorClass: string;
  badgeClass: string;
  description: string;
}

const roles: Role[] = [
  {
    key: "admin",
    label: "Admin",
    colorClass: "bg-purple-600",
    badgeClass: "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200",
    description: "Toàn quyền quản trị hệ thống",
  },
  {
    key: "staff",
    label: "Parking Staff",
    colorClass: "bg-green-600",
    badgeClass: "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 border border-green-200",
    description: "Nhân viên vận hành bãi xe",
  },
];

interface PermGroup {
  group: string;
  items: { key: string; label: string }[];
}

const permGroups: PermGroup[] = [
  {
    group: "Tổng quan",
    items: [
      { key: "dashboard", label: "Dashboard - Bàn làm việc" },
    ],
  },
  {
    group: "Báo cáo",
    items: [
      { key: "rpt_in_parking", label: "Xe trong bãi" },
      { key: "rpt_entry", label: "Báo cáo xe vào" },
      { key: "rpt_exit", label: "Báo cáo xe ra" },
      { key: "rpt_monthly", label: "Thời hạn thẻ tháng" },
      { key: "rpt_card_proc", label: "Xử lý thẻ" },
      { key: "rpt_alert", label: "Sự kiện cảnh báo" },
    ],
  },
  {
    group: "Quản lý thẻ",
    items: [
      { key: "card_renew", label: "Gia hạn thẻ" },
      { key: "card_activate", label: "Kích hoạt thẻ" },
    ],
  },
  {
    group: "Quản lý khách hàng & danh mục",
    items: [
      { key: "customer", label: "Quản lý khách hàng" },
      { key: "card_groups", label: "Nhóm thẻ" },
    ],
  },
  {
    group: "Vận hành",
    items: [
      { key: "op_entry", label: "Xe vào" },
      { key: "op_exit", label: "Xe ra" },
      { key: "op_active_tickets", label: "Vé đang hoạt động" },
      { key: "op_history", label: "Lịch sử giao dịch" },
    ],
  },
  {
    group: "Hệ thống",
    items: [
      { key: "user_mgmt", label: "Quản lý người dùng" },
      { key: "sys_log", label: "Nhật ký hệ thống" },
      { key: "device_settings", label: "Cài đặt thiết bị" },
    ],
  },
];

const allPermKeys = permGroups.flatMap(g => g.items.map(i => i.key));

const defaultPerms: Record<string, Record<string, boolean>> = {
  admin: Object.fromEntries(allPermKeys.map(k => [k, true])),
  staff: Object.fromEntries(allPermKeys.map(k => [k, ["dashboard", "op_entry", "op_exit", "op_active_tickets", "op_history"].includes(k)])),
};

export default function RolesPermissions() {
  const [perms, setPerms] = useState(defaultPerms);
  const [saved, setSaved] = useState(false);

  const togglePerm = (roleKey: string, permKey: string) => {
    if (roleKey === "admin") return;
    setPerms(prev => ({
      ...prev,
      [roleKey]: { ...prev[roleKey], [permKey]: !prev[roleKey][permKey] },
    }));
    setSaved(false);
  };

  const toggleGroup = (roleKey: string, groupItems: { key: string }[]) => {
    if (roleKey === "admin") return;
    const allChecked = groupItems.every(i => perms[roleKey][i.key]);
    setPerms(prev => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey],
        ...Object.fromEntries(groupItems.map(i => [i.key, !allChecked])),
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const getTotalPerms = (roleKey: string) =>
    Object.values(perms[roleKey]).filter(Boolean).length;

  return (
    <div className="space-y-2">
      {/* Role overview */}
      <div className="grid grid-cols-2 gap-3">
        {roles.map(role => (
          <div key={role.key} className="bg-white border border-gray-200 rounded shadow-sm p-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-full ${role.colorClass} flex items-center justify-center flex-shrink-0`}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-gray-800">{role.label}</span>
                <span className={role.badgeClass}>{role.label}</span>
              </div>
              <p className="text-xs text-gray-500">{role.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-700">{getTotalPerms(role.key)}</div>
              <div className="text-xs text-gray-400">/ {allPermKeys.length} quyền</div>
            </div>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className={cls.sectionCard}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Ma trận phân quyền</span>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Check className="w-3.5 h-3.5" />Đã lưu thành công
              </span>
            )}
            <button className={cls.btnSearch} onClick={handleSave}>
              <Save className="w-3.5 h-3.5" />Lưu phân quyền
            </button>
          </div>
        </div>

        <div className="p-3 overflow-x-auto">
          <table className="border-collapse text-sm w-full">
            <thead>
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 min-w-[240px]">
                  Chức năng / Quyền hạn
                </th>
                {roles.map(role => (
                  <th key={role.key} className="px-4 py-2.5 text-center text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 min-w-[160px]">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={role.badgeClass}>{role.label}</span>
                      <span className="text-gray-400 font-normal text-[10px]">
                        {getTotalPerms(role.key)}/{allPermKeys.length} quyền
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permGroups.map((group, gi) => (
                <>
                  {/* Group header row */}
                  <tr key={`group-${gi}`} className="bg-blue-50 border-t-2 border-blue-200">
                    <td className="px-4 py-2 text-xs font-bold text-blue-700 border border-gray-200 uppercase tracking-wide">
                      {group.group}
                    </td>
                    {roles.map(role => {
                      const allChecked = group.items.every(i => perms[role.key][i.key]);
                      const someChecked = group.items.some(i => perms[role.key][i.key]);
                      return (
                        <td key={role.key} className="px-4 py-2 text-center border border-gray-200">
                          {role.key !== "admin" ? (
                            <button
                              onClick={() => toggleGroup(role.key, group.items)}
                              className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                                allChecked
                                  ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-50"
                                  : someChecked
                                  ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-50"
                                  : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {allChecked ? "Tất cả ✓" : someChecked ? "Một phần" : "Không có"}
                            </button>
                          ) : (
                            <span className="text-[10px] text-purple-600 font-medium">Toàn quyền</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Permission rows */}
                  {group.items.map((perm, pi) => (
                    <tr key={perm.key} className={`border-b border-gray-200 hover:bg-blue-50 ${pi % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}>
                      <td className="px-4 py-2.5 text-sm text-gray-700 border border-gray-200 pl-8">
                        <span className="text-gray-400 mr-2 text-xs">└</span>
                        {perm.label}
                      </td>
                      {roles.map(role => (
                        <td key={role.key} className="px-4 py-2.5 text-center border border-gray-200">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={perms[role.key][perm.key] ?? false}
                              onChange={() => togglePerm(role.key, perm.key)}
                              disabled={role.key === "admin"}
                              className="w-4 h-4 rounded cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed accent-blue-600"
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-200 pt-3">
            <span className="flex items-center gap-1.5">
              <input type="checkbox" checked readOnly className="w-3.5 h-3.5 accent-blue-600" />
              Có quyền
            </span>
            <span className="flex items-center gap-1.5">
              <input type="checkbox" readOnly className="w-3.5 h-3.5" />
              Không có quyền
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-amber-600">* Admin có toàn quyền, không thể chỉnh sửa.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
