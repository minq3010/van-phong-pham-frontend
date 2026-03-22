import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { message } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearClientCart,
  createClientOrder,
  getClientCart,
  getClientProfile,
} from "../../Apis/Api.jsx";
import { formatCurrency } from "../utils/format";
import Breadcrumb from "../components/navigation/Breadcrumb.jsx";

const ClientCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const voucherId = location.state?.voucherId || null;

  const { data: profile } = useQuery(["client-profile-checkout"], getClientProfile);
  const { data: cartData, isLoading: isCartLoading } = useQuery(["client-cart"], getClientCart);

  const cartItems = Array.isArray(cartData?.data) ? cartData.data : [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      email: "",
      payment: "COD",
      note: "",
    },
  });

  useEffect(() => {
    if (profile) {
      setValue("customerName", profile.username || "");
      setValue("phone", profile.phone || "");
      setValue("address", profile.address || "");
      setValue("email", profile.email || "");
    }
  }, [profile, setValue]);

  const { mutate: submitOrder, isLoading } = useMutation({
    mutationFn: createClientOrder,
    onSuccess: async () => {
      await clearClientCart();
      message.success("Đặt hàng thành công");
      queryClient.invalidateQueries(["client-cart"]);
      queryClient.invalidateQueries(["client-cart-count"]);
      queryClient.invalidateQueries(["client-orders"]);
      navigate("/client/orders", { replace: true });
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Đặt hàng thất bại");
    },
  });

  const totalPrice = cartData?.totalPrice || 0;

  const onSubmit = (values) => {
    if (cartItems.length === 0) {
      message.error("Giỏ hàng trống, không thể thanh toán");
      return;
    }

    const products = cartItems.map((item) => ({
      productId: item?.product?._id,
      quantity: Number(item.quantity || 1),
      color: item?.color || undefined,
    }));

    submitOrder({
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      email: values.email,
      payment: values.payment,
      note: values.note,
      products,
      voucherId,
    });
  };

  if (isCartLoading) {
    return <div className="py-10 text-center text-blue-600">Đang tải dữ liệu thanh toán...</div>;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/client/products" },
          { label: "Giỏ hàng", to: "/client/cart" },
          { label: "Thanh toán" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="rounded-lg border border-blue-100 bg-white p-5 lg:col-span-2">
        <h1 className="mb-5 text-2xl font-bold text-blue-900">Thanh toán</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium">Họ và tên</label>
            <input
              className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
              {...register("customerName", { required: "Vui lòng nhập họ tên" })}
            />
            {errors.customerName?.message && (
              <p className="mt-1 text-xs text-red-500">{errors.customerName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Số điện thoại</label>
              <input
                className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
                {...register("phone", { required: "Vui lòng nhập số điện thoại" })}
              />
              {errors.phone?.message && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
                {...register("email")}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Địa chỉ nhận hàng</label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
              {...register("address", { required: "Vui lòng nhập địa chỉ" })}
            />
            {errors.address?.message && (
              <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phương thức thanh toán</label>
            <select
              className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
              {...register("payment")}
            >
              <option value="COD">COD</option>
              <option value="VNPAY">VNPAY</option>
              <option value="MOMO">MOMO</option>
              <option value="GG PAY">GG PAY</option>
              <option value="ZALO PAY">ZALO PAY</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ghi chú</label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
              {...register("note")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || cartItems.length === 0}
            className="w-full rounded-md bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </form>
      </section>

      <aside className="h-fit rounded-lg border border-blue-100 bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold">Sản phẩm thanh toán</h3>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between gap-3 text-sm">
              <span className="line-clamp-1 flex-1">{item?.product?.name}</span>
              <span>x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t pt-4">
          {voucherId && (
            <p className="mb-2 text-xs text-emerald-600">Đơn hàng sẽ áp dụng mã giảm giá đã chọn ở giỏ hàng.</p>
          )}
          <div className="flex items-center justify-between text-base font-semibold text-blue-900">
            <span>Tổng cộng</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
};

export default ClientCheckout;
