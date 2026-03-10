import { Empty, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { FormatPrice } from "../../../Format";
import {
  useCreateOrderAdmin,
  useOrderFormOptions,
} from "../../../Hook/useOrder";

const createEmptyItem = () => ({
  productId: "",
  color: "",
  quantity: 1,
});

const initialFormState = {
  customerName: "",
  phone: "",
  address: "",
  email: "",
  customerType: "retail",
  note: "",
  payment: "COD",
  voucherId: "",
  invoiceRequested: false,
  invoiceInfo: {
    companyName: "",
    taxCode: "",
    invoiceEmail: "",
    invoiceAddress: "",
    note: "",
  },
  products: [createEmptyItem()],
};

const CreateOrderModal = ({ open, onClose }) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [formData, setFormData] = useState(initialFormState);
  const { products, vouchers, isLoading } = useOrderFormOptions();
  const { mutate, isLoading: isCreating } = useCreateOrderAdmin();

  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
    }
  }, [open]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("admin:create-order-modal-toggle", {
        detail: { open },
      })
    );

    return () => {
      if (open) {
        window.dispatchEvent(
          new CustomEvent("admin:create-order-modal-toggle", {
            detail: { open: false },
          })
        );
      }
    };
  }, [open]);

  const availableProducts = products.filter((item) => item.status === true);
  const availableVouchers = vouchers.filter((item) => item.isActive === true);

  const getProductById = (productId) =>
    availableProducts.find((item) => item._id === productId);

  const getVariantsByProduct = (productId) => {
    const product = getProductById(productId);
    return (product?.variants || []).filter(
      (variant) => variant.status === true && Number(variant.quantity || 0) > 0
    );
  };

  const getLinePricing = (item) => {
    const product = getProductById(item.productId);
    const variant = getVariantsByProduct(item.productId).find(
      (variantItem) => variantItem.color === item.color
    );

    const priceBeforeDis = Number(variant?.price || product?.price || 0);
    const discount = Math.max(0, Number(product?.discount || 0));
    const priceAfterDis = Math.max(
      0,
      Math.round(priceBeforeDis * (1 - discount / 100))
    );

    return {
      product,
      variant,
      priceBeforeDis,
      priceAfterDis,
      lineTotal: priceAfterDis * Number(item.quantity || 0),
    };
  };

  const subtotal = formData.products.reduce((sum, item) => {
    const pricing = getLinePricing(item);
    return sum + pricing.lineTotal;
  }, 0);

  const selectedVoucher = availableVouchers.find(
    (item) => item._id === formData.voucherId
  );
  const validProducts = formData.products.filter(
    (item) => item.productId && item.color && Number(item.quantity) > 0
  );
  const totalQuantity = validProducts.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const voucherDiscount = selectedVoucher
    ? Math.min(
        Math.round((subtotal * Number(selectedVoucher.discount || 0)) / 100),
        Number(selectedVoucher.maxPriceDis || subtotal)
      )
    : 0;

  const grandTotal = Math.max(0, subtotal - voucherDiscount);
  const customerContactSummary = [formData.phone.trim(), formData.email.trim()]
    .filter(Boolean)
    .join(" • ");

  const updateFormField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateInvoiceField = (field, value) => {
    setFormData((current) => ({
      ...current,
      invoiceInfo: {
        ...current.invoiceInfo,
        [field]: value,
      },
    }));
  };

  const handleProductChange = (index, productId) => {
    const variants = getVariantsByProduct(productId);
    setFormData((current) => ({
      ...current,
      products: current.products.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              productId,
              color: variants[0]?.color || "",
              quantity: 1,
            }
          : item
      ),
    }));
  };

  const handleProductItemChange = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      products: current.products.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "quantity" ? Number(value) : value,
            }
          : item
      ),
    }));
  };

  const handleAddProduct = () => {
    setFormData((current) => ({
      ...current,
      products: [...current.products, createEmptyItem()],
    }));
  };

  const handleRemoveProduct = (index) => {
    setFormData((current) => ({
      ...current,
      products:
        current.products.length === 1
          ? [createEmptyItem()]
          : current.products.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      return "Tên khách hàng không được để trống";
    }

    if (!formData.phone.trim()) {
      return "Số điện thoại không được để trống";
    }

    if (!formData.address.trim()) {
      return "Địa chỉ không được để trống";
    }

    if (formData.invoiceRequested) {
      if (!formData.invoiceInfo.companyName.trim()) {
        return "Vui lòng nhập tên công ty để xuất hóa đơn";
      }

      if (!formData.invoiceInfo.taxCode.trim()) {
        return "Vui lòng nhập mã số thuế để xuất hóa đơn";
      }

      if (!formData.invoiceInfo.invoiceAddress.trim()) {
        return "Vui lòng nhập địa chỉ xuất hóa đơn";
      }
    }

    if (validProducts.length === 0) {
      return "Vui lòng chọn ít nhất một sản phẩm";
    }

    for (const item of validProducts) {
      const { product, variant } = getLinePricing(item);
      if (!product || !variant) {
        return "Một trong các sản phẩm chưa có biến thể hợp lệ";
      }

      if (Number(item.quantity) > Number(variant.quantity || 0)) {
        return `Số lượng vượt quá tồn kho của ${product.name} - ${variant.color}`;
      }
    }

    return null;
  };

  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      Modal.error({
        title: "Không thể tạo đơn hàng",
        content: validationError,
      });
      return;
    }

    const payload = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      email: formData.email.trim(),
      customerType: formData.customerType,
      note: formData.note.trim(),
      payment: formData.payment,
      voucherId: formData.voucherId || null,
      status: "Xác nhận",
      handledBy: currentUser?._id || null,
      isPaymentSucces: formData.payment !== "COD",
      invoiceRequested: formData.invoiceRequested,
      invoiceInfo: {
        companyName: formData.invoiceInfo.companyName,
        taxCode: formData.invoiceInfo.taxCode,
        invoiceEmail: formData.invoiceInfo.invoiceEmail,
        invoiceAddress: formData.invoiceInfo.invoiceAddress,
        note: formData.invoiceInfo.note,
      },
      products: formData.products
        .filter((item) => item.productId && item.color && Number(item.quantity) > 0)
        .map((item) => ({
          productId: item.productId,
          color: item.color,
          quantity: Number(item.quantity),
        })),
    };

    mutate(payload, {
      onSuccess: () => {
        setFormData(initialFormState);
        onClose();
      },
    });
  };

  return (
    <Modal
      title="Tạo đơn hàng mới"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      width={980}
      wrapClassName="admin-order-modal"
      okText="Tạo đơn"
      cancelText="Đóng"
      confirmLoading={isCreating}
      style={{ top: 24 }}
      destroyOnClose
    >
      {isLoading ? (
        <Spin className="w-full flex items-center justify-center py-5" />
      ) : availableProducts.length === 0 ? (
        <Empty description="Thiếu dữ liệu sản phẩm để tạo đơn" />
      ) : (
        <div className="admin-order-modal-shell">
          <div className="admin-order-modal-hero">
            <div className="admin-order-modal-hero-card">
              <span>Loại khách</span>
              <strong>{formData.customerType === "wholesale" ? "Khách sỉ" : "Khách lẻ"}</strong>
            </div>
            <div className="admin-order-modal-hero-card">
              <span>Dòng hợp lệ</span>
              <strong>{validProducts.length}</strong>
            </div>
            <div className="admin-order-modal-hero-card">
              <span>Tổng SL</span>
              <strong>{totalQuantity}</strong>
            </div>
            <div className="admin-order-modal-hero-card admin-order-modal-hero-total">
              <span>Tổng thanh toán</span>
              <strong><FormatPrice price={grandTotal} /></strong>
            </div>
          </div>

          <div className="row g-3 admin-order-modal-grid">
            <div className="col-xl-4 col-lg-5">
              <div className="border rounded-3 p-3 bg-light-subtle h-100 admin-order-summary-card admin-order-side-card">
                <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                  <div>
                    <h5 className="mb-1">Thông tin khách hàng</h5>
                    <p className="text-muted mb-0">
                      Giữ gọn các thông tin chính để tạo đơn nhanh hơn.
                    </p>
                  </div>
                  <span className="badge bg-primary-subtle text-primary">
                    {formData.invoiceRequested ? "Có hóa đơn" : "Không hóa đơn"}
                  </span>
                </div>

                <div className="admin-order-customer-glance mb-3">
                  <strong>{formData.customerName.trim() || "Chưa nhập tên khách hàng"}</strong>
                  <span>{customerContactSummary || "Chưa có số điện thoại hoặc email"}</span>
                </div>

                <div className="admin-order-overview mb-3">
                  <div className="admin-order-overview-item">
                    <span>Sản phẩm hợp lệ</span>
                    <strong>{validProducts.length}</strong>
                  </div>
                  <div className="admin-order-overview-item">
                    <span>Tổng SL</span>
                    <strong>{totalQuantity}</strong>
                  </div>
                  <div className="admin-order-overview-item">
                    <span>Voucher</span>
                    <strong>{selectedVoucher ? selectedVoucher.code : "Không"}</strong>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6 col-lg-12">
                    <label className="form-label">Loại khách hàng</label>
                    <select
                      className="form-control"
                      value={formData.customerType}
                      onChange={(event) => updateFormField("customerType", event.target.value)}
                    >
                      <option value="retail">Khách lẻ</option>
                      <option value="wholesale">Khách sỉ / doanh nghiệp</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-lg-12">
                    <label className="form-label">Tên khách hàng</label>
                    <input
                      className="form-control"
                      value={formData.customerName}
                      onChange={(event) => updateFormField("customerName", event.target.value)}
                      placeholder="Nhập tên khách hàng"
                    />
                  </div>

                  <div className="col-md-6 col-lg-12">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      className="form-control"
                      value={formData.phone}
                      onChange={(event) => updateFormField("phone", event.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div className="col-md-6 col-lg-12">
                    <label className="form-label">Email liên hệ</label>
                    <input
                      className="form-control"
                      value={formData.email}
                      onChange={(event) => updateFormField("email", event.target.value)}
                      placeholder="Nhập email liên hệ"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Địa chỉ giao hàng</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={formData.address}
                      onChange={(event) => updateFormField("address", event.target.value)}
                      placeholder="Nhập địa chỉ giao hàng"
                    />
                  </div>

                  <div className="col-md-6 col-lg-12">
                    <label className="form-label">Thanh toán</label>
                    <select
                      className="form-control"
                      value={formData.payment}
                      onChange={(event) => updateFormField("payment", event.target.value)}
                    >
                      <option value="COD">COD</option>
                      <option value="MOMO">MOMO</option>
                      <option value="VNPAY">VNPAY</option>
                      <option value="GG PAY">GG PAY</option>
                      <option value="ZALO PAY">ZALO PAY</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-lg-12">
                    <label className="form-label">Voucher</label>
                    <select
                      className="form-control"
                      value={formData.voucherId}
                      onChange={(event) => updateFormField("voucherId", event.target.value)}
                    >
                      <option value="">Không áp dụng</option>
                      {availableVouchers.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.code} - {item.discount}%
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Ghi chú</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={formData.note}
                      onChange={(event) => updateFormField("note", event.target.value)}
                      placeholder="Ghi chú giao hàng"
                    />
                  </div>
                </div>

                <div className="form-check form-switch mt-4 mb-3 admin-order-invoice-toggle">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="invoiceRequested"
                    checked={formData.invoiceRequested}
                    onChange={(event) => updateFormField("invoiceRequested", event.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="invoiceRequested">
                    Xuất hóa đơn VAT
                  </label>
                </div>

                {formData.invoiceRequested && (
                  <div className="border rounded-3 bg-white p-3 mt-2 admin-order-invoice-card">
                    <h6 className="mb-3">Thông tin hóa đơn</h6>

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Tên công ty / đơn vị</label>
                        <input
                          className="form-control"
                          value={formData.invoiceInfo.companyName}
                          onChange={(event) => updateInvoiceField("companyName", event.target.value)}
                          placeholder="Nhập tên công ty"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Mã số thuế</label>
                        <input
                          className="form-control"
                          value={formData.invoiceInfo.taxCode}
                          onChange={(event) => updateInvoiceField("taxCode", event.target.value)}
                          placeholder="Nhập mã số thuế"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email nhận hóa đơn</label>
                        <input
                          className="form-control"
                          value={formData.invoiceInfo.invoiceEmail}
                          onChange={(event) => updateInvoiceField("invoiceEmail", event.target.value)}
                          placeholder="Nhập email nhận hóa đơn"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Địa chỉ xuất hóa đơn</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          value={formData.invoiceInfo.invoiceAddress}
                          onChange={(event) => updateInvoiceField("invoiceAddress", event.target.value)}
                          placeholder="Nhập địa chỉ công ty / hóa đơn"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Ghi chú hóa đơn</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          value={formData.invoiceInfo.note}
                          onChange={(event) => updateInvoiceField("note", event.target.value)}
                          placeholder="Thông tin thêm cho hóa đơn"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-xl-8 col-lg-7">
              <div className="border rounded-3 p-3 h-100 admin-order-products-card">
                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                  <div>
                    <h5 className="mb-1">Sản phẩm trong đơn</h5>
                    <p className="text-muted mb-0">
                      Khu vực sản phẩm được tối ưu để thấy tồn kho, giá và tổng tiền nhanh hơn.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddProduct}
                  >
                    <i className="ri-add-line me-1" />
                    Thêm sản phẩm
                  </button>
                </div>

                <div className="d-flex flex-column gap-3 admin-order-product-list">
                  {formData.products.map((item, index) => {
                    const pricing = getLinePricing(item);
                    const variants = getVariantsByProduct(item.productId);
                    const availableStock = Number(pricing.variant?.quantity || 0);

                    return (
                      <div
                        key={`${item.productId}-${index}`}
                        className="border rounded-3 p-3 bg-light admin-order-product-item"
                      >
                        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                          <span className="badge bg-secondary-subtle text-secondary">
                            Dòng sản phẩm #{index + 1}
                          </span>
                          <span className={`badge ${availableStock > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                            Tồn kho: {availableStock}
                          </span>
                        </div>

                        <div className="row g-3 align-items-end">
                          <div className="col-lg-5 col-md-12">
                            <label className="form-label">Sản phẩm</label>
                            <select
                              className="form-control"
                              value={item.productId}
                              onChange={(event) => handleProductChange(index, event.target.value)}
                            >
                              <option value="">Chọn sản phẩm</option>
                              {availableProducts.map((product) => (
                                <option key={product._id} value={product._id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-lg-3 col-md-6">
                            <label className="form-label">Biến thể</label>
                            <select
                              className="form-control"
                              value={item.color}
                              onChange={(event) =>
                                handleProductItemChange(index, "color", event.target.value)
                              }
                              disabled={!item.productId}
                            >
                              <option value="">Chọn màu</option>
                              {variants.map((variant) => (
                                <option key={`${variant.color}-${variant.quantity}`} value={variant.color}>
                                  {variant.color} - tồn {variant.quantity}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-lg-2 col-md-3 col-6">
                            <label className="form-label">Số lượng</label>
                            <input
                              type="number"
                              min={1}
                              max={availableStock || undefined}
                              className="form-control"
                              value={item.quantity}
                              onChange={(event) =>
                                handleProductItemChange(index, "quantity", event.target.value)
                              }
                            />
                            <div className="form-text">Tối đa {availableStock || 0}</div>
                          </div>

                          <div className="col-lg-2 col-md-3 col-6 text-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm w-100"
                              onClick={() => handleRemoveProduct(index)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>

                        <div className="row g-2 mt-1 text-sm text-muted admin-order-price-row">
                          <div className="col-md-4">
                            Giá gốc: <strong><FormatPrice price={pricing.priceBeforeDis} /></strong>
                          </div>
                          <div className="col-md-4">
                            Sau giảm SP: <strong><FormatPrice price={pricing.priceAfterDis} /></strong>
                          </div>
                          <div className="col-md-4">
                            Thành tiền: <strong><FormatPrice price={pricing.lineTotal} /></strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-top mt-3 pt-3 admin-order-total-bar">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính</span>
                    <strong><FormatPrice price={subtotal} /></strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Giảm bởi voucher</span>
                    <strong>- <FormatPrice price={voucherDiscount} /></strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2 text-muted">
                    <span>Tổng số lượng</span>
                    <strong>{totalQuantity}</strong>
                  </div>
                  <div className="d-flex justify-content-between fs-5">
                    <span>Tổng thanh toán</span>
                    <strong className="text-primary"><FormatPrice price={grandTotal} /></strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateOrderModal;