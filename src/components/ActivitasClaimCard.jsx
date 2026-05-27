import {
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineXCircle,
} from "react-icons/hi2";

const statusLabel = {
  Pending: "Menunggu",
  Success: "Disetujui",
  Rejected: "Ditolak",
};

const statusStyle = {
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Rejected: "bg-red-100 text-red-600 border border-red-200",
};

const StatusIcon = ({ status, cls = "w-4 h-4" }) => {
  if (status === "Success") return <HiOutlineCheckCircle className={cls} />;
  if (status === "Rejected") return <HiOutlineXCircle className={cls} />;
  return <HiOutlineClock className={cls} />;
};

const ActivitasClaimCard = ({ klaims, formatDate }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">Aktivitas Klaim Saya</h2>
      </div>
      {klaims.length === 0 ? (
        <div className="py-10 text-center px-4">
          <HiOutlineClipboardDocumentList className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Belum ada aktivitas klaim</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {klaims.map((k) => (
            <li
              key={k._id}
              className="flex items-start gap-3 px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                        ${k.status === "Success" ? "bg-emerald-100 text-emerald-600" : k.status === "Rejected" ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-600"}`}
              >
                <StatusIcon status={k.status} cls="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {k.idLaporan?.name ?? "Barang"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(k.createdAt)}
                </p>
                <span
                  className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[k.status]}`}
                >
                  {statusLabel[k.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivitasClaimCard;
