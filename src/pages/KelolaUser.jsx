import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllUsers, updateUser, deleteUser } from "../utils/api";
import useAuthUser from "../hooks/useAuthUser";
import {
  HiOutlineUsers,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineHome,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Edit Modal ─────────────────────────────────────────
function EditModal({ user, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role ?? "Mahasiswa",
    NIM: user.NIM ?? "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 z-10">
        <h3 className="text-xl font-extrabold text-gray-900 mb-1">Edit User</h3>
        <p className="text-sm text-gray-500 mb-5">Ubah data pengguna</p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white cursor-pointer"
              >
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">NIM</label>
              <input
                type="number"
                value={form.NIM}
                onChange={(e) => setForm({ ...form, NIM: e.target.value })}
                placeholder="Opsional"
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={loading}
            className="flex-1 py-3 bg-[#1a4731] hover:bg-[#15392a] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#1a4731]/30 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ───────────────────────────────
function DeleteModal({ user, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 z-10 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiOutlineTrash className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-1">
          Hapus User?
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          Akun <span className="font-semibold text-gray-800">{user.name}</span>{" "}
          akan dihapus permanen.
        </p>
        <p className="text-xs text-red-500 mb-6">
          Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" /> Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────
export default function KelolaUser() {
  const navigate = useNavigate();
  const { user: adminUser, loading: authLoading } = useAuthUser("Admin");

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback((p = 1, q = "") => {
    setLoading(true);
    getAllUsers(p, 10, q)
      .then((res) => {
        if (res.status !== "succes") throw new Error();
        setUsers(res.data?.users ?? []);
        setPagination(res.data?.pagination ?? null);
      })
      .catch(() => setError("Gagal memuat data user."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authLoading && adminUser) fetchUsers(1, "");
  }, [authLoading, adminUser, fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
    fetchUsers(1, searchInput);
  };

  const handlePageChange = (p) => {
    setPage(p);
    fetchUsers(p, search);
  };

  const handleSaveEdit = async (form) => {
    setActionLoading(true);
    try {
      const res = await updateUser(editModal._id, form);
      if (res.status !== "succes") {
        showToast(res.message || "Gagal update user.", "error");
        return;
      }
      showToast("User berhasil diupdate!");
      setEditModal(null);
      fetchUsers(page, search);
    } catch {
      showToast("Tidak bisa terhubung ke server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res = await deleteUser(deleteModal._id);
      if (res.status !== "succes") {
        showToast(res.message || "Gagal hapus user.", "error");
        return;
      }
      showToast("User berhasil dihapus.");
      setDeleteModal(null);
      fetchUsers(page, search);
    } catch {
      showToast("Tidak bisa terhubung ke server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <FiLoader className="animate-spin h-8 w-8 text-[#1a4731]" />
      </div>
    );
  }

  const roleBadge = {
    Admin: "bg-[#1a4731] text-white",
    Mahasiswa: "bg-blue-100 text-blue-700 border border-blue-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={adminUser} showLogout />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}
        >
          {toast.type === "success" ? (
            <HiOutlineCheckCircle className="w-4 h-4" />
          ) : (
            <HiOutlineXCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      {editModal && (
        <EditModal
          user={editModal}
          onSave={handleSaveEdit}
          onCancel={() => setEditModal(null)}
          loading={actionLoading}
        />
      )}
      {deleteModal && (
        <DeleteModal
          user={deleteModal}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
          loading={actionLoading}
        />
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 flex flex-col gap-5">
          {/* ── LEFT: Table ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1a4731] to-[#2d6a4f] rounded-3xl px-6 sm:px-8 py-5 flex items-center justify-between shadow-xl shadow-[#1a4731]/20">
              <div>
                <Link
                  to="/admin"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1 mb-1"
                >
                  ← Dashboard
                </Link>
                <h1 className="text-white font-extrabold text-xl sm:text-2xl">
                  Kelola User
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  {pagination?.totalData ?? 0} pengguna terdaftar
                </p>
              </div>
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                <HiOutlineUsers className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#1a4731] transition-colors bg-white"
              />
              <button
                type="submit"
                className="w-12 h-12 bg-[#1a4731] hover:bg-[#15392a] text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0 shadow-md shadow-[#1a4731]/30"
              >
                <HiOutlineMagnifyingGlass className="w-5 h-5" />
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchInput("");
                    setPage(1);
                    fetchUsers(1, "");
                  }}
                  className="w-12 h-12 border border-red-200 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              )}
            </form>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                <HiOutlineExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-12">
                  <FiLoader className="animate-spin h-7 w-7 text-[#1a4731]" />
                </div>
              ) : users.length === 0 ? (
                <div className="py-16 text-center px-6">
                  <HiOutlineUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-semibold text-gray-700">
                    User tidak ditemukan
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Coba ubah kata kunci pencarian
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <li
                      key={u._id}
                      className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-2xl bg-[#1a4731]/10 overflow-hidden flex-shrink-0">
                        {u.photo ? (
                          <img
                            src={u.photo}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-[#1a4731] text-sm">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {u.name}
                          </p>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${roleBadge[u.role] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {u.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {u.NIM ? `NIM: ${u.NIM} · ` : ""}Bergabung{" "}
                          {formatDate(u.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setEditModal(u)}
                          className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                          title="Edit user"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(u)}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                          title="Hapus user"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Halaman {pagination.currentPage} dari{" "}
                    {pagination.totalPages} · {pagination.totalData} total
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a4731] hover:text-[#1a4731] transition-colors"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a4731] hover:text-[#1a4731] transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="flex flex-col gap-4">
            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4">Ringkasan User</h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Total User",
                    value: pagination?.totalData ?? 0,
                    icon: <HiOutlineUsers className="w-5 h-5" />,
                    color: "text-[#1a4731]",
                  },
                  {
                    label: "Admin",
                    value: users.filter((u) => u.role === "Admin").length,
                    icon: <HiOutlineShieldCheck className="w-5 h-5" />,
                    color: "text-[#1a4731]",
                  },
                  {
                    label: "Mahasiswa",
                    value: users.filter((u) => u.role === "Mahasiswa").length,
                    icon: <HiOutlineAcademicCap className="w-5 h-5" />,
                    color: "text-blue-600",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className={`flex items-center gap-2 ${s.color}`}>
                      {s.icon}
                      <p className="text-sm text-gray-600">{s.label}</p>
                    </div>
                    <p className={`text-xl font-extrabold ${s.color}`}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Panduan */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4">Panduan</h3>
              <ul className="space-y-3">
                {[
                  {
                    icon: <HiOutlinePencilSquare className="w-4 h-4" />,
                    text: "Klik ikon pensil untuk edit data user",
                  },
                  {
                    icon: <HiOutlineTrash className="w-4 h-4" />,
                    text: "Klik ikon hapus untuk menghapus akun user",
                  },
                  {
                    icon: <HiOutlineShieldCheck className="w-4 h-4" />,
                    text: "Ubah role untuk memberikan akses Admin",
                  },
                  {
                    icon: <HiOutlineMagnifyingGlass className="w-4 h-4" />,
                    text: "Gunakan search untuk mencari user",
                  },
                ].map((tip) => (
                  <li key={tip.text} className="flex items-start gap-3">
                    <span className="text-[#1a4731] flex-shrink-0 mt-0.5">
                      {tip.icon}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tip.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Back */}
            <Link
              to="/admin"
              className="bg-gradient-to-br from-[#1a4731] to-[#2d6a4f] rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-[#1a4731]/20 flex items-center gap-4 hover:opacity-95 transition-opacity group"
            >
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                <HiOutlineHome className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Kembali ke Dashboard</p>
                <p className="text-white/70 text-xs mt-0.5">
                  Lihat ringkasan admin
                </p>
              </div>
              <span className="ml-auto text-white/40 group-hover:text-white transition-colors text-lg">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
