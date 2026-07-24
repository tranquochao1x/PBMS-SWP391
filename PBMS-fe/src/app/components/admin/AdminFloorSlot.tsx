import { useState, useEffect } from "react";
import {
  Layers,
  RefreshCw,
  Car,
  Bike,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit,
  X,
  Trash2,
} from "lucide-react";

import { cls } from "../common/ui";
import {
  staffService,
  SlotStatsResponse,
} from "../../../services/staffService";
import { authService } from "../../../services/authService";

export default function AdminFloorSlot() {
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [dateStr, setDateStr] = useState<string>(getTodayString());
  const currentUserRole = authService.getCurrentUser()?.role;
  const [stats, setStats] = useState<SlotStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<any>(null);
  const [floorForm, setFloorForm] = useState({
    floorCode: "",
    floorName: "",
    totalCarSlots: 0,
    totalMotorcycleSlots: 0,
  });

  const fetchStats = async (targetDate: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await staffService.getSlotStatistics(targetDate);
      setStats(data);
    } catch (err: any) {
      setErrorMsg("Không thể tải thống kê slot đỗ xe: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(dateStr);
  }, []);

  const handleUpdate = () => {
    fetchStats(dateStr);
    setSuccessMsg("Đã cập nhật dữ liệu thành công!");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleDeleteFloor = async (floorId: number, floorName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${floorName}?\nLưu ý: Chỉ có thể xóa nếu không có dữ liệu check-in/out hay đặt vé.`)) return;
    
    setLoading(true);
    setErrorMsg(null);
    try {
      await staffService.deleteFloor(floorId);
      setSuccessMsg(`Đã xóa ${floorName} thành công!`);
      fetchStats(dateStr);
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi xóa.");
      setLoading(false);
    }
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const openCreateModal = () => {
    setEditingFloor(null);
    setFloorForm({
      floorCode: "",
      floorName: "",
      totalCarSlots: 0,
      totalMotorcycleSlots: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (floor: any) => {
    setEditingFloor(floor);
    setFloorForm({
      floorCode: floor.floorCode,
      floorName: floor.floorName,
      totalCarSlots: floor.totalCarSlots,
      totalMotorcycleSlots: floor.totalMotorcycleSlots,
    });
    setIsModalOpen(true);
  };

  const handleSubmitFloor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      if (editingFloor) {
        await staffService.updateFloor(editingFloor.floorId, floorForm);
        setSuccessMsg("Cập nhật thông tin tầng thành công!");
      } else {
        await staffService.createFloor(floorForm);
        setSuccessMsg("Thêm tầng mới thành công!");
      }
      setIsModalOpen(false);
      fetchStats(dateStr);
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi.");
      setLoading(false);
    }
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className={`${cls.pageWrapper} px-6 py-4 bg-gray-50/50 min-h-screen`}>
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
        <span>Trang chủ</span>
        <span className="text-gray-300">/</span>
        <span>Web</span>
        <span className="text-gray-300">/</span>
        <span>Hệ thống</span>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-700">Quản lý slot</span>
      </div>

      {/* Title */}
      <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">
            Thông tin tầng đỗ xe
          </h1>
        </div>
        {currentUserRole === 'admin' && (
          <button
            onClick={openCreateModal}
            className="flex h-9 items-center gap-2 rounded bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Thêm tầng mới
          </button>
        )}
      </div>

      {/* Date Filter Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ngày xem thống kê
            </label>
            <input
              type="date"
              className={`${cls.input} w-48`}
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className={`${cls.btnSearch} self-end`}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Cập nhật
          </button>
        </div>
      </div>

      {/* Global notifications */}
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700 shadow-sm animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3.5 text-sm font-medium text-green-700 shadow-sm animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Card 1: Tổng slot ô tô */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng slot ô tô
            </div>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {loading ? "..." : (stats?.totalCarSlots ?? 0)}
            </div>
          </div>
        </div>

        {/* Card 2: Tổng slot xe máy */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
            <Bike className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng slot xe máy
            </div>
            <div className="text-2xl font-black text-green-600 mt-1">
              {loading ? "..." : (stats?.totalMotorcycleSlots ?? 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Thống kê phương tiện theo tầng
          </h2>
          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
            {loading ? "..." : `${stats?.floorStats.length ?? 0} tầng`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Tầng</th>
                <th className="px-4 py-3 text-center">Tổng slot ô tô</th>
                <th className="px-4 py-3 text-center">Trống ô tô</th>
                <th className="px-4 py-3 text-center">Tổng slot xe máy</th>
                <th className="px-4 py-3 text-center">Trống xe máy</th>
                {currentUserRole === 'admin' && (
                  <th className="px-4 py-3 text-center">Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={currentUserRole === 'admin' ? 6 : 5}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                      Đang tải thống kê...
                    </div>
                  </td>
                </tr>
              ) : !stats || stats.floorStats.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentUserRole === 'admin' ? 6 : 5}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy dữ liệu thống kê nào.
                  </td>
                </tr>
              ) : (
                stats.floorStats.map((floor) => (
                  <tr
                    key={floor.floorId}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Tầng */}
                    <td className="px-4 py-3.5 text-sm font-extrabold text-blue-600 whitespace-nowrap">
                      {floor.floorCode}
                    </td>
                    {/* Tổng slot ô tô */}
                    <td className="px-4 py-3.5 text-center text-sm font-semibold text-gray-700">
                      {floor.totalCarSlots}
                    </td>
                    {/* Trống ô tô */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex justify-center items-center min-w-[34px] px-2.5 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700">
                        {floor.availableCarSlots}
                      </span>
                    </td>
                    {/* Tổng slot xe máy */}
                    <td className="px-4 py-3.5 text-center text-sm font-semibold text-gray-700">
                      {floor.totalMotorcycleSlots}
                    </td>
                    {/* Trống xe máy */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex justify-center items-center min-w-[34px] px-2.5 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700">
                        {floor.availableMotorcycleSlots}
                      </span>
                    </td>
                    {currentUserRole === 'admin' && (
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => openEditModal(floor)}
                          className="text-gray-500 hover:text-blue-600 transition p-1"
                          title="Chỉnh sửa slot"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFloor(floor.floorId, floor.floorName)}
                          className="text-gray-500 hover:text-red-600 transition p-1 ml-2"
                          title="Xóa tầng"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Floor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {editingFloor ? "Chỉnh sửa Tầng đỗ xe" : "Thêm Tầng mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitFloor} className="space-y-4">
              {editingFloor && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Mã tầng <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    disabled
                    value={floorForm.floorCode}
                    onChange={(e) =>
                      setFloorForm({ ...floorForm, floorCode: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-gray-100"
                    placeholder="VD: B3"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Tên tầng <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={floorForm.floorName}
                  onChange={(e) =>
                    setFloorForm({ ...floorForm, floorName: e.target.value })
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="VD: Tầng hầm B3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Slot Ô tô <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={floorForm.totalCarSlots}
                    onChange={(e) =>
                      setFloorForm({
                        ...floorForm,
                        totalCarSlots: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Slot Xe máy <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={floorForm.totalMotorcycleSlots}
                    onChange={(e) =>
                      setFloorForm({
                        ...floorForm,
                        totalMotorcycleSlots: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
