import { Alert, Modal, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FormatPrice } from "../Format";
import { useDeleteProduct } from "../Hook/useProduct.jsx";
import useDashboard from "../Hook/useDashboard";
import { NumberOrder } from "./Char";

const PRODUCT_FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Cpath d='M38 102l24-28 18 22 12-14 20 20H38z' fill='%2394a3b8'/%3E%3Ccircle cx='56' cy='52' r='10' fill='%2394a3b8'/%3E%3Ctext x='75' y='128' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' fill='%23475569'%3ENo Image%3C/text%3E%3C/svg%3E";

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

const Dashboards = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const startdate = searchParams.get("startdate") || null;
  const enddate = searchParams.get("enddate") || null;
  const { data, isLoading, isError, error } = useDashboard({ startdate, enddate });
  const { mutate: deleteProduct } = useDeleteProduct();

  const [startDateValue, setstartDateValue] = useState(
    searchParams.get("startdate") || ""
  );
  const [endDateValue, setendDateValue] = useState(
    searchParams.get("enddate") || ""
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    setstartDateValue(searchParams.get("startdate") || "");
    setendDateValue(searchParams.get("enddate") || "");
  }, [searchParams]);

  const applyDateFilter = () => {
    if (startDateValue && endDateValue && startDateValue > endDateValue) {
      message.warning("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    const updatedParams = new URLSearchParams(searchParams.toString());

    if (startDateValue) {
      updatedParams.set("startdate", startDateValue);
    } else {
      updatedParams.delete("startdate");
    }

    if (endDateValue) {
      updatedParams.set("enddate", endDateValue);
    } else {
      updatedParams.delete("enddate");
    }

    setSearchParams(updatedParams);
  };

  const resetDateFilter = () => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.delete("startdate");
    updatedParams.delete("enddate");
    setstartDateValue("");
    setendDateValue("");
    setSearchParams(updatedParams);
  };

  const dataUser = getStoredUser();

  const openDeleteModal = (productId) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProductId("");
  };

  const handleDeleteProduct = () => {
    if (!selectedProductId) {
      closeDeleteModal();
      return;
    }

    deleteProduct(selectedProductId);
    closeDeleteModal();
  };

  if (isLoading) {
    return (
      <Spin
        size="large"
        className="h-[50vh] mt-[100px] flex items-center justify-center w-full"
      />
    );
  }

  if (isError) {
    return (
      <div className="py-4">
        <Alert
          type="error"
          showIcon
          message="Không thể tải dữ liệu thống kê"
          description={
            error?.response?.data?.message ||
            error?.message ||
            "Trang thống kê gặp lỗi khi lấy dữ liệu từ máy chủ."
          }
        />
      </div>
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
      is_available: Boolean(product.isProductAvailable && product.productId),
      product_name: product.name || "Sản phẩm không xác định",
      product_image: product.image || PRODUCT_FALLBACK_IMAGE,
      variant_name: product.variant || "Mặc định",
      price: Number(product.price || 0),
      color: product.color,
      total_orders: product.qty,
      quantity: product.stock || 0,
      total_amount: Number(product.totalAmount || 0),
      last_order_date: product.lastOrderDate
        ? new Date(product.lastOrderDate).toLocaleDateString("vi-VN")
        : new Date().toLocaleDateString("vi-VN"),
    })),

    // Recent orders mapping
    recentOrders: (data?.recentOrders || []).map((order) => ({
      id: order._id,
      order_code: `#${order.madh}`,
      user: order.customerName,
      items: (Array.isArray(order.products) ? order.products : []).map((p) => ({
        product_name: p.productId?.name || "N/A",
        color: p.color || "N/A",
      })),
      total_amount: order.totalPrice,
      status: order.status,
    })),
  };

  return (
    <div className="">
      <div className="row mb-3 pb-1">
        <div className="col-12">
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-16 mb-1">
                Xin chào, {dataUser?.username || "quản trị viên"}!
              </h4>
              <p className="text-muted mb-0">
                Đây là những gì đang diễn ra với cửa hàng của bạn ngày hôm nay
              </p>
            </div>
            <div className="mt-3 mt-lg-0">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  applyDateFilter();
                }}
              >
                <div className="dashboard-filter-panel d-flex flex-wrap align-items-end gap-2">
                  <div className="dashboard-filter-field">
                    <label className="dashboard-filter-label">Từ ngày</label>
                    <div className="input-group input-group-sm">
                      <input
                        type="date"
                        className="form-control dash-filter-picker shadow-none"
                        onChange={(e) => setstartDateValue(e.target.value)}
                        value={startDateValue}
                      />
                      <span className="input-group-text bg-light text-muted">
                        <i className="ri-calendar-2-line" />
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-filter-field">
                    <label className="dashboard-filter-label">Đến ngày</label>
                    <div className="input-group input-group-sm">
                      <input
                        type="date"
                        className="form-control dash-filter-picker shadow-none"
                        onChange={(e) => setendDateValue(e.target.value)}
                        value={endDateValue}
                      />
                      <span className="input-group-text bg-light text-muted">
                        <i className="ri-calendar-2-line" />
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-filter-field">
                    <label className="dashboard-filter-label d-block" style={{ visibility: "hidden" }}>Action</label>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-sm btn-primary">
                        Lọc
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={resetDateFilter}
                      >
                        Bỏ lọc
                      </button>
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
                  <thead className="text-muted table-light">
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng tiền</th>
                      <th className="text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappedData.topSellingProducts.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm  bg-light rounded p-1 me-2">
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="img-fluid d-block max-h-14"
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
                                }}
                              />
                            </div>
                            <div>
                              <h5 className="fs-14 my-1">
                                {item?.is_available ? (
                                  <Link
                                    to={`/product_detail/${item.id}`}
                                    className="text-reset"
                                  >
                                    {item?.product_name?.length > 20
                                      ? item?.product_name?.slice(0, 20) + "..."
                                      : item?.product_name}
                                  </Link>
                                ) : (
                                  <span className="text-muted">
                                    {item?.product_name?.length > 20
                                      ? item?.product_name?.slice(0, 20) + "..."
                                      : item?.product_name}
                                  </span>
                                )}
                              </h5>
                              {!item?.is_available && (
                                <div className="text-muted small">
                                  Sản phẩm gốc không còn tồn tại
                                </div>
                              )}
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
                        <td className="text-end">
                          {item?.is_available ? (
                            <div className="d-inline-flex align-items-center gap-2">
                              <Link
                                to={`/product_detail/${item.id}`}
                                className="text-primary d-inline-block"
                                title="Xem"
                              >
                                <i className="ri-eye-fill fs-16" />
                              </Link>
                              <Link
                                to={`/uppdateproduct/${item.id}`}
                                className="text-info d-inline-block"
                                title="Sửa"
                              >
                                <i className="ri-pencil-fill fs-16" />
                              </Link>
                              {dataUser?.role === "manage" && (
                                <button
                                  type="button"
                                  className="btn btn-link text-danger p-0 d-inline-flex align-items-center"
                                  title="Xóa"
                                  onClick={() => openDeleteModal(item.id)}
                                >
                                  <i className="ri-delete-bin-5-fill fs-16" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted small">Không khả dụng</span>
                          )}
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

      <Modal
        open={isDeleteModalOpen}
        onOk={handleDeleteProduct}
        onCancel={closeDeleteModal}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        title="Xóa sản phẩm"
      >
        <p className="mb-0">Bạn có chắc muốn xóa sản phẩm này không?</p>
      </Modal>
    </div>
  );
};

export default Dashboards;
