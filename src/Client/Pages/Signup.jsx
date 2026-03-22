import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import * as z from "zod";
import { message } from "antd";
import { signup } from "../../Apis/Api.jsx";

const schema = z
  .object({
    username: z.string().min(3, "Tên tối thiểu 3 ký tự"),
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu cần có ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Mật khẩu cần có ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Mật khẩu cần có ít nhất 1 chữ số"),
    confirmPassword: z.string().min(8, "Xác nhận mật khẩu tối thiểu 8 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Xác nhận mật khẩu chưa khớp",
    path: ["confirmPassword"],
  });

const ClientSignup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = useMutation({
    mutationFn: (values) =>
      signup({
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }),
    onSuccess: (response) => {
      message.success(response?.message || "Đăng ký thành công");
      navigate("/signin", { replace: true });
    },
    onError: (error) => {
      const backendError = error?.response?.data;
      const normalizedError =
        (Array.isArray(backendError) && backendError[0]?.message) ||
        backendError?.message ||
        "Đăng ký thất bại";

      message.error(normalizedError);
    },
  });

  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-bold text-slate-800">Đăng ký tài khoản</h1>
      <form className="space-y-4" onSubmit={handleSubmit((values) => mutate(values))}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tên hiển thị</label>
          <input
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-slate-500"
            placeholder="Nguyễn Văn A"
            {...register("username")}
            disabled={isLoading}
          />
          {errors.username?.message && (
            <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-slate-500"
            placeholder="you@example.com"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email?.message && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Mật khẩu</label>
          <input
            type="password"
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-slate-500"
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password?.message && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-slate-500"
            placeholder="••••••••"
            {...register("confirmPassword")}
            disabled={isLoading}
          />
          {errors.confirmPassword?.message && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link className="font-semibold text-slate-900" to="/signin">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default ClientSignup;
