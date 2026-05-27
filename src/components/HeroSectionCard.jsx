import {
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const HeroSectionCard = ({ user }) => {
  return (
    <div className="bg-gradient-to-br from-[#1a4731] to-[#2d6a4f] rounded-3xl px-6 py-7 sm:px-8 sm:py-8 text-white relative overflow-hidden shadow-xl shadow-[#1a4731]/20">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10">
        {user?.role == "Admin" ? (
          <>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
              Admin Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1">
              Admin Dashboard
            </h1>
            <p className="text-white/70 text-sm">
              Panel Pengelola E-Amanah · {user?.name}
            </p>
          </>
        ) : (
          <>
            <p className="text-white/70 text-sm mb-2">
              Selamat datang kembali 👋
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
              Halo, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-white/70 text-sm max-w-sm">
              Kehilangan barang di kampus? Laporkan atau temukan barang melalui
              E-Amanah.
            </p>
            <div className="flex gap-3 mt-5 flex-wrap">
              <Link
                to="/lapor-barang"
                className="flex items-center gap-2 bg-white text-[#1a4731] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-md"
              >
                <HiOutlineClipboardDocumentList className="w-4 h-4" /> Lapor
                Temuan
              </Link>
              <Link
                to="/daftar-barang"
                className="flex items-center gap-2 bg-white/15 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/25 active:scale-95 transition-all border border-white/20"
              >
                <HiOutlineMagnifyingGlass className="w-4 h-4" /> Cari Barang
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroSectionCard;
