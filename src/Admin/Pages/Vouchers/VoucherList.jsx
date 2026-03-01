import { Button, Modal, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormatDate, FormatPrice } from "../../../Format";
import {
  useAddVoucher,
  useDeleteVoucher,
  useUpdateVoucher,
  useVouchers,
} from "../../../Hook/useVoucher";

const VoucherList = () => {
  const { vouchers, isLoading } = useVouchers();
  const { mutate: addVoucher } = useAddVoucher();
  const { mutate: deleteVoucher } = useDeleteVoucher();
  const { mutate: updateVoucher } = useUpdateVoucher();

  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [voucherToUpdate, setVoucherToUpdate] = useState(null);
  const [voucherToDetail, setVoucherToDetail] = useState(null);
  const [isDetail, setIsDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Reset form khi mở modal update
  useEffect(() => {
    if (voucherToUpdate) {
      reset({
        code: voucherToUpdate.code,
        discount: voucherToUpdate.discount,
        startDate: voucherToUpdate.startDate
          ? new Date(voucherToUpdate.startDate).toISOString().split("T")[0]
          : "",
        endDate: voucherToUpdate.endDate
          ? new Date(voucherToUpdate.endDate).toISOString().split("T")[0]
          : "",
        quantity: voucherToUpdate.quantity,
        isActive: voucherToUpdate.isActive,
        maxPriceDis: voucherToUpdate.maxPriceDis,
        description: voucherToUpdate.description,
      });
    }
  }, [voucherToUpdate, reset]);

  // Reset form khi đóng modal add
  useEffect(() => {
    if (!isModalOpenAdd) {
      reset({
        code: "",
        discount: "",
        startDate: "",
        endDate: "",
        quantity: "",
        description: "",
        isActive: true,
      });
    }
  }, [isModalOpenAdd, reset]);

  const showConfirmDelete = (id) => {
    setVoucherToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteOpen(false);
    setVoucherToDelete(null);
  };

  const handleCancelDetail = () => {
    setIsDetail(false);
    setVoucherToDetail(null);
  };

  const handleOkDetail = (value) => {
    setIsDetail(true);
    setVoucherToDetail(value);
  };

  const handleConfirmDelete = () => {
    setIsConfirmDeleteOpen(false)
      deleteVoucher(voucherToDelete);
    
  };

  const handleCancelAdd = () => {
    setIsModalOpenAdd(false);
  };

  const handleCancelUpdate = () => {
    setIsModalOpenUpdate(false);
    setVoucherToUpdate(null);
  };

  const handleEdit = (voucher) => {
    setVoucherToUpdate(voucher);
    setIsModalOpenUpdate(true);
  };

  const onSubmit = (data) => {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
      return;
    }

    const formattedData = {
      ...data,
      isActive: data.isActive === "true" || data.isActive === true,
    };

    setIsSubmitting(true);
    addVoucher(formattedData, {
      onSuccess: () => {
        reset();
        handleCancelAdd();
        setIsSubmitting(false);
      },
      onError: (error) => {
        console.error("Error adding voucher:", error.response?.data);
        message.error("Có lỗi xảy ra khi thêm voucher");
        setIsSubmitting(false);
      },
    });
  };

  const onUpdate = (data) => {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
      return;
    }

    const datares = {
      code: data.code,
      discount: data.discount,
      startDate: data.startDate,
      endDate: data.endDate,
      quantity: data.quantity,
      description: data.description,
      isActive:
        typeof data.isActive === "boolean"
          ? data.isActive
          : data.isActive?.toString().toLowerCase() === "true",
    };

    setIsSubmitting(true);
    updateVoucher(
      { id: voucherToUpdate._id, ...datares },
      {
        onSuccess: () => {
          reset();
          handleCancelUpdate();
          setIsSubmitting(false);
        },
        onError: (error) => {
          console.error("Error updating voucher:", error.response?.data);
          message.error("Có lỗi xảy ra khi cập nhật voucher");
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleOkAdd = () => {
    if (!isSubmitting) {
      handleSubmit(onSubmit)();
    }
  };

  const handleOkUpdate = () => {
    if (!isSubmitting) {
      handleSubmit(onUpdate)();
    }
  };

  if (isLoading) {
    return (
      <Spin
        size="large"
        className="h-[50vh] mt-[100px] flex items-center justify-center w-full"
      />
    );
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header border-0 bg-none">
            <div className="row align-items-center gy-3 mb-1">
              <div className="col-sm"></div>
              <div className="col-sm-auto">
                <button
                  type="button"
                  className="text-white text-[0.9rem] bg-[#03A9F4] px-4 py-2 rounded-md"
                  onClick={() => setIsModalOpenAdd(true)}
                >
                  <i className="ri-add-line align-bottom me-1" /> Add Voucher
                </button>
              </div>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="table-responsive">
              <table className="table table-nowrap align-middle">
                <thead className="text-muted table-light">
                  <tr className="text-uppercase">
                    <th>#</th>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers?.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.code}</td>
                      <td>{item.discount}%</td>
                      <td>
                        <FormatDate date={item.startDate} />
                      </td>
                      <td>
                        <FormatDate date={item.endDate} />
                      </td>
                      <td
                        className="customer_name"
                        style={{
                          color: item.isActive ? "green" : "red",
                        }}
                      >
                        {item.isActive ? "Active" : "Block"}
                      </td>
                      <td>
                        <ul className="list-inline hstack gap-2 mb-0">
                          <li className="list-inline-item">
                            <div
                              className="text-primary d-inline-block cursor-pointer"
                              onClick={() => handleOkDetail(item)}
                            >
                              <i className="ri-eye-fill fs-16" />
                            </div>
                          </li>
                          <li className="list-inline-item">
                            <div
                              className="text-primary d-inline-block edit-item-btn cursor-pointer"
                              onClick={() => handleEdit(item)}
                            >
                              <i className="ri-pencil-fill fs-16" />
                            </div>
                          </li>
                          <li className="list-inline-item">
                            <div
                              className="text-danger d-inline-block remove-item-btn cursor-pointer"
                              onClick={() => showConfirmDelete(item._id)}
                            >
                              <i className="ri-delete-bin-5-fill fs-16"></i>
                            </div>
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
      </div>

      {/* Modal Delete */}
      <Modal
        open={isConfirmDeleteOpen}
        footer={[
          <Button key="back" onClick={handleCancelDelete}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirmDelete}>
            OK
          </Button>,
        ]}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-none">
            <div className="modal-body">
              <div className="mt-2 text-center ">
                <div className="flex justify-center">
                  <img
                    src="https://media-public.canva.com/de2y0/MAFqwzde2y0/1/tl.png"
                    alt=""
                    width={100}
                  />
                </div>
                <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                  <h4>Are you sure ?</h4>
                  <p className="text-muted mx-4 mb-0">
                    Bạn có chắc muốn xóa không
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Add */}
      <Modal
        open={isModalOpenAdd}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
        title="Thêm mã giảm giá"
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={isSubmitting}
      >
        <form id="voucherForm">
          <div className="mb-3">
            <label className="form-label">Tên mã giảm giá</label>
            <input
              type="text"
              className="form-control"
              {...register("code", { required: "Tên mã giảm giá là bắt buộc" })}
            />
            {errors.code && (
              <span className="text-red-500">{errors.code.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Số % giảm</label>
            <input
              type="number"
              className="form-control"
              {...register("discount", {
                required: "Vui lòng nhập giảm giá",
                min: {
                  value: 1,
                  message: "Giảm giá phải từ 1% trở lên",
                },
                max: {
                  value: 99,
                  message: "Giảm giá không được vượt quá 99%",
                },
                valueAsNumber: true,
              })}
            />
            {errors.discount && (
              <span className="text-red-500">{errors.discount.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Số tiền giảm tối thiểu</label>
            <input
              type="number"
              className="form-control"
              {...register("maxPriceDis", {
                required: "Vui lòng nhập số tiền giảm tối thiểu",
                valueAsNumber: true,
              })}
            />
            {errors.maxPriceDis && (
              <span className="text-red-500">{errors.maxPriceDis.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Ngày bắt đầu</label>
            <input
              type="date"
              className="form-control"
              {...register("startDate", {
                required: "Ngày bắt đầu là bắt buộc",
              })}
            />
            {errors.startDate && (
              <span className="text-red-500">{errors.startDate.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Ngày kết thúc</label>
            <input
              type="date"
              className="form-control"
              {...register("endDate", {
                required: "Ngày kết thúc là bắt buộc",
              })}
            />
            {errors.endDate && (
              <span className="text-red-500">{errors.endDate.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Số lượng</label>
            <input
              type="number"
              className="form-control"
              {...register("quantity", {
                required: "Số lượng là bắt buộc",
                min: {
                  value: 1,
                  message: "Số lượng phải lớn hơn 0",
                },
              })}
            />
            {errors.quantity && (
              <span className="text-red-500">{errors.quantity.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              rows="3"
              {...register("description", { required: "Mô tả là bắt buộc" })}
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <select
              className="form-select"
              {...register("isActive", { required: true })}
            >
              <option value={true}>Hoạt động</option>
              <option value={false}>Khóa</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal Detail */}
      <Modal
        open={isDetail}
        onCancel={handleCancelDetail}
        title="Chi tiết Voucher"
        footer={null}
      >
        {voucherToDetail && (
          <div>
            <div className="mb-3">
              <label className="form-label font-semibold">Mã voucher:</label>
              <p>{voucherToDetail.code}</p>
            </div>
            <div className="mb-3">
              <label className="form-label font-semibold">Giảm giá:</label>
              <p>{voucherToDetail.discount}%</p>
            </div>
            <div className="mb-3">
              <label className="form-label font-semibold">Giảm giá:</label>
              <p>
                <FormatPrice price={voucherToDetail.maxPriceDis} />
              </p>
            </div>
            <div className="mb-3">
              <label className="form-label font-semibold">Ngày bắt đầu:</label>
              <p>
                <FormatDate date={voucherToDetail.startDate} />
              </p>
            </div>
            <div className="mb-3">
              <label className="form-label font-semibold">Ngày kết thúc:</label>
              <p>
                <FormatDate date={voucherToDetail.endDate} />
              </p>
            </div>
            <div className="mb-3">
              <label className="form-label font-semibold">Số lượng:</label>
              <p>{voucherToDetail.quantity}</p>
            </div>
            <div className="mb-3">
              <label className="form-label font-semibold">Mô tả:</label>
              <p>{voucherToDetail.description}</p>
            </div>
            <div className="mb-3">
              <label className="form-label font-semibold">Trạng thái:</label>
              <p style={{ color: voucherToDetail.isActive ? "green" : "red" }}>
                {voucherToDetail.isActive ? "Hoạt động" : "Khóa"}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Update */}
      <Modal
        open={isModalOpenUpdate}
        onOk={handleOkUpdate}
        onCancel={handleCancelUpdate}
        title="Cập nhật mã giảm giá"
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={isSubmitting}
      >
        <form id="voucherFormUpdate">
          <div className="mb-3">
            <label className="form-label">Tên mã giảm giá</label>
            <input
              type="text"
              className="form-control"
              {...register("code", { required: "Tên mã giảm giá là bắt buộc" })}
            />
            {errors.code && (
              <span className="text-red-500">{errors.code.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Số % giảm</label>
            <input
              type="number"
              className="form-control"
              {...register("discount", {
                required: "Vui lòng nhập giảm giá",
                min: {
                  value: 1,
                  message: "Giảm giá phải từ 1% trở lên",
                },
                max: {
                  value: 99,
                  message: "Giảm giá không được vượt quá 99%",
                },
                valueAsNumber: true,
              })}
            />
            {errors.discount && (
              <span className="text-red-500">{errors.discount.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Số tiền giảm tối thiểu</label>
            <input
              type="number"
              className="form-control"
              {...register("maxPriceDis", {
                required: "Vui lòng nhập số tiền giảm tối thiểu",
                valueAsNumber: true,
              })}
            />
            {errors.maxPriceDis && (
              <span className="text-red-500">{errors.maxPriceDis.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Ngày bắt đầu</label>
            <input
              type="date"
              className="form-control"
              {...register("startDate", {
                required: "Ngày bắt đầu là bắt buộc",
              })}
            />
            {errors.startDate && (
              <span className="text-red-500">{errors.startDate.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Ngày kết thúc</label>
            <input
              type="date"
              className="form-control"
              {...register("endDate", {
                required: "Ngày kết thúc là bắt buộc",
              })}
            />
            {errors.endDate && (
              <span className="text-red-500">{errors.endDate.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Số lượng</label>
            <input
              type="number"
              className="form-control"
              {...register("quantity", {
                required: "Số lượng là bắt buộc",
                min: {
                  value: 1,
                  message: "Số lượng phải lớn hơn 0",
                },
              })}
            />
            {errors.quantity && (
              <span className="text-red-500">{errors.quantity.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              rows="3"
              {...register("description", { required: "Mô tả là bắt buộc" })}
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <select
              className="form-select"
              {...register("isActive", { required: true })}
            >
              <option value={true}>Hoạt động</option>
              <option value={false}>Khóa</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VoucherList;
