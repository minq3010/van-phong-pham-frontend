import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getClientOrders } from "../../Apis/Api.jsx";
import { formatCurrency, formatDateTime } from "../utils/format";
import Breadcrumb from "../components/navigation/Breadcrumb.jsx";

const statusStyles = {
  "Xác nhận": "bg-amber-100 text-amber-700",
  "Đang giao hàng": "bg-blue-100 text-blue-700",
  "Thành Công": "bg-emerald-100 text-emerald-700",
  "Hủy": "bg-red-100 text-red-700",
};

const ClientOrdersHistory = () => {
  const { data, isLoading } = useQuery(["client-orders"], getClientOrders);
  const orders = Array.isArray(data) ? data : [];

  if (isLoading) {
    return <div className="py-10 text-center text-slate-500">Đang tải lịch sử mua hàng...</div>;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/client/products" },
          { label: "Lịch sử đơn hàng" },
        ]}
      />

      <h1 className="mb-5 text-2xl font-bold text-slate-800">Lịch sử mua hàng</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-slate-500">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-slate-800">Đơn #{order.madh}</h2>
                  <p className="text-sm text-slate-500">{formatDateTime(order.createdAt)}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || "bg-slate-100 text-slate-700"}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 border-t pt-3">
                {Array.isArray(order.products) &&
                  order.products.map((item, index) => (
                    <div key={`${order._id}-${index}`} className="flex items-center justify-between text-sm">
                      <span className="line-clamp-1 flex-1">{item.name}</span>
                      <span className="ml-3">x{item.quantity}</span>
                    </div>
                  ))}
              </div>

              <div className="mt-3 border-t pt-3 text-right text-base font-semibold text-slate-900">
                Tổng tiền: {formatCurrency(order.totalPrice)}
              </div>

              <div className="mt-3 text-right">
                <Link to={`/client/orders/${order._id}`} className="text-sm font-semibold text-slate-700 underline">
                  Xem chi tiết đơn hàng
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientOrdersHistory;
