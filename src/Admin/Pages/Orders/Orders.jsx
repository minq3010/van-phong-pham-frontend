import { Alert, Empty, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormatDate, FormatDateTime, FormatPrice } from "../../../Format";
import CreateOrderModal from "./CreateOrderModal";
import { useOrder } from "../../../Hook/useOrder";

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") || "";
  const paymentParam = searchParams.get("payment") || "";
  const sourceParam = searchParams.get("source") || "";

  // input trên form (hiển thị)
  const [search, setSearch] = useState(searchParam);
  const [statusOrder, setstatusOrder] = useState(statusParam);
  const [paymen, setPaymen] = useState(paymentParam);
  const [sourceOrder, setSourceOrder] = useState(sourceParam);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  // gọi API với param từ URL
  const { data, isLoading, isError, error } = useOrder( {
    search: searchParam,
    statusOrder: statusParam,
    payment: paymentParam,
    sourceOrder: sourceParam,
  });

  // đồng bộ lại state input khi URL thay đổi (ví dụ đổi page, back/forward)
  useEffect(() => {
    setSearch(searchParam);
    setstatusOrder(statusParam);
    setPaymen(paymentParam);
    setSourceOrder(sourceParam);
  }, [searchParam, statusParam, paymentParam, sourceParam]);


  const getOrderStatusColor = (status) => {
    const statusMapping = {
      "Xác nhận": "#FFC107",
      "Đang giao hàng": "#2196F3",
      "Thành Công": "#2E7D32",
      Hủy: "#F44336",
    };

    return statusMapping[status] || "#9E9E9E";
  };

  const getOrderSourceMeta = (order) => {
    const source =
      order?.orderSource ||
      (order?.handledBy
        ? "manual_entry"
        : order?.userId
          ? "customer_self_service"
          : "manual_entry");

    return source === "manual_entry"
      ? {
          label: "Đơn tạo",
          className: "bg-info-subtle text-info",
        }
      : {
          label: "Khách tự mua",
          className: "bg-success-subtle text-success",
        };
  };

  const handleFilter = () => {
    const params = new URLSearchParams(location.search);
    const normalizedSearch = search.trim();

    params.set("page", "1");

    if (normalizedSearch) params.set("search", normalizedSearch);
    else params.delete("search");

    if (statusOrder) params.set("status", statusOrder);
    else params.delete("status");

    if (paymen) params.set("payment", paymen);
    else params.delete("payment");

    if (sourceOrder) params.set("source", sourceOrder);
    else params.delete("source");

    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleResetFilter = () => {
    setSearch("");
    setstatusOrder("");
    setPaymen("");
    setSourceOrder("");
    navigate(location.pathname);
  };

  if (isLoading) {
    return (
      <Spin
        size="large"
        className="h-[50vh] mt-[100px] flex items-center justify-center w-full "
      />
    );
  }

  if (isError) {
    return (
      <div className="row">
        <div className="col-lg-12">
          <Alert
            type="error"
            showIcon
            message="Không thể tải danh sách đơn hàng"
            description={error?.response?.data?.message || error?.message || "Yêu cầu lấy đơn hàng thất bại."}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card" id="orderList">
          <div className="card-body border border-dashed border-end-0 border-start-0">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h5 className="mb-1">Quản lý đơn hàng</h5>
                <p className="text-muted mb-0">
                  Theo dõi đơn hiện có và tạo nhanh đơn hàng cho khách ngay tại đây.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsCreateOrderOpen(true)}
              >
                <i className="ri-add-line align-bottom me-1" />
                Tạo đơn hàng
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleFilter();
              }}
            >
              <div className="row g-3">
                <div className="col-12 col-xxl-4 col-lg-3 col-md-6">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control "
                      value={search}
                      placeholder="Tìm theo mã đơn, khách hàng, SĐT, email..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="ri-search-line search-icon" />
                  </div>
                </div>

                <div className="col-12 col-xxl-2 col-lg-2 col-md-6">
                  <div>
                    <select
                      className="form-control"
                      id="idStatus"
                      value={statusOrder}
                      onChange={(e) => setstatusOrder(e.target.value)}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="Xác nhận">Xác nhận</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Thành Công">Thành công</option>
                      <option value="Hủy">Hủy</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-xxl-2 col-lg-2 col-md-6">
                  <div>
                    <select
                      className="form-control"
                      id="idPayment"
                      value={paymen}
                      onChange={(e) => setPaymen(e.target.value)}
                    >
                      <option value="">Tất cả thanh toán</option>
                      <option value="COD">COD</option>
                      <option value="MOMO">MOMO</option>
                      <option value="VNPAY">VNPAY</option>
                      <option value="GG PAY">GG PAY</option>
                      <option value="ZALO PAY">ZALO PAY</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-xxl-2 col-lg-2 col-md-6">
                  <div>
                    <select
                      className="form-control"
                      id="idSource"
                      value={sourceOrder}
                      onChange={(e) => setSourceOrder(e.target.value)}
                    >
                      <option value="">Tất cả nguồn đơn</option>
                      <option value="customer_self_service">Khách tự mua</option>
                      <option value="manual_entry">Đơn tạo</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-xxl-2 col-lg-3 col-md-12">
                  <div className="admin-order-filter-actions">
                    <button
                      type="submit"
                      className="admin-order-filter-btn admin-order-filter-btn-primary"
                    >
                      <i className="ri-equalizer-fill me-2 align-bottom"></i>
                      Lọc
                    </button>
                    <button
                      type="button"
                      onClick={handleResetFilter}
                      className="admin-order-filter-btn admin-order-filter-btn-secondary"
                    >
                      Đặt lại
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {data?.data?.length > 0 ? (
            <div className="card-body pt-0">
              <div>
                <div className="table-responsive table-card mb-1 mt-3">
                  <table
                    className="table table-nowrap align-middle"
                    id="orderTable"
                  >
                    <thead className="text-muted table-light">
                      <tr className="text-uppercase">
                        <th scope="col" style={{ width: 25 }}>
                          <div className="form-check">#</div>
                        </th>
                        <th data-sort="id">Mã đh</th>
                        <th data-sort="customer_name">Tên người mua</th>
                        <th data-sort="source">Nguồn đơn</th>
                        <th data-sort="date">Thời gian mua</th>
                        <th data-sort="amount">Tổng tiền</th>
                        <th data-sort="payment">Phương thức thanh toán</th>
                        <th data-sort="payment">Trạng thái thanh toán</th>
                        <th data-sort="status">Trạng thái đơn hàng</th>
                        <th data-sort="city"></th>
                      </tr>
                    </thead>
                    <tbody className="list form-check-all">
                      {data.data.map((order, index) => (
                        <tr key={order._id}>
                          {(() => {
                            const orderSource = getOrderSourceMeta(order);
                            const orderDisplayDate =
                              order?.orderDate || order?.createdAt || null;

                            return (
                              <>
                          <th scope="row">
                            <div className="form-check">{index + 1}</div>
                          </th>
                          <td className="id">
                            <a
                              href="apps-ecommerce-order-details.html"
                              className="fw-medium link-primary"
                            >
                              {order.madh}
                            </a>
                          </td>
                          <td className="customer_name">
                            {order.customerName}
                          </td>
                          <td>
                            <span className={`badge ${orderSource.className}`}>
                              {orderSource.label}
                            </span>
                          </td>

                          <td className="date">
                            <FormatDate date={orderDisplayDate} />
                            <small className="text-muted">
                              <FormatDateTime dateString={orderDisplayDate} />
                            </small>
                          </td>
                          <td className="amount">
                            <FormatPrice price={order.totalPrice} />
                          </td>
                          <td className="payment">{order.payment}</td>
                          <td className="payment">
                            {order.payment!=="COD"
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </td>
                          <td className="status">
                            <span
                              className="badge uppercase px-2 py-1 rounded"
                              style={{
                                backgroundColor: getOrderStatusColor(
                                  order.status
                                ),
                              }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <ul className="list-inline hstack gap-2 mb-0">
                              <li className="list-inline-item" title="View">
                                <Link
                                  to={`/order_detail/${order._id}`}
                                  className="text-primary d-inline-block"
                                >
                                  <i className="ri-eye-fill fs-16" />
                                </Link>
                              </li>
                            </ul>
                          </td>
                              </>
                            );
                          })()}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <Empty />
          )}

          <CreateOrderModal
            open={isCreateOrderOpen}
            onClose={() => setIsCreateOrderOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
