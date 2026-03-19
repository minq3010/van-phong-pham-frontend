import { Alert, Empty, Spin } from "antd";
import React, { useMemo, useState } from "react";
import OrderForm from "./OrderForm";
import { useOrderCustomers } from "../../../Hook/useOrder";

const WholesaleOrder = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
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
            <div className="wholesale-panel-header">
              <div>
                <h5 className="mb-1">Tao don ban si</h5>
                <p className="text-muted mb-0">
                  Tim nhanh va chon khach hang de tu dien thong tin.
                </p>
              </div>
              <span className="wholesale-panel-chip">{filteredCustomers.length} khach</span>
            </div>

            {customers.length === 0 ? (
              <Empty description="Chua co khach hang de tao don ban si" />
            ) : (
              <div className="row g-3 align-items-end mb-4">
                <div className="col-lg-4">
                  <label className="form-label">Tim khach hang</label>
                  <div className="wholesale-search">
                    <i className="ri-search-line" />
                    <input
                      type="text"
                      className="form-control wholesale-search-input"
                      placeholder="Ten, SDT, email..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        className="wholesale-clear-btn"
                        onClick={handleClearSearch}
                      >
                        Xoa
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-lg-5">
                  <label className="form-label">Chon khach hang</label>
                  <select
                    className="form-control"
                    value={selectedCustomerId}
                    onChange={(event) => handleSelectCustomer(event.target.value)}
                  >
                    <option value="">Chon khach hang</option>
                    {filteredCustomers.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.username || item.name || "Khach hang"} - {item.phone || "Chua co SDT"}
                      </option>
                    ))}
                  </select>
                  {filteredCustomers.length === 0 && (
                    <div className="wholesale-empty">Khong tim thay khach hang phu hop.</div>
                  )}
                </div>

                <div className="col-lg-3">
                  <label className="form-label">Thong tin chon</label>
                  <div className="wholesale-compact-summary">
                    <div>
                      <strong>{prefillCustomer?.customerName || "Chua chon"}</strong>
                      <span>{prefillCustomer?.phone || "Chua co SDT"}</span>
                    </div>
                    {selectedCustomer && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleClearCustomer}
                      >
                        Xoa
                      </button>
                    )}
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
              submitLabel="Tao don ban si"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesaleOrder;
