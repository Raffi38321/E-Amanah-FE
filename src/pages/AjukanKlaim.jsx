import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMe, getLaporanById, createKlaim } from "../utils/api";

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
    month: "long",
    year: "numeric",
  });
}

export default function AjukanKlaim() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idLaporan = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [laporan, setLaporan] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState("");

  const [deskripsi, setDeskripsi] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/login");
    if (!idLaporan) {
      setPageError("ID laporan tidak ditemukan. Pilih barang dari daftar.");
      setLoadingPage(false);
      return;
    }

    Promise.all([getMe(), getLaporanById(idLaporan)])
      .then(([meRes, laporRes]) => {
        if (meRes.status !== "succes") return navigate("/login");
        setUser(meRes.data.employee);
        if (laporRes.status !== "succes") {
          setPageError("Laporan barang tidak ditemukan.");
          return;
        }
        const item = laporRes.data.laporan;
        if (item.isClaimed) {
          setPageError("Barang ini sudah diklaim oleh orang lain.");
          return;
        }
        setLaporan(item);
      })
      .catch(() => setPageError("Gagal memuat data laporan."))
      .finally(() => setLoadingPage(false));
  }, [navigate, idLaporan]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deskripsi.trim()) {
      setSubmitError("Deskripsi tidak boleh kosong.");
      return;
    }
    setSubmitLoading(true);
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("idLaporan", idLaporan);
      formData.append("deskripsiBarang", deskripsi);
      if (photo) formData.append("photo", photo);

      const data = await createKlaim(formData);
      if (data.status !== "succes") {
        setSubmitError(data.message || "Gagal mengajukan klaim.");
        return;
      }
      setSuccess(true);
    } catch {
      setSubmitError("Tidak bisa terhubung ke server.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Loading ──
  if (loadingPage) {
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
            <p className="text-gray-500 text-sm">Memuat data barang...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Page error (no id / already claimed / not found) ──
  if (pageError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} showLogout />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
              ⚠️
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              Tidak Dapat Mengajukan Klaim
            </h2>
            <p className="text-gray-500 text-sm mb-8">{pageError}</p>
            <Link
              to="/daftar-barang"
              className="inline-block bg-[#1a4731] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#15392a] transition-colors shadow-lg shadow-[#1a4731]/30"
            >
              ← Lihat Daftar Barang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} showLogout />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
              ✅
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Klaim Terkirim!
            </h2>
            <p className="text-gray-500 text-sm mb-2">
              Pengajuan klaim untuk{" "}
              <span className="font-semibold text-gray-800">
                {laporan?.name}
              </span>{" "}
              berhasil dikirim.
            </p>
            <p className="text-gray-400 text-xs mb-8">
              Admin akan memverifikasi klaim Anda. Pantau statusnya di
              dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/daftar-barang"
                className="flex-1 py-3 border-2 border-[#1a4731] text-[#1a4731] font-bold rounded-xl text-sm hover:bg-[#1a4731]/5 transition-colors text-center"
              >
                Lihat Barang Lain
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 py-3 bg-[#1a4731] text-white font-bold rounded-xl text-sm hover:bg-[#15392a] transition-colors shadow-lg shadow-[#1a4731]/30 text-center"
              >
                Ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const icon = kategoriIcon[laporan?.kategori] ?? "📦";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} showLogout />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 flex flex-col gap-6">
          {/* ── LEFT: Form ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
            >
              ← Kembali
            </button>

            {/* Page title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Ajukan Klaim Barang
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Buktikan kepemilikan barang dengan mengisi form di bawah
              </p>
            </div>

            {/* Barang yang diklaim — info card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Barang yang Diklaim
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 overflow-hidden flex-shrink-0 shadow-sm">
                  {laporan?.photo ? (
                    <img
                      src={laporan.photo}
                      alt={laporan.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {icon}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-gray-900 text-lg truncate">
                    {laporan?.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    📍 {laporan?.lokasi}
                  </p>
                  <p className="text-sm text-gray-500">
                    📅 Ditemukan {formatDate(laporan?.tanggal)}
                  </p>
                </div>
                <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex-shrink-0">
                  Tersedia
                </span>
              </div>
              {laporan?.deskripsiBarang && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 mb-1">
                    Deskripsi dari pelapor
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {laporan.deskripsiBarang}
                  </p>
                </div>
              )}
            </div>

            {/* Form klaim */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#1a4731] to-[#2d6a4f] px-6 sm:px-8 py-5">
                <h2 className="text-white font-bold text-lg">
                  Form Pengajuan Klaim
                </h2>
                <p className="text-white/70 text-sm mt-0.5">
                  Jelaskan mengapa barang ini milik Anda
                </p>
              </div>

              <div className="px-6 sm:px-8 py-7 flex flex-col gap-6">
                {/* Deskripsi */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="deskripsi"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Deskripsi Kepemilikan{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    placeholder="Jelaskan secara detail mengapa barang ini milik Anda. Contoh: ciri khusus, isi dompet, data di HP, nomor seri, dll."
                    value={deskripsi}
                    onChange={(e) => {
                      setDeskripsi(e.target.value);
                      setSubmitError("");
                    }}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white resize-none"
                  />
                  <p className="text-xs text-gray-400">
                    Semakin detail deskripsi Anda, semakin besar peluang klaim
                    disetujui
                  </p>
                </div>

                {/* Foto bukti */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Foto Bukti Kepemilikan{" "}
                    <span className="text-gray-400 font-normal">
                      (opsional)
                    </span>
                  </label>

                  {photoPreview ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                      <img
                        src={photoPreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#1a4731] hover:bg-[#1a4731]/5 transition-colors bg-gray-50"
                    >
                      <span className="text-4xl mb-2">📎</span>
                      <p className="text-sm font-semibold text-gray-600">
                        Upload foto bukti
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Struk pembelian, foto lama, KTM, dll · JPG, PNG
                      </p>
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhoto}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Error */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-sm">⚠️</span>
                    <p className="text-red-600 text-sm font-medium">
                      {submitError}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-4 bg-[#1a4731] hover:bg-[#15392a] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#1a4731]/30"
                >
                  {submitLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
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
                      Mengirim Klaim...
                    </span>
                  ) : (
                    "📋 Kirim Pengajuan Klaim"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="flex flex-col gap-4">
            {/* Panduan */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#1a4731]/10 rounded-lg flex items-center justify-center text-sm">
                  💡
                </span>
                Panduan Klaim
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    icon: "📝",
                    text: "Jelaskan ciri khusus barang yang hanya Anda ketahui",
                  },
                  {
                    icon: "📷",
                    text: "Upload foto bukti seperti struk, foto lama, atau KTM",
                  },
                  {
                    icon: "⏳",
                    text: "Admin akan memverifikasi klaim dalam 1×24 jam",
                  },
                  {
                    icon: "✅",
                    text: "Jika disetujui, hubungi admin untuk pengambilan",
                  },
                  {
                    icon: "❌",
                    text: "Klaim palsu dapat dikenakan sanksi akademik",
                  },
                ].map((tip) => (
                  <li key={tip.text} className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {tip.icon}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tip.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Alur proses */}
            <div className="bg-gradient-to-br from-[#1a4731] to-[#2d6a4f] rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-[#1a4731]/20">
              <h3 className="font-bold mb-4">Alur Proses Klaim</h3>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Anda mengisi form klaim", active: true },
                  { step: "2", label: "Admin memverifikasi data" },
                  { step: "3", label: "Notifikasi hasil verifikasi" },
                  { step: "4", label: "Pengambilan barang" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        s.active ? "bg-white text-[#1a4731]" : "bg-white/20"
                      }`}
                    >
                      {s.step}
                    </div>
                    <p
                      className={`text-sm ${s.active ? "font-semibold" : "text-white/70"}`}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status klaim saya */}
            <Link
              to="/dashboard"
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                📋
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Lihat Status Klaim
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pantau semua klaim Anda di dashboard
                </p>
              </div>
              <span className="ml-auto text-gray-300 group-hover:text-[#1a4731] transition-colors text-lg">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
