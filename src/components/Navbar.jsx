import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineArchiveBox,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

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
            {!showLogout ? null : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 mr-2">
                  <Link
                    to={user.role === "Admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg hover:bg-white/10 transition-colors opacity-80 hover:opacity-100"
                  >
                    <HiOutlineHome className="w-4 h-4" />
                    Beranda
                  </Link>
                  <Link
                    to="/daftar-barang"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg hover:bg-white/10 transition-colors opacity-80 hover:opacity-100"
                  >
                    <HiOutlineArchiveBox className="w-4 h-4" />
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
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
                >
                  <HiArrowRightOnRectangle className="w-4 h-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
