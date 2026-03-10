import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { message } from "antd";
import { forceChangePasswordApi } from "../../Apis/Api";
import { getStoredUser } from "../../utils/auth";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='24' fill='%23dbeafe'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%2360a5fa'/%3E%3Cpath d='M10 40c2.8-7 9-11 14-11s11.2 4 14 11' fill='%2360a5fa'/%3E%3C/svg%3E";

const ForceChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const user = getStoredUser();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => forceChangePasswordApi(user._id, data),
    onSuccess: (res) => {
      // Cập nhật user trong localStorage, xóa flag mustChangePassword
      const updatedUser = { ...user, mustChangePassword: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      message.success("Đổi mật khẩu thành công!");
      navigate("/");
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    },
  });

  const validate = () => {
    const errs = {};
    if (!form.newPassword) errs.newPassword = "Vui lòng nhập mật khẩu mới";
    else if (form.newPassword.length < 8) errs.newPassword = "Mật khẩu tối thiểu 8 ký tự";
    if (!form.confirmPassword) errs.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = "Mật khẩu không khớp";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    mutate({ newPassword: form.newPassword, confirmPassword: form.confirmPassword });
  };

  if (!user?._id) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <i className="ri-lock-password-line text-3xl text-yellow-500" />
          </div>
        </div>

        <h2 className="text-center text-xl font-semibold text-gray-800 mb-1">
          Đổi mật khẩu bắt buộc
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Đây là lần đăng nhập đầu tiên. Vui lòng đặt mật khẩu mới để tiếp tục.
        </p>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
            <img
              src={user.avatar || DEFAULT_AVATAR}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AB39C] ${
                errors.newPassword ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              value={form.newPassword}
              onChange={(e) => {
                setForm({ ...form, newPassword: e.target.value });
                setErrors({ ...errors, newPassword: "" });
              }}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AB39C] ${
                errors.confirmPassword ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Nhập lại mật khẩu mới"
              value={form.confirmPassword}
              onChange={(e) => {
                setForm({ ...form, confirmPassword: e.target.value });
                setErrors({ ...errors, confirmPassword: "" });
              }}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#0AB39C] hover:bg-[#09a08b] text-white rounded-lg font-medium text-sm transition disabled:opacity-60"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForceChangePassword;
