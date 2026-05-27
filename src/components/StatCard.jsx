function StatCard({ value, label, color = "text-[#1a4731]", icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-1 hover:shadow-md transition-shadow">
      <div className={`${color} mb-0.5`}>{icon}</div>
      <p className={`text-2xl sm:text-3xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 font-medium text-center leading-tight">
        {label}
      </p>
    </div>
  );
}

export default StatCard;
