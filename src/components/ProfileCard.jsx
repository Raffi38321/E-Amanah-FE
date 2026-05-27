const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1a4731]/10 overflow-hidden flex-shrink-0">
          {user?.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#1a4731]">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center justify-center gap-2">
            <p className="font-bold text-gray-900 truncate">{user?.name}</p>
            <span className="text-xs bg-[#1a4731]/10 text-[#1a4731] font-semibold px-2 py-0.5 rounded-full">
              {user?.role}
            </span>
          </div>
          {user?.role !== "Admin" && (
            <p className="text-xs font-semibold">NIM: {user?.NIM}</p>
          )}
          <p className="text-xs truncate">{user?.email}</p>
          {user?.role !== "Admin" && (
            <p className="text-xs text-green-500 truncate">{user?.score}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
