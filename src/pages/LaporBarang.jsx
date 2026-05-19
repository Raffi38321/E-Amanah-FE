import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createLaporan } from "../utils/api";

const KATEGORI = [
  "Elektronik",
  "Dokumen",
  "Pakaian",
  "Aksesoris",
  "Kendaraan",
  "Alat Tulis",
  "Tas & Dompet",
  "Lainnya",
];

export default function LaporBarang() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    kategori: "",
    lokasi: "",
    tanggal: "",
    deskripsiBarang: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("kategori", form.kategori);
      formData.append("lokasi", form.lokasi);
      formData.append("tanggal", form.tanggal);
      formData.append("deskripsiBarang", form.deskripsiBarang);
      if (photo) formData.append("photo", photo);

      const data = await createLaporan(formData);
      if (data.status !== "succes") {
        setError(data.message || "Gagal membuat laporan");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white";

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar showLogout />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
              ✅
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Laporan Terkirim!
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Terima kasih sudah melaporkan barang temuan. Tim kami akan segera
              memproses laporan Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({
                    name: "",
                    kategori: "",
                    lokasi: "",
                    tanggal: "",
                    deskripsiBarang: "",
                  });
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
                className="flex-1 py-3 border-2 border-[#1a4731] text-[#1a4731] font-bold rounded-xl text-sm hover:bg-[#1a4731]/5 transition-colors"
              >
                Lapor Lagi
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 bg-[#1a4731] text-white font-bold rounded-xl text-sm hover:bg-[#15392a] transition-colors shadow-lg shadow-[#1a4731]/30"
              >
                Ke Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar showLogout />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 flex flex-col gap-6">
          {/* ── LEFT: Form ── */}
          <div className="lg:col-span-2">
            {/* Page header */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
              >
                ← Kembali ke Dashboard
              </button>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Lapor Barang Temuan
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Isi detail barang yang Anda temukan di kampus
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#1a4731] to-[#2d6a4f] px-6 sm:px-8 py-5">
                <h2 className="text-white font-bold text-lg">Detail Barang</h2>
                <p className="text-white/70 text-sm mt-0.5">
                  Lengkapi semua informasi yang diperlukan
                </p>
              </div>

              <div className="px-6 sm:px-8 py-7 flex flex-col gap-5">
                {/* Nama barang */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Nama Barang <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Contoh: Kunci Motor Honda"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>

                {/* Kategori + Tanggal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="kategori"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Kategori <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="kategori"
                      name="kategori"
                      value={form.kategori}
                      onChange={handleChange}
                      required
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="" disabled>
                        Pilih kategori
                      </option>
                      {KATEGORI.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="tanggal"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Tanggal Ditemukan <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="tanggal"
                      type="date"
                      name="tanggal"
                      value={form.tanggal}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split("T")[0]}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Lokasi */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="lokasi"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Lokasi Ditemukan <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="lokasi"
                    type="text"
                    name="lokasi"
                    placeholder="Contoh: Parkiran Gedung FITK Lt. 1"
                    value={form.lokasi}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>

                {/* Deskripsi */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="deskripsiBarang"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Deskripsi Barang <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="deskripsiBarang"
                    name="deskripsiBarang"
                    placeholder="Deskripsikan barang secara detail: warna, merek, kondisi, ciri khusus, dll."
                    value={form.deskripsiBarang}
                    onChange={handleChange}
                    required
                    rows={4}
                    className={`${inputCls} resize-none`}
                  />
                  <p className="text-xs text-gray-400">
                    Semakin detail, semakin mudah pemilik mengenali barangnya
                  </p>
                </div>

                {/* Foto */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Foto Barang{" "}
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
                        onClick={handleRemovePhoto}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#1a4731] hover:bg-[#1a4731]/5 transition-colors bg-gray-50"
                    >
                      <span className="text-4xl mb-2">📷</span>
                      <p className="text-sm font-semibold text-gray-600">
                        Klik untuk upload foto
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WEBP · Maks 5MB
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

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-sm">⚠️</span>
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#1a4731] hover:bg-[#15392a] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#1a4731]/30"
                >
                  {loading ? (
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
                      Mengirim Laporan...
                    </span>
                  ) : (
                    "📋 Kirim Laporan"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── RIGHT: Tips ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#1a4731]/10 rounded-lg flex items-center justify-center text-sm">
                  💡
                </span>
                Tips Pelaporan
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    icon: "📝",
                    text: "Tulis nama barang sejelas mungkin agar mudah dicari",
                  },
                  {
                    icon: "📍",
                    text: "Cantumkan lokasi spesifik tempat barang ditemukan",
                  },
                  {
                    icon: "📅",
                    text: "Pastikan tanggal sesuai dengan waktu penemuan",
                  },
                  {
                    icon: "📷",
                    text: "Upload foto untuk mempercepat proses klaim",
                  },
                  {
                    icon: "🔍",
                    text: "Deskripsikan ciri khusus seperti warna, merek, atau kondisi",
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

            <div className="bg-gradient-to-br from-[#1a4731] to-[#2d6a4f] rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-[#1a4731]/20">
              <h3 className="font-bold mb-2">Proses Setelah Laporan</h3>
              <div className="space-y-3 mt-4">
                {[
                  { step: "1", label: "Laporan diterima sistem" },
                  { step: "2", label: "Admin memverifikasi laporan" },
                  { step: "3", label: "Pemilik mengajukan klaim" },
                  { step: "4", label: "Barang dikembalikan" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {s.step}
                    </div>
                    <p className="text-sm text-white/80">{s.label}</p>
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
