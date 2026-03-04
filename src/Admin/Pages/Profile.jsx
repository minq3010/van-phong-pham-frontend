import { Spin, Tag } from "antd";
import { Link } from "react-router-dom";

const roleConfig = {
  manage: { color: "gold", label: "Manager" },
  admin: { color: "blue", label: "Admin" },
  user: { color: "green", label: "User" },
};

const Profile = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user) {
    return (
      <Spin
        size="large"
        className="h-[50vh] mt-[100px] flex items-center justify-center w-full"
      />
    );
  }

  const role = roleConfig[user.role] || { color: "default", label: user.role };
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="px-4 py-4">
      {/* Header banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#0AB39C] to-[#3762ea] h-32 mb-0" />

      {/* Avatar + Name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 px-4 mb-6">
        <div className="relative">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
          />
          <span
            className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
              user.active ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <div className="flex-1 text-center sm:text-left pb-1">
          <h2 className="text-xl font-semibold text-gray-800">
            {user.username}
          </h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <Tag color={role.color}>{role.label}</Tag>
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
        </div>
        <Link
          to={`/profile`}
          className="px-4 py-2 rounded-md bg-[#0AB39C] hover:bg-[#65d7c8] text-white text-sm flex items-center gap-2 mb-1"
        >
          <i className="ri-edit-box-line" />
          Edit Profile
        </Link>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i className="ri-user-line text-[#0AB39C]" />
            Thông tin cá nhân
          </h5>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Username</span>
              <span className="font-medium text-gray-800">{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-800 truncate max-w-[160px]">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Số điện thoại</span>
              <span className="font-medium text-gray-800">
                {user.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Địa chỉ</span>
              <span className="font-medium text-gray-800 text-right max-w-[160px]">
                {user.address || <span className="text-gray-400 italic">Chưa cập nhật</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i className="ri-shield-user-line text-[#0AB39C]" />
            Tài khoản
          </h5>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <Tag color={role.color}>{role.label}</Tag>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái</span>
              <span
                className={`font-medium ${
                  user.active ? "text-green-600" : "text-gray-400"
                }`}
              >
                {user.active ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tham gia</span>
              <span className="font-medium text-gray-800">{joinedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ID</span>
              <span className="font-mono text-xs text-gray-400 truncate max-w-[120px]">
                {user._id}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center justify-center gap-3">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover shadow"
          />
          <p className="text-sm text-gray-500">Ảnh đại diện</p>
          <p className="text-xs text-gray-400 text-center break-all px-2">
            {user.avatar}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
