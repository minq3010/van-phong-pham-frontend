import { Alert, Empty, Modal, Spin, Switch } from "antd";
import React, { useMemo, useState } from "react";
import OrderForm from "./OrderForm";
import { useOrderCustomers } from "../../../Hook/useOrder";

const WholesaleOrder = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [sortByOrders, setSortByOrders] = useState(true);
  const { data, isLoading, isError, error } = useOrderCustomers();

  const customers = useMemo(() => {
    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  }, [data]);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((item) => {
      const name = (item.username || item.name || "").toLowerCase();
      const phone = (item.phone || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      return (
        name.includes(normalizedSearch) ||
        phone.includes(normalizedSearch) ||
        email.includes(normalizedSearch)
      );
    });
  }, [customers, searchTerm]);

  const displayedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers];
    if (sortByOrders) {
      sorted.sort(
        (a, b) => Number(b.orderCount || 0) - Number(a.orderCount || 0)
      );
      return sorted;
    }

    return sorted.sort((a, b) =>
      (a.username || a.name || "").localeCompare(b.username || b.name || "")
    );
  }, [filteredCustomers, sortByOrders]);

  const selectedCustomer = useMemo(
    () => customers.find((item) => item._id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  const prefillCustomer = selectedCustomer
    ? {
        customerName: selectedCustomer.username || selectedCustomer.name || "",
        phone: selectedCustomer.phone || "",
        email: selectedCustomer.email || "",
        address: selectedCustomer.address || "",
      }
    : null;

  const handleClearCustomer = () => {
    setSelectedCustomerId("");
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsCustomerModalOpen(false);
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
            message="Không thể tải danh sách khách hàng"
            description={
              error?.response?.data?.message ||
              error?.message ||
              "Yêu cầu lấy khách hàng thất bại."
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="row wholesale-page">
      <div className="col-12">
        <div className="card wholesale-form-card">
          <div className="card-body">
            <div className="wholesale-panel-header wholesale-panel-header-compact">
              <div>
                <h5 className="mb-1">Tạo đơn bán sỉ</h5>
                <p className="text-muted mb-0">
                  Chọn khách hàng và tạo đơn nhanh theo giá sỉ.
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="wholesale-panel-chip">{customers.length} khách</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setIsCustomerModalOpen(true)}
                >
                  Chọn khách hàng
                </button>
              </div>
            </div>

            {customers.length === 0 ? (
              <Empty description="Chưa có khách hàng để tạo đơn bán sỉ" />
            ) : (
              <div className="row g-3 align-items-center mb-4">
                <div className="col-lg-8">
                  <label className="form-label">Khách hàng</label>
                  <div className="wholesale-compact-summary wholesale-compact-summary-balanced">
                    <div>
                      <strong>{prefillCustomer?.customerName || "Chưa chọn"}</strong>
                      <span>{prefillCustomer?.phone || "Chưa có SĐT"}</span>
                    </div>
                    {selectedCustomer && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleClearCustomer}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  <div className="text-muted small mt-2 wholesale-summary-meta">
                    Ưu tiên khách có nhiều đơn hàng nhất để phục vụ nhanh.
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="border rounded-3 p-3 bg-light h-100 wholesale-status-card">
                    <div className="text-muted small">Trạng thái chọn</div>
                    <div className="fw-semibold">
                      {selectedCustomer ? "Đã chọn" : "Chưa chọn"}
                    </div>
                    <div className="text-muted small">
                      {prefillCustomer?.email || "Chưa có email"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <OrderForm
              defaultCustomerType="wholesale"
              lockCustomerType
              forceCustomerType="wholesale"
              prefillCustomer={prefillCustomer}
              userId={selectedCustomerId || null}
              showSubmit
              submitLabel="Tạo đơn bán sỉ"
            />
          </div>
        </div>
      </div>

      <Modal
        title="Danh sách khách hàng"
        open={isCustomerModalOpen}
        onCancel={() => setIsCustomerModalOpen(false)}
        onOk={() => setIsCustomerModalOpen(false)}
        width={760}
        okText="Đóng"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
          <div className="wholesale-search flex-grow-1">
            <i className="ri-search-line" />
            <input
              type="text"
              className="form-control wholesale-search-input"
              placeholder="Tìm theo tên, SĐT, email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Sắp xếp theo số đơn</span>
            <Switch checked={sortByOrders} onChange={setSortByOrders} />
          </div>
        </div>

        {displayedCustomers.length === 0 ? (
          <Empty description="Không tìm thấy khách hàng phù hợp." />
        ) : (
          <div className="d-flex flex-column gap-2">
            {displayedCustomers.map((item) => (
              <button
                key={item._id}
                type="button"
                className={`border rounded-3 p-3 text-start wholesale-customer-row ${
                  item._id === selectedCustomerId ? "is-active" : ""
                }`}
                onClick={() => handleSelectCustomer(item._id)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">
                      {item.username || item.name || "Khách hàng"}
                    </div>
                    <div className="text-muted small">
                      {item.phone || "Chưa có SĐT"} · {item.email || "Chưa có email"}
                    </div>
                  </div>
                  <span className="badge bg-primary-subtle text-primary">
                    {item.orderCount || 0} đơn
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WholesaleOrder;
