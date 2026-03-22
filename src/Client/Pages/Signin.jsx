import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import * as z from "zod";
import { message } from "antd";
import { signin } from "../../Apis/Api.jsx";

const schema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

const ClientSignin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      if (!response?.token || !response?.user) {
        message.error("Phản hồi đăng nhập không hợp lệ");
        return;
      }

      localStorage.setItem("auth_token", JSON.stringify(response.token));
      localStorage.setItem("user", JSON.stringify(response.user));

      if (response.user.role === "admin" || response.user.role === "manage") {
        message.success("Đăng nhập quản trị thành công");
        navigate("/", { replace: true });
        return;
      }

      message.success("Đăng nhập thành công");
      navigate("/client/products", { replace: true });
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại");
    },
  });

  return (
    <div className="mx-auto mt-20 w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-bold text-slate-800">Đăng nhập khách hàng</h1>
      <form className="space-y-4" onSubmit={handleSubmit((values) => mutate(values))}>
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link className="font-semibold text-slate-900" to="/client/signup">
          Đăng ký
        </Link>
      </p>
    </div>
  );
};

export default ClientSignin;
