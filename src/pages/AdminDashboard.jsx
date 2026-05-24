import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe, getKlaimStats, getPendingKlaims } from "../utils/api";
import Navbar from "../components/Navbar";
import {
  HiOutlineArchiveBox,
  HiOutlineInboxArrowDown,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function StatCard({ value, label, color, bg, icon }) {
  return (
    <div
      className={`${bg} rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-1 hover:shadow-md transition-shadow border border-gray-100`}
    >
      <div className={`${color} mb-0.5`}>{icon}</div>
      <p className={`text-2xl sm:text-3xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 font-medium text-center leading-tight">
        {label}
      </p>
    </div>
  );
}

const menuItems = (klaimMasuk) => [
  {
    icon: <HiOutlineArchiveBox className="w-6 h-6" />,
    label: "Kelola Barang",
    sub: "Tambah & edit barang",
    iconBg: "bg-emerald-100 text-emerald-700",
    ring: "",
    to: "#",
  },
  {
    icon: <HiOutlineClipboardDocumentList className="w-6 h-6" />,
    label: "Cek Klaim",
    sub: `${klaimMasuk} klaim menunggu`,
    subColor: "text-amber-600 font-semibold",
    iconBg: "bg-amber-50 text-amber-600",
    ring: "ring-2 ring-amber-400",
    to: "/admin/klaim",
  },
  {
    icon: <HiOutlineUsers className="w-6 h-6" />,
    label: "Kelola User",
    sub: "Manajemen pengguna",
    iconBg: "bg-blue-100 text-blue-600",
    ring: "",
    to: "#",
  },
  {
    icon: <HiOutlineChartBar className="w-6 h-6" />,
    label: "Laporan",
    sub: "Statistik & rekap",
    iconBg: "bg-teal-100 text-teal-600",
    ring: "",
    to: "#",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [klaims, setKlaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/login");
    Promise.all([getMe(), getKlaimStats(), getPendingKlaims(1, 5)])
      .then(([meRes, statsRes, klaimRes]) => {
        if (meRes.status !== "succes") return navigate("/login");
        if (meRes.data.employee.role !== "Admin") return navigate("/dashboard");
        setUser(meRes.data.employee);
        setStats(statsRes.data);
        setKlaims(klaimRes.data?.klaims ?? []);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FiLoader className="animate-spin h-8 w-8 text-[#1a4731]" />
          <p className="text-gray-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} showLogout />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 flex flex-col gap-5">
          {/* ── LEFT ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#1a4731] to-[#2d6a4f] rounded-3xl px-6 py-7 sm:px-8 sm:py-8 text-white relative overflow-hidden shadow-xl shadow-[#1a4731]/20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  Admin Panel
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1">
                  Admin Dashboard
                </h1>
                <p className="text-white/70 text-sm">
                  Panel Pengelola E-Amanah · {user?.name}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                value={stats?.totalBarang ?? 0}
                label="Total Barang"
                icon={<HiOutlineArchiveBox className="w-6 h-6" />}
                color="text-[#1a4731]"
                bg="bg-white"
              />
              <StatCard
                value={stats?.klaimMasuk ?? 0}
                label="Klaim Masuk"
                icon={<HiOutlineInboxArrowDown className="w-6 h-6" />}
                color="text-amber-600"
                bg="bg-amber-50"
              />
              <StatCard
                value={stats?.selesai ?? 0}
                label="Selesai"
                icon={<HiOutlineCheckCircle className="w-6 h-6" />}
                color="text-emerald-600"
                bg="bg-emerald-50"
              />
              <StatCard
                value={stats?.ditolak ?? 0}
                label="Ditolak"
                icon={<HiOutlineXCircle className="w-6 h-6" />}
                color="text-red-500"
                bg="bg-red-50"
              />
            </div>

            {/* Menu Admin */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h2 className="font-bold text-gray-900 mb-4">Menu Admin</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {menuItems(stats?.klaimMasuk ?? 0).map((m) => (
                  <Link
                    key={m.label}
                    to={m.to}
                    className={`rounded-2xl p-4 sm:p-5 text-left hover:shadow-md active:scale-[0.98] transition-all bg-white border border-gray-100 ${m.ring}`}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl ${m.iconBg} flex items-center justify-center mb-3`}
                    >
                      {m.icon}
                    </div>
                    <p className="text-sm font-bold text-gray-900">{m.label}</p>
                    <p
                      className={`text-xs mt-0.5 ${m.subColor ?? "text-gray-400"}`}
                    >
                      {m.sub}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-5">
            {/* Profile */}
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
                  <span className="inline-block mt-1 text-xs bg-[#1a4731] text-white font-semibold px-2.5 py-0.5 rounded-full">
                    Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Klaim terbaru */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Klaim Terbaru</h2>
                <Link
                  to="/admin/klaim"
                  className="text-xs text-[#1a4731] font-semibold hover:underline"
                >
                  Lihat Semua →
                </Link>
              </div>
              {klaims.length === 0 ? (
                <div className="py-10 text-center px-4">
                  <HiOutlineClipboardDocumentList className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Tidak ada klaim pending
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {klaims.map((k) => (
                    <li
                      key={k._id}
                      className="flex items-center gap-3 px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 overflow-hidden flex-shrink-0">
                        {k.idLaporan?.photo ? (
                          <img
                            src={k.idLaporan.photo}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HiOutlineArchiveBox className="w-5 h-5 text-emerald-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {k.idLaporan?.name ?? "Barang"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {k.klaimBy?.name ?? "User"} · {timeAgo(k.createdAt)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex-shrink-0 flex items-center gap-1">
                        <HiOutlineClock className="w-3 h-3" /> Pending
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ringkasan */}
            <div className="bg-gradient-to-br from-[#1a4731] to-[#2d6a4f] rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-[#1a4731]/20">
              <h3 className="font-bold text-sm mb-3 text-white/80">
                Ringkasan Sistem
              </h3>
              <div className="space-y-2.5">
                {[
                  {
                    label: "Tingkat klaim berhasil",
                    value: stats?.totalBarang
                      ? `${Math.round((stats.selesai / stats.totalBarang) * 100)}%`
                      : "0%",
                  },
                  { label: "Klaim pending", value: stats?.klaimMasuk ?? 0 },
                  {
                    label: "Total barang tercatat",
                    value: stats?.totalBarang ?? 0,
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between"
                  >
                    <p className="text-xs text-white/70">{r.label}</p>
                    <p className="text-sm font-bold">{r.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
