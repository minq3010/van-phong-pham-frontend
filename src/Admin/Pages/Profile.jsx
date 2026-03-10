import { useEffect, useState } from "react";
import { Spin, Tag, message } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { updateUsers } from "../../Apis/Api";

const roleConfig = {
  manage: { color: "gold", label: "Manager" },
  admin: { color: "blue", label: "Admin" },
  user: { color: "green", label: "User" },
};

const Profile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [formValues, setFormValues] = useState({
    username: "",
    phone: "",
    address: "",
    avatar: "",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormValues({
      username: user.username || "",
      phone: user.phone || "",
      address: user.address || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
    mutationFn: (payload) => updateUsers(user._id, payload),
    onSuccess: (_response, payload) => {
      const nextUser = {
        ...user,
        ...payload,
      };

      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      message.success("Cập nhật hồ sơ thành công");
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Không thể cập nhật hồ sơ"
      );
    },
  });

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormValues({
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
      });
    }

    setIsEditing((current) => !current);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    updateProfile({
      username: formValues.username.trim(),
      phone: formValues.phone.trim(),
      address: formValues.address.trim(),
      avatar: formValues.avatar.trim(),
    });
  };

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
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-[#0AB39C] hover:bg-[#65d7c8] text-white text-sm flex items-center gap-2 mb-1"
          onClick={handleEditToggle}
        >
          <i className="ri-edit-box-line" />
          {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i className="ri-edit-2-line text-[#0AB39C]" />
            Cập nhật thông tin cá nhân
          </h5>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <input
                type="text"
                name="username"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#0AB39C]"
                value={formValues.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#0AB39C]"
                value={formValues.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Địa chỉ</label>
              <input
                type="text"
                name="address"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#0AB39C]"
                value={formValues.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Link ảnh đại diện</label>
              <input
                type="url"
                name="avatar"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-[#0AB39C]"
                value={formValues.avatar}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={handleEditToggle}
                disabled={isUpdating}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#0AB39C] hover:bg-[#65d7c8] text-white disabled:opacity-60"
                disabled={isUpdating}
              >
                {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      )}

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
