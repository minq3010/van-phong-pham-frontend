import { Empty, Pagination, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormatDate, FormatDateTime, FormatPrice } from "../../../Format";
import { useOrder } from "../../../Hook/useOrder";

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") || "";
  const paymentParam = searchParams.get("payment") || "";

  // input trên form (hiển thị)
  const [search, setSearch] = useState(searchParam);
  const [statusOrder, setstatusOrder] = useState(statusParam);
  const [paymen, setPaymen] = useState(paymentParam);

  // gọi API với param từ URL
  const { data, isLoading } = useOrder( {
    search: searchParam,
    statusOrder: statusParam,
    payment: paymentParam,
  });

  // đồng bộ lại state input khi URL thay đổi (ví dụ đổi page, back/forward)
  useEffect(() => {
    setSearch(searchParam);
    setstatusOrder(statusParam);
    setPaymen(paymentParam);
  }, [searchParam, statusParam, paymentParam]);


  const getOrderStatusColor = (status) => {
    const statusMapping = {
      "Xác nhận": "#FFC107",
      "Đang giao hàng": "#2196F3",
      "Thành công": "#2E7D32",
      Hủy: "#F44336",
    };

    return statusMapping[status] || "#9E9E9E";
  };

  const handleFilter = () => {
    const params = new URLSearchParams(location.search);

    // luôn reset về page 1 khi lọc
    params.set("page", "1");

    if (search) params.set("search", search);
    else params.delete("search");

    if (statusOrder) params.set("status", statusOrder);
    else params.delete("status");

    if (paymen) params.set("payment", paymen);
    else params.delete("payment");

    navigate(`${location.pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <Spin
        size="large"
        className="h-[50vh] mt-[100px] flex items-center justify-center w-full "
      />
    );
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card" id="orderList">
          <div className="card-body border border-dashed border-end-0 border-start-0">
            <form>
              <div className="row g-3">
                <div className="col-xxl-5 col-sm-5">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control "
                      defaultValue={searchParam}
                      placeholder="Search for order ID, customer, order status or something..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="ri-search-line search-icon" />
                  </div>
                </div>

                <div className="col-xxl-3 col-sm-2">
                  <div>
                    <select
                      className="form-control"
                      name="choices-single-default"
                      id="idStatus"
                      value={statusOrder}
                      onChange={(e) => setstatusOrder(e.target.value)}
                    >
                      <option value="">Trạng thái đơn hàng</option>
                      <option value="">All</option>
                      <option value="Xác nhận">Xác nhận</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Thành Công">Thành công</option>
                      <option value="Hủy">Hủy</option>
                    </select>
                  </div>
                </div>

                <div className="col-xxl-3 col-sm-2">
                  <div>
                    <select
                      className="form-control"
                      id="idPayment"
                      value={paymen}
                      onChange={(e) => setPaymen(e.target.value)}
                    >
                      <option value="">Select Payment</option>
                      <option value="">All</option>
                      <option value="COD">COD</option>
                      <option value="MOMO">MOMO</option>
                    </select>
                  </div>
                </div>

                <div className="col-sm-1">
                  <button
                    type="button"
                    onClick={handleFilter}
                    className="py-2 bg-[#5671cc] text-white rounded-md btn-primary w-100"
                  >
                    <i className="ri-equalizer-fill me-2 align-bottom"></i>
                    Filters
                  </button>
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

                          <td className="date">
                            <FormatDate date={order.createdAt} />
                            <small className="text-muted">
                              <FormatDateTime dateString={order.createdAt} />
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
        </div>
      </div>
    </div>
  );
};

export default Orders;
