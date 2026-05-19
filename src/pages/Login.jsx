import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo uin.png";
import { login, getMe } from "../utils/api";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(form.email, form.password);
      if (data.status !== "succes") {
        setError(data.message || "Login gagal");
        return;
      }
      localStorage.setItem("token", data.data.token);
      const me = await getMe();
      navigate(me.data?.employee?.role === "Admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Desktop: split layout | Mobile: centered card */}
      <div className="flex-1 flex items-stretch">
        {/* Left panel — hidden on mobile */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1a4731] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-white/5 rounded-full" />

          <div className="relative z-10 text-center max-w-sm">
            <img
              src={logo}
              alt="Logo UIN"
              className="w-24 h-24 rounded-3xl object-cover mx-auto mb-6 shadow-2xl"
            />
            <h1 className="text-4xl font-extrabold mb-3 leading-tight">
              E-Amanah
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Sistem Barang Hilang &amp; Temuan Kampus
              <br />
              UIN Siber Syekh Nurjati Cirebon
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                ["🔍", "Temukan"],
                ["📋", "Laporkan"],
                ["✅", "Klaim"],
              ].map(([icon, label]) => (
                <div key={label} className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl mb-1">{icon}</div>
                  <p className="text-xs font-medium text-white/80">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile branding */}
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
                <h2 className="text-white font-bold text-xl">Masuk Akun</h2>
                <p className="text-white/70 text-sm mt-1">
                  Gunakan akun kampus Anda
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="px-8 py-7 flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Email / NIM
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
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
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
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#1a4731] transition-colors bg-gray-50 focus:bg-white pr-12"
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
                    <span className="text-red-500 text-sm">⚠️</span>
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
                    "Masuk ke Dashboard →"
                  )}
                </button>
              </form>

              <div className="px-8 pb-7 text-center">
                <p className="text-sm text-gray-500">
                  Belum punya akun?{" "}
                  <Link
                    to="/register"
                    className="text-[#1a4731] font-bold hover:underline"
                  >
                    Daftar di sini
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
