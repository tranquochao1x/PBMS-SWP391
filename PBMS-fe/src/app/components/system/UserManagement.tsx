import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  UserCog,
  X,
  Save,
} from "lucide-react";
import { cls } from "../common/ui";
import { DataTable, Column } from "../common/DataTable";
import { Pagination } from "../common/Pagination";
import {
  adminCardService,
  UserDto,
  CreateUserPayload,
  UpdateUserPayload,
} from "../../../services/adminCardService";

interface User {
  id: number;
  stt: number;
  tenDangNhap: string;
  hoTen: string;
  vaiTro: string;
  sdt: string;
  email: string;
  trangThai: string;
}

interface FormData {
  tenDangNhap: string;
  hoTen: string;
  vaiTro: string;
  sdt: string;
  email: string;
  trangThai: string;
  matKhau: string;
  xacNhanMatKhau: string;
}

const defaultForm: FormData = {
  tenDangNhap: "",
  hoTen: "",
  vaiTro: "Parking Staff",
  sdt: "",
  email: "",
  trangThai: "Hoạt động",
  matKhau: "",
  xacNhanMatKhau: "",
};

const mapDtoToUser = (dto: UserDto, index: number): User => {
  let vaiTro = "User";
  if (dto.roleName === "ADMIN") {
    vaiTro = "Admin";
  } else if (dto.roleName === "STAFF") {
    vaiTro = "Parking Staff";
  }

  return {
    id: dto.accountId,
    stt: index + 1,
    tenDangNhap: dto.username,
    hoTen: dto.fullName,
    vaiTro: vaiTro,
    sdt: dto.phone || "",
    email: dto.email || "",
    trangThai: dto.status === "ACTIVE" ? "Hoạt động" : "Khóa",
  };
};

const mapRoleToBackend = (vaiTro: string): string => {
  if (vaiTro === "Admin") return "ADMIN";
  if (vaiTro === "Parking Staff") return "STAFF";
  return "USER";
};

const mapStatusToBackend = (trangThai: string): string => {
  return trangThai === "Hoạt động" ? "ACTIVE" : "INACTIVE";
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminCardService.getUsers();
      setUsers(data.map((item, index) => mapDtoToUser(item, index)));
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(defaultForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (item: User) => {
    setEditItem(item);

    setForm({
      tenDangNhap: item.tenDangNhap,
      hoTen: item.hoTen,
      vaiTro: item.vaiTro,
      sdt: item.sdt,
      email: item.email,
      trangThai: item.trangThai,
      matKhau: "",
      xacNhanMatKhau: "",
    });

    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setForm(defaultForm);
    setFormError("");
  };

  const handleSave = async () => {
    setFormError("");

    if (!form.tenDangNhap.trim()) {
      setFormError("Vui lòng nhập tên đăng nhập.");
      return;
    }

    if (!form.hoTen.trim()) {
      setFormError("Vui lòng nhập họ tên.");
      return;
    }

    if (!editItem) {
      if (!form.matKhau.trim()) {
        setFormError("Vui lòng nhập mật khẩu.");
        return;
      }

      if (form.matKhau.length < 6) {
        setFormError("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }

      if (!form.xacNhanMatKhau.trim()) {
        setFormError("Vui lòng nhập xác nhận mật khẩu.");
        return;
      }

      if (form.matKhau !== form.xacNhanMatKhau) {
        setFormError("Mật khẩu xác nhận không khớp.");
        return;
      }
    } else {
      if (form.matKhau.trim() && form.matKhau.trim().length < 6) {
        setFormError("Mật khẩu mới phải có ít nhất 6 ký tự.");
        return;
      }
    }

    try {
      if (editItem) {
        const payload: UpdateUserPayload = {
          fullName: form.hoTen.trim(),
          roleName: mapRoleToBackend(form.vaiTro),
          phone: form.sdt.trim() || undefined,
          email: form.email.trim() || undefined,
          status: mapStatusToBackend(form.trangThai),
          password: form.matKhau.trim() || undefined,
        };
        await adminCardService.updateUser(editItem.id, payload);
      } else {
        const payload: CreateUserPayload = {
          username: form.tenDangNhap.trim(),
          fullName: form.hoTen.trim(),
          roleName: mapRoleToBackend(form.vaiTro),
          phone: form.sdt.trim() || undefined,
          email: form.email.trim() || undefined,
          password: form.matKhau.trim(),
          status: mapStatusToBackend(form.trangThai),
        };
        await adminCardService.createUser(payload);
      }

      await fetchUsers();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || "Thao tác thất bại.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminCardService.deleteUser(id);
      await fetchUsers();
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message || "Khóa tài khoản thất bại.");
    }
  };

  const columns: Column[] = [
    {
      key: "stt",
      label: "STT",
      width: "40px",
    },
    {
      key: "tenDangNhap",
      label: "Tên đăng nhập",
    },
    {
      key: "hoTen",
      label: "Họ tên",
      render: (value: string) => (
        <span className="font-medium text-gray-800">
          {value}
        </span>
      ),
    },
    {
      key: "vaiTro",
      label: "Vai trò",
      render: (value: string) => (
        <span
          className={
            value === "Admin"
              ? "inline-flex items-center rounded border border-purple-200 bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700"
              : value === "Parking Staff"
              ? "inline-flex items-center rounded border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700"
              : "inline-flex items-center rounded border border-blue-200 bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
          }
        >
          {value === "User" ? "Khách hàng" : value}
        </span>
      ),
    },
    {
      key: "sdt",
      label: "SĐT",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "trangThai",
      label: "Trạng thái",
      render: (value: string) => (
        <span
          className={
            value === "Hoạt động"
              ? cls.badge.green
              : cls.badge.red
          }
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      width: "70px",
      render: (_value: unknown, row: User) => (
        <div className="flex gap-1">
          <button
            type="button"
            title="Chỉnh sửa"
            onClick={() => openEdit(row)}
            className="rounded p-0.5 text-amber-500 hover:bg-amber-50 hover:text-amber-700"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            title={
              row.tenDangNhap === "admin"
                ? "Không thể khóa tài khoản admin"
                : "Khóa/Xóa"
            }
            onClick={() =>
              row.tenDangNhap !== "admin" &&
              setDeleteConfirm(row.id)
            }
            className={`rounded p-0.5 ${
              row.tenDangNhap === "admin"
                ? "cursor-not-allowed text-gray-300"
                : "text-red-500 hover:bg-red-50 hover:text-red-700"
            }`}
            disabled={row.tenDangNhap === "admin"}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-2">
      <div className={cls.filterSection}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Quản lý người dùng
            </span>
          </div>

          <button
            type="button"
            className={cls.btnAdd}
            onClick={openAdd}
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm người dùng
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center justify-between rounded border border-purple-200 bg-white px-4 py-3 shadow-sm">
          <div>
            <span className="mb-1 inline-flex items-center rounded border border-purple-200 bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
              Admin
            </span>
            <p className="text-xs text-gray-500">
              Toàn quyền quản trị hệ thống
            </p>
          </div>

          <span className="text-2xl font-bold text-purple-600">
            {users.filter((user) => user.vaiTro === "Admin").length}
          </span>
        </div>

        <div className="flex items-center justify-between rounded border border-green-200 bg-white px-4 py-3 shadow-sm">
          <div>
            <span className="mb-1 inline-flex items-center rounded border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              Parking Staff
            </span>
            <p className="text-xs text-gray-500">
              Nhân viên vận hành bãi xe
            </p>
          </div>

          <span className="text-2xl font-bold text-green-600">
            {users.filter((user) => user.vaiTro === "Parking Staff").length}
          </span>
        </div>

        <div className="flex items-center justify-between rounded border border-blue-200 bg-white px-4 py-3 shadow-sm">
          <div>
            <span className="mb-1 inline-flex items-center rounded border border-blue-200 bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              Khách hàng
            </span>
            <p className="text-xs text-gray-500">
              Chủ phương tiện đăng ký
            </p>
          </div>

          <span className="text-2xl font-bold text-blue-600">
            {users.filter((user) => user.vaiTro === "User").length}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className={cls.sectionCard}>
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
          <span className="text-sm font-medium text-gray-700">
            Danh sách người dùng
          </span>

          <span className="text-xs text-gray-500">
            Tổng: {users.length} tài khoản
          </span>
        </div>

        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-sm text-gray-500">
              Đang tải danh sách người dùng...
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={paginatedUsers}
              />

              <Pagination
                currentPage={page}
                totalPages={totalPages > 0 ? totalPages : 1}
                totalRecords={users.length}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[460px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between rounded-t-lg bg-blue-600 px-5 py-3">
              <span className="text-sm font-semibold text-white">
                {editItem
                  ? "Chỉnh sửa người dùng"
                  : "Thêm người dùng mới"}
              </span>

              <button
                type="button"
                onClick={closeModal}
                className="text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 p-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Tên đăng nhập{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    className={`${cls.input} w-full`}
                    placeholder="Nhập username"
                    value={form.tenDangNhap}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        tenDangNhap: event.target.value,
                      }))
                    }
                    disabled={!!editItem}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Họ tên{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    className={`${cls.input} w-full`}
                    placeholder="Nhập họ và tên"
                    value={form.hoTen}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        hoTen: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Vai trò
                  </label>

                  <select
                    className={`${cls.select} w-full`}
                    value={form.vaiTro}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        vaiTro: event.target.value,
                      }))
                    }
                  >
                    <option value="Admin">Admin</option>
                    <option value="Parking Staff">Parking Staff</option>
                    <option value="User">Khách hàng</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Trạng thái
                  </label>

                  <select
                    className={`${cls.select} w-full`}
                    value={form.trangThai}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        trangThai: event.target.value,
                      }))
                    }
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Khóa">Khóa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Số điện thoại
                  </label>

                  <input
                    className={`${cls.input} w-full`}
                    placeholder="09xxxxxxxx"
                    value={form.sdt}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        sdt: event.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Email
                  </label>

                  <input
                    type="email"
                    className={`${cls.input} w-full`}
                    placeholder="email@..."
                    value={form.email}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {!editItem ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Mật khẩu{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="password"
                      className={`${cls.input} w-full`}
                      placeholder="Nhập mật khẩu"
                      value={form.matKhau}
                      onChange={(event) => {
                        setForm((previous) => ({
                          ...previous,
                          matKhau: event.target.value,
                        }));

                        setFormError("");
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Xác nhận mật khẩu{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="password"
                      className={`${cls.input} w-full`}
                      placeholder="Nhập lại mật khẩu"
                      value={form.xacNhanMatKhau}
                      onChange={(event) => {
                        setForm((previous) => ({
                          ...previous,
                          xacNhanMatKhau: event.target.value,
                        }));

                        setFormError("");
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Mật khẩu mới (bỏ trống nếu không muốn đổi)
                  </label>

                  <input
                    type="password"
                    className={`${cls.input} w-full`}
                    placeholder="Nhập mật khẩu mới"
                    value={form.matKhau}
                    onChange={(event) => {
                      setForm((previous) => ({
                        ...previous,
                        matKhau: event.target.value,
                      }));

                      setFormError("");
                    }}
                  />
                </div>
              )}

              {formError && (
                <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {formError}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button
                type="button"
                className={cls.btnSearch}
                onClick={handleSave}
              >
                <Save className="h-3.5 w-3.5" />
                Lưu
              </button>

              <button
                type="button"
                className={cls.btnReset}
                onClick={closeModal}
              >
                <X className="h-3.5 w-3.5" />
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[360px] rounded-lg bg-white shadow-xl">
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Xác nhận khóa tài khoản
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Bạn có chắc muốn khóa tài khoản này không? (Trạng thái sẽ đổi sang Khóa)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button
                type="button"
                className={cls.btnDanger}
                onClick={() => handleDelete(deleteConfirm)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Khóa
              </button>

              <button
                type="button"
                className={cls.btnSecondary}
                onClick={() => setDeleteConfirm(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
