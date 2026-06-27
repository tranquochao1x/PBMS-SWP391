import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, Tag, RefreshCw } from "lucide-react";
import { cls } from "../common/ui";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";
import { adminCardService } from "../../../services/adminCardService";

interface CardGroup {
  id: number;
  stt: number;
  tenNhom: string;
  loaiPhuongTien: string;
  loaiVe: string;
  giaTien: string;
  moTa: string;
  trangThai: string;
}

interface FormData {
  tenNhom: string;
  loaiPhuongTien: string;
  loaiVe: string;
  giaTien: string;
  moTa: string;
  trangThai: string;
}

const defaultForm: FormData = {
  tenNhom: "",
  loaiPhuongTien: "Xe máy",
  loaiVe: "Vé lượt",
  giaTien: "",
  moTa: "",
  trangThai: "Hoạt động",
};

export default function CardGroups() {
  const [data, setData] = useState<CardGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<CardGroup | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const result = await adminCardService.getAllCardGroups();
      const mapped = result.map((g, idx) => ({
        id: g.cardGroupId,
        stt: idx + 1,
        tenNhom: g.groupName,
        loaiPhuongTien: g.vehicleType === "MOTORCYCLE" ? "Xe máy" : g.vehicleType === "CAR" ? "Ô tô" : g.vehicleType,
        loaiVe: g.ticketType === "SINGLE" ? "Vé lượt" : g.ticketType === "DAY" ? "Vé ngày" : g.ticketType === "MONTHLY" ? "Vé tháng" : g.ticketType,
        giaTien: g.basePrice.toLocaleString("vi-VN"),
        moTa: g.description || "",
        trangThai: g.status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động",
      }));
      setData(mapped);
      setError("");
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách nhóm thẻ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (item: CardGroup) => {
    setEditItem(item);
    setForm({
      tenNhom: item.tenNhom,
      loaiPhuongTien: item.loaiPhuongTien,
      loaiVe: item.loaiVe,
      giaTien: item.giaTien,
      moTa: item.moTa,
      trangThai: item.trangThai,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.tenNhom.trim() || !form.giaTien.trim()) return;

    const vehicleType = form.loaiPhuongTien === "Xe máy" ? "MOTORCYCLE" : "CAR";
    const ticketType = form.loaiVe === "Vé lượt" ? "SINGLE" : form.loaiVe === "Vé ngày" ? "DAY" : "MONTHLY";
    const basePrice = parseFloat(form.giaTien.replace(/[.,\s]/g, ""));
    if (isNaN(basePrice)) {
      alert("Giá tiền không hợp lệ.");
      return;
    }
    const defaultDurationDays = ticketType === "SINGLE" ? 0 : ticketType === "DAY" ? 1 : 30;
    const reservationAllowed = ticketType === "MONTHLY" && vehicleType === "CAR";
    const status = form.trangThai === "Hoạt động" ? "ACTIVE" : "INACTIVE";

    const payload = {
      groupName: form.tenNhom.trim(),
      vehicleType,
      ticketType,
      basePrice,
      defaultDurationDays,
      reservationAllowed,
      description: form.moTa.trim(),
      status,
    };

    try {
      if (editItem) {
        await adminCardService.updateCardGroup(editItem.id, payload);
      } else {
        await adminCardService.createCardGroup(payload);
      }
      setShowModal(false);
      fetchGroups();
    } catch (err: any) {
      alert(err.message || "Lưu nhóm thẻ thất bại.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminCardService.deleteCardGroup(id);
      setDeleteConfirm(null);
      fetchGroups();
    } catch (err: any) {
      alert(err.message || "Xóa nhóm thẻ thất bại.");
    }
  };

  const columns: Column[] = [
    { key: "stt", label: "STT", width: "45px" },
    {
      key: "tenNhom", label: "Tên nhóm thẻ",
      render: (v: string) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      key: "loaiPhuongTien", label: "Loại phương tiện",
      render: (v: string) => (
        <span className={v === "Xe máy" ? cls.badge.blue : cls.badge.amber}>{v}</span>
      ),
    },
    {
      key: "loaiVe", label: "Loại vé",
      render: (v: string) => (
        <span className={v === "Vé tháng" ? cls.badge.green : cls.badge.gray}>{v}</span>
      ),
    },
    {
      key: "giaTien", label: "Giá tiền",
      render: (v: string) => <span className="font-semibold text-blue-700">{v} VNĐ</span>,
    },
    { key: "moTa", label: "Mô tả" },
    {
      key: "trangThai", label: "Trạng thái",
      render: (v: string) => (
        <span className={v === "Hoạt động" ? cls.badge.green : cls.badge.red}>{v}</span>
      ),
    },
    {
      key: "actions", label: "Thao tác", width: "75px",
      render: (_: any, row: CardGroup) => (
        <div className="flex gap-1">
          <button
            title="Sửa"
            onClick={() => openEdit(row)}
            className="text-amber-500 hover:text-amber-700 p-0.5 rounded hover:bg-amber-50"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            title="Xóa"
            onClick={() => setDeleteConfirm(row.id)}
            className="text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className={cls.filterSection}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Quản lý nhóm thẻ</span>
          </div>
          <button className={cls.btnAdd} onClick={openAdd}>
            <Plus className="w-3.5 h-3.5" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={cls.sectionCard}>
        <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Danh sách nhóm thẻ</span>
          <span className="text-xs text-gray-500">Tổng: {data.length} nhóm</span>
        </div>
        <div className="p-2">
          {loading ? (
            <div className="text-center py-10 text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              Đang tải danh sách nhóm thẻ...
            </div>
          ) : error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-4 text-center">
              {error}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded bg-white shadow-sm">
              Chưa cấu hình nhóm thẻ nào.
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={paginatedData} />
              <Pagination currentPage={page} totalPages={totalPages} totalRecords={data.length} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[480px]">
            <div className="flex items-center justify-between px-5 py-3 bg-blue-600 rounded-t-lg">
              <span className="text-white text-sm font-semibold">
                {editItem ? "Chỉnh sửa nhóm thẻ" : "Thêm nhóm thẻ mới"}
              </span>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Tên nhóm thẻ <span className="text-red-500">*</span>
                </label>
                <input
                  className={`${cls.input} w-full`}
                  placeholder="VD: THẺ LƯỢT XE MÁY"
                  value={form.tenNhom}
                  onChange={e => setForm(p => ({ ...p, tenNhom: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Loại phương tiện</label>
                  <select
                    className={`${cls.select} w-full`}
                    value={form.loaiPhuongTien}
                    onChange={e => setForm(p => ({ ...p, loaiPhuongTien: e.target.value }))}
                  >
                    <option>Xe máy</option>
                    <option>Ô tô</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Loại vé</label>
                  <select
                    className={`${cls.select} w-full`}
                    value={form.loaiVe}
                    onChange={e => setForm(p => ({ ...p, loaiVe: e.target.value }))}
                  >
                    <option>Vé lượt</option>
                    <option>Vé ngày</option>
                    <option>Vé tháng</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Giá tiền (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`${cls.input} w-full`}
                    placeholder="VD: 5.000"
                    value={form.giaTien}
                    onChange={e => setForm(p => ({ ...p, giaTien: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Trạng thái</label>
                  <select
                    className={`${cls.select} w-full`}
                    value={form.trangThai}
                    onChange={e => setForm(p => ({ ...p, trangThai: e.target.value }))}
                  >
                    <option>Hoạt động</option>
                    <option>Ngừng hoạt động</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mô tả</label>
                <textarea
                  className={`${cls.input} w-full h-16 py-1.5 resize-none`}
                  placeholder="Mô tả nhóm thẻ..."
                  value={form.moTa}
                  onChange={e => setForm(p => ({ ...p, moTa: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">
              <button className={cls.btnSearch} onClick={handleSave}>
                <Save className="w-3.5 h-3.5" />Lưu
              </button>
              <button className={cls.btnReset} onClick={() => setShowModal(false)}>
                <X className="w-3.5 h-3.5" />Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[360px]">
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4.5 h-4.5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Xác nhận xóa</p>
                  <p className="text-xs text-gray-500 mt-0.5">Bạn có chắc chắn muốn xóa nhóm thẻ này không?</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">
              <button className={cls.btnDanger} onClick={() => handleDelete(deleteConfirm)}>
                <Trash2 className="w-3.5 h-3.5" />Xóa
              </button>
              <button className={cls.btnSecondary} onClick={() => setDeleteConfirm(null)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
