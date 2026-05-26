import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMe, getPendingKlaims, klaimAction } from "../utils/api";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineArchiveBox,
  HiOutlineExclamationTriangle,
  HiOutlineHome,
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Confirm modal ──────────────────────────────────────
function ConfirmModal({ klaim, action, onConfirm, onCancel, loading }) {
  const isApprove = action === "Success";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 z-10">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isApprove ? "bg-emerald-100" : "bg-red-100"}`}
        >
          {isApprove ? (
            <HiOutlineCheckCircle className="w-8 h-8 text-emerald-600" />
          ) : (
            <HiOutlineXCircle className="w-8 h-8 text-red-500" />
          )}
        </div>
        <h3 className="text-xl font-extrabold text-gray-900 text-center mb-1">
          {isApprove ? "Setujui Klaim?" : "Tolak Klaim?"}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-5">
          {isApprove
            ? "Barang akan ditandai sudah diklaim dan tidak bisa diklaim ulang."
            : "Pengajuan klaim ini akan ditolak dan pemohon akan diberitahu."}
        </p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 overflow-hidden flex-shrink-0">
            {klaim?.idLaporan?.photo ? (
              <img
                src={klaim.idLaporan.photo}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <HiOutlineArchiveBox className="w-6 h-6 text-emerald-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">
              {klaim?.idLaporan?.name ?? "Barang"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Pemohon: {klaim?.klaimBy?.name ?? "—"}
            </p>
          </div>
        </div>
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
            className={`flex-1 py-3 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 ${isApprove ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30" : "bg-red-500 hover:bg-red-600 shadow-red-500/30"}`}
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" /> Memproses...
              </>
            ) : isApprove ? (
              "Ya, Setujui"
            ) : (
              "Ya, Tolak"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Klaim card ─────────────────────────────────────────
function KlaimCard({ klaim, onApprove, onReject, actionLoading }) {
  const [expanded, setExpanded] = useState(false);
  const laporan = klaim.idLaporan;
  const pemohon = klaim.klaimBy;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 overflow-hidden flex-shrink-0 shadow-sm">
          {laporan?.photo ? (
            <img
              src={laporan.photo}
              alt={laporan.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HiOutlineArchiveBox className="w-7 h-7 text-emerald-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">
            {laporan?.name ?? "Barang"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
            <HiOutlineMapPin className="w-3 h-3 flex-shrink-0" />
            {laporan?.lokasi ?? "—"} · {formatDate(laporan?.tanggal)}
          </p>
          <p className="text-xs text-gray-500 truncate">
            👤 {pemohon?.name ?? "—"} · {timeAgo(klaim.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
            <HiOutlineClock className="w-3 h-3" /> Pending
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-[#1a4731] font-semibold hover:underline flex items-center gap-1"
          >
            <HiOutlineMagnifyingGlass className="w-3 h-3" />
            {expanded ? "Tutup" : "Detail"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Deskripsi Kepemilikan
            </p>
            <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-xl p-3 border border-gray-100">
              {klaim.deskripsiBarang}
            </p>
          </div>

          {klaim.photo && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Foto Bukti
              </p>
              <a href={klaim.photo} target="_blank" rel="noreferrer">
                <img
                  src={klaim.photo}
                  alt="bukti"
                  className="w-full max-h-48 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity cursor-zoom-in"
                />
              </a>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-0.5">Kategori</p>
              <p className="text-sm font-semibold text-gray-800">
                {laporan?.kategori ?? "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-0.5">Email Pemohon</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {pemohon?.email ?? "—"}
              </p>
            </div>
          </div>

          {laporan?.deskripsiBarang && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Deskripsi Barang (dari pelapor)
              </p>
              <p className="text-sm text-gray-600 leading-relaxed bg-white rounded-xl p-3 border border-gray-100">
                {laporan.deskripsiBarang}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => onReject(klaim)}
              disabled={actionLoading}
              className="flex-1 py-3 border-2 border-red-200 text-red-600 font-bold rounded-xl text-sm hover:bg-red-50 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <HiOutlineXCircle className="w-4 h-4" /> Tolak
            </button>
            <button
              onClick={() => onApprove(klaim)}
              disabled={actionLoading}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <HiOutlineCheckCircle className="w-4 h-4" /> Setujui
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────
export default function KelolaKlaim() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [klaims, setKlaims] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchKlaims = useCallback((p = 1) => {
    setLoading(true);
    getPendingKlaims(p, 10)
      .then((res) => {
        if (res.status !== "succes") throw new Error();
        setKlaims(res.data?.klaims ?? []);
        setPagination(res.data?.pagination ?? null);
      })
      .catch(() => setError("Gagal memuat data klaim."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/login");
    getMe().then((meRes) => {
      if (meRes.status !== "succes") return navigate("/login");
      if (meRes.data.employee.role !== "Admin") return navigate("/login");
      setUser(meRes.data.employee);
      fetchKlaims(1);
    });
  }, [navigate, fetchKlaims]);

  const handleAction = async () => {
    if (!modal) return;
    setActionLoading(true);
    try {
      const res = await klaimAction(modal.klaim._id, modal.action);
      if (res.status !== "succes") {
        showToast(res.message || "Gagal memproses klaim.", "error");
        return;
      }
      showToast(
        modal.action === "Success"
          ? "Klaim berhasil disetujui!"
          : "Klaim berhasil ditolak.",
        modal.action === "Success" ? "success" : "error",
      );
      setModal(null);
      fetchKlaims(page);
    } catch {
      showToast("Tidak bisa terhubung ke server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && klaims.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} showLogout />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <FiLoader className="animate-spin h-8 w-8 text-[#1a4731]" />
            <p className="text-gray-500 text-sm">Memuat data klaim...</p>
          </div>
        </div>
      </div>
    );
  }

  const guideItems = [
    {
      icon: <HiOutlineMagnifyingGlass className="w-4 h-4" />,
      text: 'Klik "Detail" untuk melihat deskripsi dan foto bukti',
    },
    {
      icon: <HiOutlineCheckCircle className="w-4 h-4" />,
      text: "Setujui jika deskripsi dan bukti sesuai dengan barang",
    },
    {
      icon: <HiOutlineXCircle className="w-4 h-4" />,
      text: "Tolak jika bukti tidak cukup atau mencurigakan",
    },
    {
      icon: <HiOutlineArchiveBox className="w-4 h-4" />,
      text: "Barang yang disetujui otomatis ditandai sudah diklaim",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} showLogout />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white flex items-center gap-2 transition-all ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}
        >
          {toast.type === "success" ? (
            <HiOutlineCheckCircle className="w-4 h-4" />
          ) : (
            <HiOutlineXCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      {modal && (
        <ConfirmModal
          klaim={modal.klaim}
          action={modal.action}
          onConfirm={handleAction}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 flex flex-col gap-5">
          {/* Left */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-gradient-to-r from-[#1a4731] to-[#2d6a4f] rounded-3xl px-6 sm:px-8 py-5 flex items-center justify-between shadow-xl shadow-[#1a4731]/20">
              <div>
                <Link
                  to="/admin"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1 mb-1"
                >
                  ← Dashboard
                </Link>
                <h1 className="text-white font-extrabold text-xl sm:text-2xl">
                  Kelola Klaim
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  {pagination?.totalData ?? 0} pengajuan menunggu verifikasi
                </p>
              </div>
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                <HiOutlineClipboardDocumentList className="w-7 h-7 text-white" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                <HiOutlineExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {klaims.length === 0 && !loading ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-16 text-center px-6">
                <HiOutlineCheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                <p className="font-bold text-gray-800 text-lg">
                  Semua klaim sudah diproses!
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Tidak ada pengajuan klaim yang menunggu verifikasi.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <FiLoader className="animate-spin h-6 w-6 text-[#1a4731]" />
                  </div>
                ) : (
                  klaims.map((k) => (
                    <KlaimCard
                      key={k._id}
                      klaim={k}
                      onApprove={(klaim) =>
                        setModal({ klaim, action: "Success" })
                      }
                      onReject={(klaim) =>
                        setModal({ klaim, action: "Rejected" })
                      }
                      actionLoading={actionLoading}
                    />
                  ))
                )}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
                <p className="text-xs text-gray-400">
                  Halaman {pagination.currentPage} dari {pagination.totalPages}{" "}
                  · {pagination.totalData} total
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPage(page - 1);
                      fetchKlaims(page - 1);
                    }}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a4731] hover:text-[#1a4731] transition-colors"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => {
                      setPage(page + 1);
                      fetchKlaims(page + 1);
                    }}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a4731] hover:text-[#1a4731] transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-amber-50 rounded-3xl border border-amber-100 p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiOutlineClock className="w-5 h-5 text-amber-600" />
                <p className="text-sm font-semibold text-gray-700">Menunggu</p>
              </div>
              <p className="text-3xl font-extrabold text-amber-600">
                {pagination?.totalData ?? 0}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#1a4731]/10 rounded-lg flex items-center justify-center text-[#1a4731]">
                  <HiOutlineClipboardDocumentList className="w-4 h-4" />
                </span>
                Panduan Verifikasi
              </h3>
              <ul className="space-y-3">
                {guideItems.map((tip) => (
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
