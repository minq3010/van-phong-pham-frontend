import { Spin } from "antd";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FormatPrice } from "../Format";
import useDashboard from "../Hook/useDashboard";
import { NumberOrder } from "./Char";

const Dashboards = () => {
  const [searchParams] = useSearchParams();

  const startdate = searchParams.get("startdate") || null;

  let enddateRaw = searchParams.get("enddate");

  if (!enddateRaw) {
    const now = new Date();
    now.setHours(now.getHours() + 7);
    enddateRaw = now.toISOString().split("T")[0];
  } else {
    const temp = new Date(enddateRaw);
    temp.setHours(temp.getHours() + 7);
    enddateRaw = temp.toISOString().split("T")[0];
  }

  const enddate = enddateRaw;
  const { data, isLoading } = useDashboard({ startdate, enddate });

  const [startDateValue, setstartDateValue] = useState();
  const [endDateValue, setendDateValue] = useState();

  const makeLink = (key, value) => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.set(key, value);
    return `/?${updatedParams.toString()}`;
  };

  const dataString = localStorage.getItem("user");
  const dataUser = JSON.parse(dataString);

  if (isLoading) {
    return (
      <Spin
        size="large"
        className="h-[50vh] mt-[100px] flex items-center justify-center w-full"
      />
    );
  }

  // Map dữ liệu mới từ API sang format cũ
  const mappedData = {
    // Totals mapping
    totalRevenue: data?.totals?.totalEarnings || 0,
    ordersCount: data?.totals?.totalOrdersAll || 0,
    usersCount: data?.totals?.totalCustomersAll || 0,
    productCount: data?.totals?.totalProduct || 0,

    // Charts mapping
    chart: {
      orderNumber: data?.charts?.orderNumber || [],
      revenue: data?.charts?.revenueChart || [],
    },

    // Top products mapping
    topSellingProducts: (data?.topProducts || []).map((product) => ({
      id: product.productId,
      product_name: product.name,
      product_image: product.image || "https://via.placeholder.com/150",
      variant_name: product.variant || "Mặc định",
      price: product.price,
      color: product.color,
      total_orders: product.qty,
      quantity: product.stock || 0,
      total_amount: product.price * product.qty,
      last_order_date: product.lastOrderDate
        ? new Date(product.lastOrderDate).toLocaleDateString("vi-VN")
        : new Date().toLocaleDateString("vi-VN"),
    })),

    // Recent orders mapping
    recentOrders: (data?.recentOrders || []).map((order) => ({
      id: order._id,
      order_code: `#${order.madh}`,
      user: order.customerName,
      items: order.products.map((p) => ({
        product_name: p.productId?.name || "N/A",
        color: p.color || "N/A",
      })),
      total_amount: order.totalPrice,
      status: order.status,
    })),
  };
console.log(mappedData);
  return (
    <div className="">
      <div className="row mb-3 pb-1">
        <div className="col-12">
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-16 mb-1">Xin chào, {dataUser.username}!</h4>
              <p className="text-muted mb-0">
                Đây là những gì đang diễn ra với cửa hàng của bạn ngày hôm nay
              </p>
            </div>
            <div className="mt-3 mt-lg-0">
              <form>
                <div className="row g-3 mb-0 align-items-center">
                  <div className="col-sm-auto flex gap-3">
                    <label htmlFor="">Ngày bắt đầu</label>
                    <div className="input-group ">
                      <input
                        type="date"
                        className="form-control border-0 dash-filter-picker shadow"
                        onChange={(e) => setstartDateValue(e.target.value)}
                        value={startDateValue}
                      />
                      <Link
                        to={
                          startDateValue !== undefined
                            ? makeLink("startdate", startDateValue)
                            : null
                        }
                        className="input-group-text bg-primary border-primary text-white"
                      >
                        <i className="ri-calendar-2-line" />
                      </Link>
                    </div>

                    <label htmlFor="">Ngày kết thúc</label>
                    <div className="input-group">
                      <input
                        type="date"
                        className="form-control border-0 dash-filter-picker shadow"
                        onChange={(e) => setendDateValue(e.target.value)}
                        value={endDateValue}
                      />
                      <Link
                        to={
                          endDateValue !== undefined
                            ? makeLink("enddate", endDateValue)
                            : null
                        }
                        className="input-group-text bg-primary border-primary text-white"
                      >
                        <i className="ri-calendar-2-line" />
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Tổng doanh thu
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value" data-target="559.25">
                      <FormatPrice price={mappedData.totalRevenue} />
                    </span>
                  </h4>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-success-subtle rounded fs-3">
                    <i className="bx bx-dollar-circle text-success" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Tổng số đơn hàng
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value">
                      {mappedData.ordersCount}
                    </span>
                  </h4>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-info-subtle rounded fs-3">
                    <i className="bx bx-shopping-bag text-info" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Tổng người dùng
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value" data-target="183.35">
                      {mappedData.usersCount}
                    </span>
                  </h4>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-warning-subtle rounded fs-3">
                    <i className="bx bx-user-circle text-warning" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Tổng số sản phẩm
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value">
                      {mappedData.productCount}
                    </span>
                  </h4>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-primary-subtle rounded fs-3">
                    <img
                      src="https://media-public.canva.com/FlQVA/MAFTeAFlQVA/1/tl.png"
                      className="bx bx-wallet text-primary"
                      width={30}
                      alt=""
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card p-2">
            <div className="card-header border-0 align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Số lượng đơn hàng</h4>
            </div>
            <NumberOrder chart={mappedData.chart} />
          </div>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-xl-12">
          <div className="card p-2">
            <div className="card-header border-0 align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">
                Tổng số đơn hàng thành công
              </h4>
            </div>
            <TotalOrder chart={mappedData.chart} />
          </div>
        </div>
      </div> */}

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">
                Sản phẩm bán chạy nhất
              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive table-card">
                <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                  <tbody>
                    {mappedData.topSellingProducts.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm  bg-light rounded p-1 me-2">
                              <img
                                src={item.product_image}
                                alt=""
                                className="img-fluid d-block max-h-14"
                              />
                            </div>
                            <div>
                              <h5 className="fs-14 my-1">
                                <Link
                                  to={`product_detail/${item.id}`}
                                  className="text-reset"
                                >
                                  {item?.product_name?.length > 20
                                    ? item?.product_name?.slice(0, 20) + "..."
                                    : item?.product_name}
                                </Link>
                              </h5>
                              <div>{item.color}</div>
                              <span className="text-muted">
                                {item.last_order_date}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <h5 className="fs-14 my-1 fw-normal">
                            <FormatPrice price={item.price} />
                          </h5>
                          <span className="text-muted">Giá</span>
                        </td>
                        <td>
                          <h5 className="fs-14 my-1 fw-normal">
                            {item.total_orders}
                          </h5>
                          <span className="text-muted">Số lượng </span>
                        </td>
                        <td>
                          <h5 className="fs-14 my-1 fw-normal">
                            <FormatPrice price={item.total_amount} />
                          </h5>
                          <span className="text-muted">Tổng tiền</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Đơn hàng gần đây</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive table-card">
                <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                  <thead className="text-muted table-light">
                    <tr>
                      <th scope="col">Mã đơn hàng</th>
                      <th scope="col">Người mua</th>
                      <th scope="col">Sản phẩm</th>
                      <th scope="col">Màu sắc</th>
                      <th scope="col">Giá tiền</th>
                      <th scope="col">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappedData.recentOrders.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Link
                            to={`order_detail/${item.id}`}
                            className="fw-medium link-primary"
                          >
                            {item.order_code}
                          </Link>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1">{item.user}</div>
                          </div>
                        </td>
                        <td>
                          <span>
                            {item.items[0]?.product_name?.length > 20
                              ? `${item.items[0].product_name.slice(0, 20)}...`
                              : item.items[0]?.product_name}
                          </span>
                        </td>
                        <td>
                          <span>
                            {item.items[0]?.color?.length > 20
                              ? `${item.items[0].color.slice(0, 20)}...`
                              : item.items[0]?.color}
                          </span>
                        </td>
                        <td>
                          <span className="text-red-500">
                            <FormatPrice price={item.total_amount} />
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboards;
