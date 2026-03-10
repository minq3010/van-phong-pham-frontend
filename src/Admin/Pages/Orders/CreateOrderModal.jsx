import { Empty, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { FormatPrice } from "../../../Format";
import {
  useCreateOrderAdmin,
  useOrderFormOptions,
} from "../../../Hook/useOrder";

const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAX_CODE_REGEX = /^\d{10}(?:-\d{3})?$/;

const createEmptyItem = () => ({
  productId: "",
  color: "",
  quantity: 1,
});

const createInitialFormState = () => ({
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
});

const createInitialErrors = () => ({
  customerName: "",
  phone: "",
  address: "",
  email: "",
  customerType: "",
  note: "",
  payment: "",
  voucherId: "",
  invoiceInfo: {
    companyName: "",
    taxCode: "",
    invoiceEmail: "",
    invoiceAddress: "",
    note: "",
  },
  products: [],
  productsMessage: "",
});

const joinControlClassName = (baseClassName, errorMessage) =>
  `${baseClassName} ${errorMessage ? "is-invalid" : ""}`.trim();

const hasErrorMessages = (errorState) => {
  if (!errorState) {
    return false;
  }

  return Object.values(errorState).some((value) => {
    if (typeof value === "string") {
      return Boolean(value);
    }

    if (Array.isArray(value)) {
      return value.some((item) => hasErrorMessages(item));
    }

    if (typeof value === "object") {
      return hasErrorMessages(value);
    }

    return false;
  });
};

const CreateOrderModal = ({ open, onClose }) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [formData, setFormData] = useState(createInitialFormState);
  const [errors, setErrors] = useState(createInitialErrors);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { products, vouchers, isLoading } = useOrderFormOptions();
  const { mutate, isLoading: isCreating } = useCreateOrderAdmin();

  useEffect(() => {
    if (!open) {
      setFormData(createInitialFormState());
      setErrors(createInitialErrors());
      setHasSubmitted(false);
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

  const validateForm = (dataToValidate = formData) => {
    const nextErrors = createInitialErrors();
    const trimmedCustomerName = dataToValidate.customerName.trim();
    const trimmedPhone = dataToValidate.phone.trim();
    const trimmedAddress = dataToValidate.address.trim();
    const trimmedEmail = dataToValidate.email.trim();
    const productCombinationSet = new Set();

    if (!trimmedCustomerName) {
      nextErrors.customerName = "Vui lòng nhập tên khách hàng.";
    } else if (trimmedCustomerName.length < 2) {
      nextErrors.customerName = "Tên khách hàng cần tối thiểu 2 ký tự.";
    }

    if (!trimmedPhone) {
      nextErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!PHONE_REGEX.test(trimmedPhone)) {
      nextErrors.phone = "Số điện thoại phải gồm đúng 10 chữ số.";
    }

    if (!trimmedAddress) {
      nextErrors.address = "Vui lòng nhập địa chỉ giao hàng.";
    } else if (trimmedAddress.length < 8) {
      nextErrors.address = "Địa chỉ giao hàng cần chi tiết hơn.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Vui lòng nhập email liên hệ.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Email liên hệ không đúng định dạng.";
    }

    nextErrors.products = dataToValidate.products.map((item) => {
      const lineErrors = {
        productId: "",
        color: "",
        quantity: "",
      };

      if (!item.productId) {
        lineErrors.productId = "Chọn sản phẩm cho dòng này.";
      }

      if (item.productId && !item.color) {
        lineErrors.color = "Chọn biến thể cho sản phẩm.";
      }

      if (!item.quantity || Number(item.quantity) < 1) {
        lineErrors.quantity = "Số lượng phải lớn hơn 0.";
      }

      if (item.productId && item.color) {
        const comboKey = `${item.productId}-${item.color}`;
        if (productCombinationSet.has(comboKey)) {
          lineErrors.color = "Sản phẩm và biến thể này đã được chọn ở dòng khác.";
        } else {
          productCombinationSet.add(comboKey);
        }
      }

      const { product, variant } = getLinePricing(item);

      if (item.productId && !product) {
        lineErrors.productId = "Sản phẩm đã chọn không còn khả dụng.";
      }

      if (item.productId && item.color && !variant) {
        lineErrors.color = "Biến thể đã chọn không còn khả dụng.";
      }

      if (
        item.productId &&
        item.color &&
        variant &&
        Number(item.quantity) > Number(variant.quantity || 0)
      ) {
        lineErrors.quantity = `Tồn kho tối đa ${variant.quantity} sản phẩm.`;
      }

      return lineErrors;
    });

    const hasAtLeastOneCompletedProduct = dataToValidate.products.some(
      (item) => item.productId && item.color && Number(item.quantity) > 0
    );

    if (!hasAtLeastOneCompletedProduct) {
      nextErrors.productsMessage = "Vui lòng chọn ít nhất một sản phẩm hợp lệ.";
    }

    if (dataToValidate.invoiceRequested) {
      const trimmedCompanyName = dataToValidate.invoiceInfo.companyName.trim();
      const trimmedTaxCode = dataToValidate.invoiceInfo.taxCode.trim();
      const trimmedInvoiceEmail = dataToValidate.invoiceInfo.invoiceEmail.trim();
      const trimmedInvoiceAddress = dataToValidate.invoiceInfo.invoiceAddress.trim();

      if (!trimmedCompanyName) {
        nextErrors.invoiceInfo.companyName = "Vui lòng nhập tên công ty / đơn vị.";
      }

      if (!trimmedTaxCode) {
        nextErrors.invoiceInfo.taxCode = "Vui lòng nhập mã số thuế.";
      } else if (!TAX_CODE_REGEX.test(trimmedTaxCode)) {
        nextErrors.invoiceInfo.taxCode = "Mã số thuế gồm 10 số hoặc 10 số-3 số.";
      }

      if (!trimmedInvoiceEmail) {
        nextErrors.invoiceInfo.invoiceEmail = "Vui lòng nhập email nhận hóa đơn.";
      } else if (!EMAIL_REGEX.test(trimmedInvoiceEmail)) {
        nextErrors.invoiceInfo.invoiceEmail = "Email nhận hóa đơn không đúng định dạng.";
      }

      if (!trimmedInvoiceAddress) {
        nextErrors.invoiceInfo.invoiceAddress = "Vui lòng nhập địa chỉ xuất hóa đơn.";
      } else if (trimmedInvoiceAddress.length < 8) {
        nextErrors.invoiceInfo.invoiceAddress = "Địa chỉ xuất hóa đơn cần chi tiết hơn.";
      }
    }

    return nextErrors;
  };

  useEffect(() => {
    if (hasSubmitted) {
      setErrors(validateForm(formData));
    }
  }, [formData, hasSubmitted]);

  const handleSubmit = () => {
    const validationErrors = validateForm(formData);
    setHasSubmitted(true);
    setErrors(validationErrors);

    if (hasErrorMessages(validationErrors)) {
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
        companyName: formData.invoiceInfo.companyName.trim(),
        taxCode: formData.invoiceInfo.taxCode.trim(),
        invoiceEmail: formData.invoiceInfo.invoiceEmail.trim(),
        invoiceAddress: formData.invoiceInfo.invoiceAddress.trim(),
        note: formData.invoiceInfo.note.trim(),
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
        setFormData(createInitialFormState());
        setErrors(createInitialErrors());
        setHasSubmitted(false);
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
                    <strong className="admin-order-overview-value-compact">
                      {selectedVoucher ? selectedVoucher.code : "Không"}
                    </strong>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6 col-lg-12 admin-order-form-group">
                    <label className="form-label admin-order-form-label">Loại khách hàng</label>
                    <select
                      className={joinControlClassName("form-control admin-order-form-control", errors.customerType)}
                      value={formData.customerType}
                      onChange={(event) => updateFormField("customerType", event.target.value)}
                    >
                      <option value="retail">Khách lẻ</option>
                      <option value="wholesale">Khách sỉ / doanh nghiệp</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-lg-12 admin-order-form-group">
                    <label className="form-label admin-order-form-label">Tên khách hàng</label>
                    <input
                      className={joinControlClassName("form-control admin-order-form-control", errors.customerName)}
                      value={formData.customerName}
                      onChange={(event) => updateFormField("customerName", event.target.value)}
                      placeholder="Nhập tên khách hàng"
                    />
                    {errors.customerName && (
                      <div className="invalid-feedback d-block admin-order-error-text">{errors.customerName}</div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-12 admin-order-form-group">
                    <label className="form-label admin-order-form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className={joinControlClassName("form-control admin-order-form-control", errors.phone)}
                      value={formData.phone}
                      onChange={(event) => updateFormField("phone", event.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && (
                      <div className="invalid-feedback d-block admin-order-error-text">{errors.phone}</div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-12 admin-order-form-group">
                    <label className="form-label admin-order-form-label">Email liên hệ</label>
                    <input
                      type="email"
                      className={joinControlClassName("form-control admin-order-form-control", errors.email)}
                      value={formData.email}
                      onChange={(event) => updateFormField("email", event.target.value)}
                      placeholder="Nhập email liên hệ"
                    />
                    {errors.email ? (
                      <div className="invalid-feedback d-block admin-order-error-text">{errors.email}</div>
                    ) : (
                      <div className="form-text admin-order-helper-text">Nhập email để gửi xác nhận và đối soát đơn hàng.</div>
                    )}
                  </div>

                  <div className="col-12 admin-order-form-group">
                    <label className="form-label admin-order-form-label">Địa chỉ giao hàng</label>
                    <textarea
                      className={joinControlClassName("form-control admin-order-form-control admin-order-textarea", errors.address)}
                      rows={2}
                      value={formData.address}
                      onChange={(event) => updateFormField("address", event.target.value)}
                      placeholder="Nhập địa chỉ giao hàng"
                    />
                    {errors.address && (
                      <div className="invalid-feedback d-block admin-order-error-text">{errors.address}</div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-12 admin-order-form-group">
                    <label className="form-label admin-order-form-label">Thanh toán</label>
                    <select
                      className="form-control admin-order-form-control"
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

                  <div className="col-md-6 col-lg-12 admin-order-form-group">
                    <label className="form-label admin-order-form-label">Voucher</label>
                    <select
                      className="form-control admin-order-form-control"
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

                  <div className="col-12 admin-order-form-group">
                    <label className="form-label admin-order-form-label">Ghi chú</label>
                    <textarea
                      className="form-control admin-order-form-control admin-order-textarea"
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
                      <div className="col-12 admin-order-form-group">
                        <label className="form-label admin-order-form-label">Tên công ty / đơn vị</label>
                        <input
                          className={joinControlClassName("form-control admin-order-form-control", errors.invoiceInfo.companyName)}
                          value={formData.invoiceInfo.companyName}
                          onChange={(event) => updateInvoiceField("companyName", event.target.value)}
                          placeholder="Nhập tên công ty"
                        />
                        {errors.invoiceInfo.companyName && (
                          <div className="invalid-feedback d-block admin-order-error-text">{errors.invoiceInfo.companyName}</div>
                        )}
                      </div>

                      <div className="col-md-6 admin-order-form-group">
                        <label className="form-label admin-order-form-label">Mã số thuế</label>
                        <input
                          className={joinControlClassName("form-control admin-order-form-control", errors.invoiceInfo.taxCode)}
                          value={formData.invoiceInfo.taxCode}
                          onChange={(event) => updateInvoiceField("taxCode", event.target.value)}
                          placeholder="Nhập mã số thuế"
                        />
                        {errors.invoiceInfo.taxCode && (
                          <div className="invalid-feedback d-block admin-order-error-text">{errors.invoiceInfo.taxCode}</div>
                        )}
                      </div>

                      <div className="col-md-6 admin-order-form-group">
                        <label className="form-label admin-order-form-label">Email nhận hóa đơn</label>
                        <input
                          type="email"
                          className={joinControlClassName("form-control admin-order-form-control", errors.invoiceInfo.invoiceEmail)}
                          value={formData.invoiceInfo.invoiceEmail}
                          onChange={(event) => updateInvoiceField("invoiceEmail", event.target.value)}
                          placeholder="Nhập email nhận hóa đơn"
                        />
                        {errors.invoiceInfo.invoiceEmail && (
                          <div className="invalid-feedback d-block admin-order-error-text">{errors.invoiceInfo.invoiceEmail}</div>
                        )}
                      </div>

                      <div className="col-12 admin-order-form-group">
                        <label className="form-label admin-order-form-label">Địa chỉ xuất hóa đơn</label>
                        <textarea
                          className={joinControlClassName("form-control admin-order-form-control admin-order-textarea", errors.invoiceInfo.invoiceAddress)}
                          rows={2}
                          value={formData.invoiceInfo.invoiceAddress}
                          onChange={(event) => updateInvoiceField("invoiceAddress", event.target.value)}
                          placeholder="Nhập địa chỉ công ty / hóa đơn"
                        />
                        {errors.invoiceInfo.invoiceAddress && (
                          <div className="invalid-feedback d-block admin-order-error-text">{errors.invoiceInfo.invoiceAddress}</div>
                        )}
                      </div>

                      <div className="col-12 admin-order-form-group">
                        <label className="form-label admin-order-form-label">Ghi chú hóa đơn</label>
                        <textarea
                          className="form-control admin-order-form-control admin-order-textarea"
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
                  {errors.productsMessage && (
                    <div className="alert alert-danger py-2 px-3 mb-0 admin-order-products-alert">
                      {errors.productsMessage}
                    </div>
                  )}

                  {formData.products.map((item, index) => {
                    const pricing = getLinePricing(item);
                    const variants = getVariantsByProduct(item.productId);
                    const availableStock = Number(pricing.variant?.quantity || 0);
                    const lineErrors = errors.products[index] || {};

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

                        <div className="row g-3 align-items-start admin-order-product-grid">
                          <div className="col-lg-5 col-md-12">
                            <label className="form-label admin-order-form-label">Sản phẩm</label>
                            <select
                              className={joinControlClassName("form-control admin-order-form-control", lineErrors.productId)}
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
                            {lineErrors.productId && (
                              <div className="invalid-feedback d-block admin-order-error-text">{lineErrors.productId}</div>
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6">
                            <label className="form-label admin-order-form-label">Biến thể</label>
                            <select
                              className={joinControlClassName("form-control admin-order-form-control", lineErrors.color)}
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
                            {lineErrors.color && (
                              <div className="invalid-feedback d-block admin-order-error-text">{lineErrors.color}</div>
                            )}
                          </div>

                          <div className="col-lg-2 col-md-3 col-6">
                            <label className="form-label admin-order-form-label">Số lượng</label>
                            <input
                              type="number"
                              min={1}
                              max={availableStock || undefined}
                              className={joinControlClassName("form-control admin-order-form-control", lineErrors.quantity)}
                              value={item.quantity}
                              onChange={(event) =>
                                handleProductItemChange(index, "quantity", event.target.value)
                              }
                            />
                            {lineErrors.quantity ? (
                              <div className="invalid-feedback d-block admin-order-error-text">{lineErrors.quantity}</div>
                            ) : (
                              <div className="form-text admin-order-helper-text">Tối đa {availableStock || 0}</div>
                            )}
                          </div>

                          <div className="col-lg-2 col-md-3 col-6 text-end admin-order-product-actions">
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