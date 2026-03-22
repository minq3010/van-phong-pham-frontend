import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  getVouchers,
  getClientCart,
  removeClientCartItem,
  updateClientCartItem,
} from "../../Apis/Api.jsx";
import { formatCurrency } from "../utils/format";
import Breadcrumb from "../components/navigation/Breadcrumb.jsx";

const ClientCart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const { data, isLoading } = useQuery(["client-cart"], getClientCart);
  const { data: voucherResponse } = useQuery(["client-vouchers"], getVouchers);

  const refreshCart = () => {
    queryClient.invalidateQueries(["client-cart"]);
    queryClient.invalidateQueries(["client-cart-count"]);
  };

  const { mutate: updateItem } = useMutation({
    mutationFn: updateClientCartItem,
    onSuccess: refreshCart,
    onError: (error) => {
      message.error(error?.response?.data?.message || "Cập nhật giỏ hàng thất bại");
    },
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: removeClientCartItem,
    onSuccess: () => {
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
      refreshCart();
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Xóa sản phẩm thất bại");
    },
  });

  const cartItems = Array.isArray(data?.data) ? data.data : [];
  const totalPrice = data?.totalPrice || 0;
  const vouchers = Array.isArray(voucherResponse?.data) ? voucherResponse.data : [];

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) {
      return 0;
    }

    const calculatedDiscount = Math.round(
      (Number(totalPrice) * Number(appliedVoucher.discount || 0)) / 100
    );

    return Math.min(calculatedDiscount, Number(appliedVoucher.maxPriceDis || calculatedDiscount));
  }, [appliedVoucher, totalPrice]);

  const finalTotal = Math.max(0, Number(totalPrice) - discountAmount);

  const handleDecrease = (item) => {
    const nextQty = Math.max(1, Number(item.quantity || 1) - 1);
    updateItem({ cartItemId: item._id, quantity: nextQty });
  };

  const handleIncrease = (item) => {
    const nextQty = Number(item.quantity || 0) + 1;
    updateItem({ cartItemId: item._id, quantity: nextQty });
  };

  const handleApplyCoupon = () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      message.error("Vui lòng nhập mã giảm giá");
      return;
    }

    const now = new Date();
    const matchedVoucher = vouchers.find((item) => {
      const validFrom = new Date(item.startDate);
      const validTo = new Date(item.endDate);

      return (
        String(item.code || "").toUpperCase() === normalizedCode &&
        item.isActive &&
        Number(item.quantity || 0) > 0 &&
        validFrom <= now &&
        validTo >= now
      );
    });

    if (!matchedVoucher) {
      message.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      return;
    }

    setAppliedVoucher(matchedVoucher);
    message.success("Áp dụng mã giảm giá thành công");
  };

  if (isLoading) {
    return <div className="py-10 text-center text-blue-600">Đang tải giỏ hàng...</div>;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/client/products" },
          { label: "Giỏ hàng" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="space-y-4 lg:col-span-2">
        <h1 className="text-2xl font-bold text-blue-900">Giỏ hàng</h1>
        {cartItems.length === 0 ? (
          <div className="rounded-lg border border-blue-100 bg-white p-8 text-center text-blue-600">
            Giỏ hàng đang trống. <Link to="/client/products" className="font-semibold text-orange-500">Mua ngay</Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <article key={item._id} className="flex flex-wrap items-center gap-4 rounded-lg border border-blue-100 bg-white p-4">
              <img
                src={item?.product?.imageUrl || "https://placehold.co/120x120?text=Product"}
                alt={item?.product?.name}
                className="h-20 w-20 rounded object-cover"
              />
              <div className="min-w-[220px] flex-1">
                <h2 className="font-semibold text-blue-900">{item?.product?.name || "Sản phẩm"}</h2>
                <p className="text-sm text-blue-600">{formatCurrency(item?.product?.price || 0)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-8 w-8 rounded border"
                  onClick={() => handleDecrease(item)}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  type="button"
                  className="h-8 w-8 rounded border"
                  onClick={() => handleIncrease(item)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-500"
                onClick={() => removeItem(item._id)}
              >
                Xóa
              </button>
            </article>
          ))
        )}
      </section>

      <aside className="h-fit rounded-lg border border-blue-100 bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold text-blue-900">Tóm tắt đơn hàng</h3>
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-blue-700">Mã giảm giá</label>
          <div className="flex items-center gap-2">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="Nhập mã voucher"
              className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            <button
              type="button"
              className="rounded-md border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700"
              onClick={handleApplyCoupon}
            >
              Áp dụng
            </button>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between text-sm text-blue-700">
          <span>Tổng sản phẩm</span>
          <span>{cartItems.length}</span>
        </div>
        <div className="mb-2 flex items-center justify-between text-sm text-blue-700">
          <span>Tạm tính</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="mb-2 flex items-center justify-between text-sm text-blue-700">
          <span>Giảm giá</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
        {appliedVoucher && (
          <div className="mb-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Đã áp dụng mã {appliedVoucher.code}
          </div>
        )}
        <div className="mb-4 flex items-center justify-between border-b border-blue-100 pb-3 text-base font-semibold text-blue-900">
          <span>Tổng tiền</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>

        <button
          type="button"
          disabled={cartItems.length === 0}
          className="w-full rounded-md bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          onClick={() => navigate("/client/checkout", { state: { voucherId: appliedVoucher?._id || null } })}
        >
          Thanh toán
        </button>
      </aside>
      </div>
    </div>
  );
};

export default ClientCart;
