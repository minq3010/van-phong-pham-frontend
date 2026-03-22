import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { message } from "antd";
import { Link } from "react-router-dom";
import { getClientProfile, updateClientProfile } from "../../Apis/Api.jsx";
import Breadcrumb from "../components/navigation/Breadcrumb.jsx";

const ClientProfile = () => {
  const { data: profile, isLoading } = useQuery(["client-profile"], getClientProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      address: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile, reset]);

  const { mutate, isLoading: isSaving } = useMutation({
    mutationFn: updateClientProfile,
    onSuccess: (_, payload) => {
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify({ ...currentUser, ...payload }));
      }
      message.success("Cập nhật hồ sơ thành công");
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Cập nhật hồ sơ thất bại");
    },
  });

  if (isLoading) {
    return <div className="py-10 text-center text-blue-600">Đang tải hồ sơ...</div>;
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Home", to: "/client/products" },
          { label: "Tài khoản" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h1 className="mb-5 text-2xl font-bold text-blue-900">Hồ sơ cá nhân</h1>

          <form className="space-y-4" onSubmit={handleSubmit((values) => mutate(values))}>
            <div>
              <label className="mb-1 block text-sm font-medium">Tên hiển thị</label>
              <input
                className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
                {...register("username", { required: "Vui lòng nhập tên" })}
              />
              {errors.username?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                className="w-full rounded-md border border-blue-100 bg-blue-50 px-3 py-2"
                {...register("email")}
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Số điện thoại</label>
                <input
                  className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
                  {...register("phone")}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Avatar URL</label>
                <input
                  className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
                  {...register("avatar")}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Địa chỉ mặc định</label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
                {...register("address")}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-md bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {isSaving ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </form>
        </article>

        <aside className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-base font-semibold text-blue-900">Quản lý địa chỉ</h2>
            <p className="mb-3 text-sm text-blue-700">
              Hiện tại hệ thống đang dùng 1 địa chỉ mặc định. Bạn có thể cập nhật ngay trong hồ sơ.
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-base font-semibold text-blue-900">Wishlist</h2>
            <p className="mb-3 text-sm text-blue-700">
              Xem nhanh danh sách sản phẩm yêu thích của bạn.
            </p>
            <Link
              to="/client/wishlist"
              className="inline-flex rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Mở Wishlist
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ClientProfile;
