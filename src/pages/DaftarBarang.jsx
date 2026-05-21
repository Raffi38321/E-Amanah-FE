import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMe, getAllLaporBarang } from "../utils/api";

const KATEGORI_OPTIONS = [
  "Semua Kategori",
  "Elektronik",
  "Dokumen",
  "Pakaian",
  "Aksesoris",
  "Kendaraan",
  "Alat Tulis",
  "Tas & Dompet",
  "Lainnya",
];

// badge config berdasarkan isClaimed
const badge = {
  false: {
    label: "Tersedia",
    cls: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  true: {
    label: "Sudah Diambil",
    cls: "bg-gray-100 text-gray-500 border border-gray-200",
  },
};

// emoji icon per kategori
const kategoriIcon = {
  Elektronik: "📱",
  Dokumen: "📄",
  Pakaian: "👕",
  Aksesoris: "👓",
  Kendaraan: "🔑",
  "Alat Tulis": "✏️",
  "Tas & Dompet": "👜",
  Lainnya: "📦",
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const PAGE_SIZE = 10;

export default function DaftarBarang() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filter state
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [kategori, setKategori] = useState("Semua Kategori");
  const [lokasi, setLokasi] = useState("Semua Lokasi");
  const [page, setPage] = useState(1);

  // fetch all (up to 100) so we can filter client-side
  useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/login");

    Promise.all([getMe(), getAllLaporBarang(1, 100)])
      .then(([meRes, listRes]) => {
        if (meRes.status !== "succes") return navigate("/login");
        setUser(meRes.data.employee);
        setItems(listRes.data?.laporans ?? []);
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [navigate]);

  // unique lokasi list from data
  const lokasiOptions = useMemo(() => {
    const set = new Set(items.map((i) => i.lokasi));
    return ["Semua Lokasi", ...Array.from(set)];
  }, [items]);

  // filtered + paginated
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.deskripsiBarang?.toLowerCase().includes(search.toLowerCase());
      const matchKategori =
        kategori === "Semua Kategori" || item.kategori === kategori;
      const matchLokasi = lokasi === "Semua Lokasi" || item.lokasi === lokasi;
      return matchSearch && matchKategori && matchLokasi;
    });
  }, [items, search, kategori, lokasi]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleKategori = (val) => {
    setKategori(val);
    setPage(1);
  };

  const handleLokasi = (val) => {
    setLokasi(val);
    setPage(1);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} showLogout />
        <div className="flex-1 flex items-center justify-center">
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
            <p className="text-gray-500 text-sm">Memuat daftar barang...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} showLogout />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 flex flex-col gap-5">
          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Header card */}
            <div className="bg-gradient-to-r from-[#1a4731] to-[#2d6a4f] rounded-3xl px-6 sm:px-8 py-5 flex items-center justify-between shadow-xl shadow-[#1a4731]/20">
              <div>
                <h1 className="text-white font-extrabold text-xl sm:text-2xl">
                  Daftar Barang
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  Semua laporan aktif · {filtered.length} barang
                </p>
              </div>
              <Link
                to="/lapor-barang"
                className="flex items-center gap-1.5 bg-white text-[#1a4731] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-md flex-shrink-0"
              >
                + Tambah
              </Link>
            </div>

            {/* Search + filter */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-5 sm:px-6 py-5 flex flex-col gap-3">
              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cari barang..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white"
                />
                <button
                  type="submit"
                  className="w-12 h-12 bg-[#1a4731] hover:bg-[#15392a] text-white rounded-xl flex items-center justify-center text-lg transition-colors flex-shrink-0 shadow-md shadow-[#1a4731]/30"
                >
                  🔍
                </button>
              </form>

              {/* Filter chips */}
              <div className="flex gap-2 flex-wrap">
                {/* Kategori dropdown */}
                <select
                  value={kategori}
                  onChange={(e) => handleKategori(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:border-[#1a4731] cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>

                {/* Lokasi dropdown */}
                <select
                  value={lokasi}
                  onChange={(e) => handleLokasi(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:border-[#1a4731] cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {lokasiOptions.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>

                {/* Clear filters */}
                {(search ||
                  kategori !== "Semua Kategori" ||
                  lokasi !== "Semua Lokasi") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setSearchInput("");
                      setKategori("Semua Kategori");
                      setLokasi("Semua Lokasi");
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors"
                  >
                    ✕ Reset
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {error ? (
                <div className="py-12 text-center">
                  <p className="text-3xl mb-2">⚠️</p>
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : paginated.length === 0 ? (
                <div className="py-16 text-center px-6">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-semibold text-gray-700">
                    Barang tidak ditemukan
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Coba ubah kata kunci atau filter pencarian
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {paginated.map((item) => {
                    const b = badge[item.isClaimed];
                    const icon = kategoriIcon[item.kategori] ?? "📦";
                    return (
                      <li
                        key={item._id}
                        className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/60 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          {item.photo ? (
                            <img
                              src={item.photo}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              {icon}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            📍 {item.lokasi} · {formatDate(item.tanggal)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                            🏷️ {item.kategori}
                          </p>
                        </div>

                        {/* Badge + klaim button */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${b.cls}`}
                          >
                            {b.label}
                          </span>
                          {!item.isClaimed && (
                            <Link
                              to={`/ajukan-klaim?id=${item._id}`}
                              className="text-xs font-semibold text-[#1a4731] hover:underline"
                            >
                              Klaim →
                            </Link>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a4731] hover:text-[#1a4731] transition-colors"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a4731] hover:text-[#1a4731] transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="flex flex-col gap-4">
            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4">Ringkasan</h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Total Barang",
                    value: items.length,
                    icon: "📦",
                    color: "text-[#1a4731]",
                  },
                  {
                    label: "Tersedia",
                    value: items.filter((i) => !i.isClaimed).length,
                    icon: "✅",
                    color: "text-emerald-600",
                  },
                  {
                    label: "Sudah Diambil",
                    value: items.filter((i) => i.isClaimed).length,
                    icon: "📤",
                    color: "text-gray-500",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <p className="text-sm text-gray-600">{s.label}</p>
                    </div>
                    <p className={`text-lg font-extrabold ${s.color}`}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kategori breakdown */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4">Per Kategori</h3>
              <div className="space-y-2">
                {KATEGORI_OPTIONS.filter((k) => k !== "Semua Kategori").map(
                  (k) => {
                    const count = items.filter((i) => i.kategori === k).length;
                    if (count === 0) return null;
                    return (
                      <button
                        key={k}
                        onClick={() => handleKategori(k)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                          kategori === k
                            ? "bg-[#1a4731] text-white"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{kategoriIcon[k] ?? "📦"}</span>
                          {k}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            kategori === k
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#1a4731] to-[#2d6a4f] rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-[#1a4731]/20">
              <p className="text-2xl mb-2">📋</p>
              <h3 className="font-bold mb-1">Temukan Barang?</h3>
              <p className="text-white/70 text-sm mb-4">
                Bantu sesama dengan melaporkan barang temuan Anda.
              </p>
              <Link
                to="/lapor-barang"
                className="block text-center bg-white text-[#1a4731] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-md"
              >
                + Lapor Sekarang
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
