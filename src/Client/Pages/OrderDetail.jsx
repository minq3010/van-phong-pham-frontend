import { useMemo } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getClientOrders } from "../../Apis/Api.jsx";
import Breadcrumb from "../components/navigation/Breadcrumb.jsx";
import { formatCurrency, formatDateTime } from "../utils/format";

const ClientOrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery(["client-orders"], getClientOrders);

  const order = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    return rows.find((item) => item._id === id);
  }, [data, id]);

  if (isLoading) {
    return <div className="py-10 text-center text-slate-500">Đang tải chi tiết đơn hàng...</div>;
  }

  if (!order) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-slate-500">
        Không tìm thấy đơn hàng.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Home", to: "/client/products" },
          { label: "Đơn hàng", to: "/client/orders" },
          { label: `#${order.madh}` },
        ]}
      />

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Chi tiết đơn hàng #{order.madh}</h1>
            <p className="text-sm text-slate-500">{formatDateTime(order.createdAt)}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-2 font-semibold text-slate-900">Sản phẩm</h2>
            <div className="space-y-2">
              {Array.isArray(order.products) &&
                order.products.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-slate-500">Màu: {item.color}</p>
                    </div>
                    <div className="text-right">
                      <p>x{item.quantity}</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(item.priceAfterDis)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-semibold text-slate-900">Thông tin nhận hàng</h2>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>Người nhận: {order.customerName}</li>
              <li>SĐT: {order.phone}</li>
              <li>Địa chỉ: {order.address}</li>
              <li>Thanh toán: {order.payment}</li>
            </ul>

            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
              <div className="mb-1 flex justify-between">
                <span>Tổng đơn hàng</span>
                <span className="font-semibold">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Link to="/client/orders" className="text-sm font-semibold text-slate-700 underline">
            Quay lại lịch sử đơn hàng
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ClientOrderDetail;
