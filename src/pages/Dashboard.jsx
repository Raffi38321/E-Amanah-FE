import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getMe,
  getLaporBarangStats,
  getLaporBarangList,
  getMyKlaims,
} from "../utils/api";
import Navbar from "../components/Navbar";

const statusStyle = {
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Rejected: "bg-red-100 text-red-600 border border-red-200",
};
const statusLabel = {
  Pending: "Menunggu",
  Success: "Disetujui",
  Rejected: "Ditolak",
};
const statusIcon = { Pending: "⏳", Success: "✅", Rejected: "❌" };

const claimedBadge = {
  true: {
    label: "Diambil",
    cls: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  false: {
    label: "Tersedia",
    cls: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({ value, label, color = "text-[#1a4731]", icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-1 hover:shadow-md transition-shadow">
      {icon && <span className="text-xl mb-0.5">{icon}</span>}
      <p className={`text-2xl sm:text-3xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 font-medium text-center leading-tight">
        {label}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [laporans, setLaporans] = useState([]);
  const [klaims, setKlaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/login");
    Promise.all([
      getMe(),
      getLaporBarangStats(),
      getLaporBarangList(1, 4),
      getMyKlaims(),
    ])
      .then(([meRes, statsRes, laporRes, klaimRes]) => {
        if (meRes.status !== "succes") return navigate("/login");
        setUser(meRes.data.employee);
        setStats(statsRes.data);
        setLaporans(laporRes.data?.laporans ?? []);
        setKlaims(klaimRes.data?.klaims ?? []);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-[#1a4731]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <p className="text-gray-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} showLogout />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Desktop: 2-col layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 flex flex-col gap-5">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#1a4731] to-[#2d6a4f] rounded-3xl px-6 py-7 sm:px-8 sm:py-8 text-white relative overflow-hidden shadow-xl shadow-[#1a4731]/20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <p className="text-white/70 text-sm mb-2">
                  Selamat datang kembali 👋
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
                  Halo, {user?.name?.split(" ")[0]}!
                </h1>
                <p className="text-white/70 text-sm max-w-sm">
                  Kehilangan barang di kampus? Laporkan atau temukan barang
                  melalui E-Amanah.
                </p>
                <div className="flex gap-3 mt-5 flex-wrap">
                  <Link
                    to="/lapor-barang"
                    className="bg-white text-[#1a4731] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-md"
                  >
                    📋 Lapor Temuan
                  </Link>
                  <button className="bg-white/15 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/25 active:scale-95 transition-all border border-white/20">
                    🔍 Cari Barang
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                value={stats?.totalTemuan ?? 0}
                label="Barang Temuan"
                icon="📦"
              />
              <StatCard
                value={stats?.sudahDiklaim ?? 0}
                label="Sudah Diklaim"
                icon="✅"
                color="text-emerald-600"
              />
              <StatCard
                value={stats?.menunggu ?? 0}
                label="Menunggu"
                icon="⏳"
                color="text-amber-600"
              />
            </div>

            {/* Laporan terbaru */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">
                  Laporan Temuan Terbaru
                </h2>
                <a
                  href="#"
                  className="text-xs text-[#1a4731] font-semibold hover:underline"
                >
                  Lihat Semua →
                </a>
              </div>
              {laporans.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-sm text-gray-400">Belum ada laporan</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {laporans.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          📍 {item.lokasi} · {formatDate(item.tanggal)}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${claimedBadge[item.isClaimed].cls}`}
                      >
                        {claimedBadge[item.isClaimed].label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5">
            {/* Profile card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1a4731]/10 overflow-hidden flex-shrink-0">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#1a4731]">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                  <span className="inline-block mt-1 text-xs bg-[#1a4731]/10 text-[#1a4731] font-semibold px-2 py-0.5 rounded-full">
                    {user?.role}
                  </span>
                </div>
              </div>
              {user?.NIM && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">NIM</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {user.NIM}
                  </p>
                </div>
              )}
            </div>

            {/* Aktivitas klaim */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">
                  Aktivitas Klaim Saya
                </h2>
              </div>
              {klaims.length === 0 ? (
                <div className="py-10 text-center px-4">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-sm text-gray-400">
                    Belum ada aktivitas klaim
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {klaims.map((k) => (
                    <li
                      key={k._id}
                      className="flex items-start gap-3 px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5
                        ${k.status === "Success" ? "bg-emerald-100" : k.status === "Rejected" ? "bg-red-100" : "bg-amber-100"}`}
                      >
                        {statusIcon[k.status]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {k.idLaporan?.name ?? "Barang"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(k.createdAt)}
                        </p>
                        <span
                          className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[k.status]}`}
                        >
                          {statusLabel[k.status]}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
