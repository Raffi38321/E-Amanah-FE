import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, showLogout = false }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-[#1a4731] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight">
              E-Amanah
            </span>

            {user?.role === "Admin" && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            )}
          </Link>

          <nav className="flex items-center gap-1">
            {!showLogout ? (
              <></>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-4 mr-2">
                  {user.role === "Admin" ? (
                    <Link
                      to="/admin"
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      Beranda
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      Beranda
                    </Link>
                  )}

                  <Link
                    to="/daftar-barang"
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Barang
                  </Link>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>

                  <span className="text-sm font-medium">{user?.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
                >
                  Keluar
                </button>
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
