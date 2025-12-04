import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

export default function AboutUser() {
  const { userData } = useContext(userDataContext);

  const user = {
    name: userData?.name || "Loading...",
    email: userData?.email || "Loading...",
    phone: userData?.phone || "Not provided",
    address: userData?.address || "Not provided",
    profilePic: userData?.profilePic?.trim()
      ? userData.profilePic
      : `https://ui-avatars.com/api/?name=${userData?.name || "User"}`,
    joined: userData?.createdAt
      ? new Date(userData.createdAt).toLocaleDateString()
      : "--",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl p-8">

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-white text-center mb-8 tracking-wider">
          User Profile
        </h2>

        {/* Avatar + Basic Info */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={user.profilePic}
              alt="User Avatar"
              className="w-36 h-36 rounded-full object-cover border-4 border-white/30 shadow-xl"
            />
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
          </div>

          <h3 className="text-3xl font-semibold text-white">
            {user.name}
          </h3>
          <p className="text-gray-300 text-sm">Joined on {user.joined}</p>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/20"></div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Email */}
          <div className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-md hover:shadow-lg transition">
            <p className="text-gray-300 text-sm mb-1">Email</p>
            <p className="text-white font-medium break-all">{user.email}</p>
          </div>

          {/* Phone */}
          <div className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-md hover:shadow-lg transition">
            <p className="text-gray-300 text-sm mb-1">Phone</p>
            <p className="text-white font-medium">{user.phone}</p>
          </div>

          {/* Address (Full Width) */}
          <div className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-md hover:shadow-lg transition sm:col-span-2">
            <p className="text-gray-300 text-sm mb-1">Address</p>
            <p className="text-white font-medium">{user.address}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
