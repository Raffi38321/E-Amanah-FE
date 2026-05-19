import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo uin.png";
import { register } from "../utils/api";
import Navbar from "../components/Navbar";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    NIM: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (form.NIM) formData.append("NIM", form.NIM);
      if (photo) formData.append("photo", photo);

      const data = await register(formData);
      if (data.status !== "succes") {
        setError(data.message || "Registrasi gagal");
        return;
      }
      navigate("/login");
    } catch {
      setError("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-stretch">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1a4731] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-white/5 rounded-full" />
          <div className="relative z-10 text-center max-w-sm">
            <img
              src={logo}
              alt="Logo UIN"
              className="w-24 h-24 rounded-3xl object-cover mx-auto mb-6 shadow-2xl"
            />
            <h1 className="text-4xl font-extrabold mb-3">E-Amanah</h1>
            <p className="text-white/70 text-base leading-relaxed">
              Bergabunglah dengan komunitas kampus
              <br />
              UIN Siber Syekh Nurjati Cirebon
            </p>
            <div className="mt-8 bg-white/10 rounded-2xl p-5 text-left">
              <p className="text-sm font-semibold mb-3">
                Keuntungan bergabung:
              </p>
              {[
                "Laporkan barang temuan",
                "Klaim barang hilang Anda",
                "Pantau status klaim real-time",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 mb-2">
                  <span className="text-green-300 text-sm">✓</span>
                  <p className="text-sm text-white/80">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <img
                src={logo}
                alt="Logo UIN"
                className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 shadow-md"
              />
              <h1 className="text-2xl font-extrabold text-gray-900">
                E-Amanah
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                UIN Siber Syekh Nurjati Cirebon
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#1a4731] to-[#2d6a4f] px-8 py-6">
                <h2 className="text-white font-bold text-xl">Daftar Akun</h2>
                <p className="text-white/70 text-sm mt-1">
                  Buat akun kampus baru
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="px-8 py-7 flex flex-col gap-4"
              >
                {/* Photo upload */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        👤
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="photo"
                      className="cursor-pointer text-sm font-semibold text-[#1a4731] hover:underline"
                    >
                      {photo ? "Ganti foto" : "Upload foto profil"}
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Opsional · JPG, PNG
                    </p>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhoto}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Nama lengkap Anda"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="contoh@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="NIM"
                      className="text-sm font-semibold text-gray-700"
                    >
                      NIM{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        (opsional)
                      </span>
                    </label>
                    <input
                      id="NIM"
                      type="number"
                      name="NIM"
                      placeholder="12345678"
                      value={form.NIM}
                      onChange={handleChange}
                      autoComplete="off"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPass ? "text" : "password"}
                      name="password"
                      placeholder="Minimal 6 karakter"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                    >
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
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
                  className="w-full py-3.5 bg-[#1a4731] hover:bg-[#15392a] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#1a4731]/30 mt-1"
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
                      Memproses...
                    </span>
                  ) : (
                    "Daftar Sekarang →"
                  )}
                </button>
              </form>

              <div className="px-8 pb-7 text-center">
                <p className="text-sm text-gray-500">
                  Sudah punya akun?{" "}
                  <Link
                    to="/login"
                    className="text-[#1a4731] font-bold hover:underline"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
