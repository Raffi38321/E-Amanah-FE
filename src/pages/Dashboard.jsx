import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getLaporBarangStats,
  getLaporBarangList,
  getMyKlaims,
} from "../utils/api";
import Navbar from "../components/Navbar";
import useAuthUser from "../hooks/useAuthUser";
import {
  HiOutlineArchiveBox,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineInboxStack,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";
import StatCard from "../components/StatCard";
import ProfileCard from "../components/ProfileCard";
import HeroSectionCard from "../components/HeroSectionCard";
import ActivitasClaimCard from "../components/ActivitasClaimCard";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthUser("Mahasiswa");
  const [stats, setStats] = useState(null);
  const [laporans, setLaporans] = useState([]);
  const [klaims, setKlaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getLaporBarangStats(),
      getLaporBarangList(1, 4),
      getMyKlaims(),
    ])
      .then(([statsRes, laporRes, klaimRes]) => {
        setStats(statsRes.data);
        setLaporans(laporRes.data?.laporans ?? []);
        setKlaims(klaimRes.data?.klaims ?? []);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (authLoading || loading) {
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
            <HeroSectionCard user={user} />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                value={stats?.totalTemuan ?? 0}
                label="Barang Temuan"
                icon={<HiOutlineArchiveBox className="w-6 h-6" />}
              />
              <StatCard
                value={stats?.sudahDiklaim ?? 0}
                label="Sudah Diklaim"
                icon={<HiOutlineCheckCircle className="w-6 h-6" />}
                color="text-emerald-600"
              />
              <StatCard
                value={stats?.menunggu ?? 0}
                label="Menunggu"
                icon={<HiOutlineClock className="w-6 h-6" />}
                color="text-amber-600"
              />
            </div>

            {/* Laporan terbaru */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">
                  Laporan Temuan Terbaru
                </h2>
                <Link
                  to="/daftar-barang"
                  className="text-xs text-[#1a4731] font-semibold hover:underline"
                >
                  Lihat Semua →
                </Link>
              </div>
              {laporans.length === 0 ? (
                <div className="py-12 text-center">
                  <HiOutlineInboxStack className="w-10 h-10 text-gray-300 mx-auto mb-2" />
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
                          <div className="w-full h-full flex items-center justify-center">
                            <HiOutlineArchiveBox className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center gap-1">
                          <HiOutlineMapPin className="w-3 h-3 flex-shrink-0" />
                          {item.lokasi} · {formatDate(item.tanggal)}
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

          {/* ── KANAN TOT ── */}
          <div className="flex flex-col gap-5">
            <ProfileCard user={user} />
            <ActivitasClaimCard klaims={klaims} formatDate={formatDate} />
          </div>
        </div>
      </main>
    </div>
  );
}
