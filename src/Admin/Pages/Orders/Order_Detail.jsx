import { Modal, Spin } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { FormatDate, FormatDateTime, FormatPrice } from "../../../Format";
import { UseDetailOrder, useStatusOrderAdmin } from "../../../Hook/useOrder";
const Order_Detail = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const { isLoading: isLoadingorder, mutate } = useStatusOrderAdmin(id);
  const { data, isLoading } = UseDetailOrder(id);
  const [idOpen, setIdOpen] = useState("");
  const [status, setStatus] = useState();
  const { handleSubmit } = useForm();
  const idAdmin = JSON.parse(localStorage.getItem("user"));
  const onSubmitUpdate = () => {
    const value = {
      status,
      handledBy: idAdmin._id,
    };
    mutate({ id: idOpen, data: value });
    if (!isLoadingorder) {
      setIdOpen("");
      setIsOpen(false);
      setIsOpenOrder(false);
    }
  };
  const handleCancel = () => {
    setIdOpen("");
    setIsOpen(false);
    setIsOpenOrder(false);
  };

  const handleOpen = (id) => {
    setIdOpen(id._id);
    setStatus(id.status);
    setIsOpen(true);
  };
  const handleCancelOrder = (id, status) => {
    setIdOpen(id._id);
    setStatus(status);
    setIsOpenOrder(true);
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
    <div>
      <div className="row">
        <div className="col-xl-9">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <h5 className="card-title flex-grow-1 items-center mb-0 text-uppercase">
                  Mã đơn hàng #{data?.madh || "N/A"}
                </h5>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive table-card">
                <table className="table table-nowrap align-middle table-borderless mb-0">
                  <thead className="table-light text-muted">
                    <tr>
                      <th scope="col">Chi tiết sản phẩm</th>
                      <th scope="col" style={{ textAlign: "center" }}>
                        Giá
                      </th>
                      <th scope="col" style={{ textAlign: "center" }}>
                        Số lượng
                      </th>

                      <th scope="col" className="text-end">
                        Tổng tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.products?.map((item) => (
                      <tr>
                        <td>
                          <div className="d-flex">
                            <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
                              <img
                                src={item.productId.imageUrl}
                                alt=""
                                className="img-fluid d-block"
                              />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h5 className="fs-15">
                                <div>
                                  {item.name.length > 20
                                    ? item.name.slice(0, 40) + "..."
                                    : item.name}
                                  
                                </div>
                              Màu sắc : {item.color}
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          {<FormatPrice price={item.priceAfterDis} />}
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="fw-medium text-end">
                          {
                            <FormatPrice
                              price={item.priceAfterDis * item.quantity}
                            />
                          }
                        </td>
                      </tr>
                    ))}

                    <tr className="border-top border-top-dashed">
                      <td colSpan={3} />
                      <td colSpan={2} className="fw-medium p-0">
                        <table className="table table-borderless mb-0">
                          <tbody>
                            <tr className="border-top border-top-dashed">
                              <th scope="row"> Mã giảm giá :</th>
                              <th className="text-end ">
                                {data?.voucherId?.discount || 0} %
                              </th>
                            </tr>
                            <tr className="border-top border-top-dashed">
                              <th scope="row">Tổng :</th>
                              <th className="text-end text-xl">
                                {<FormatPrice price={data.totalPrice} />}
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/*end card*/}
          <div className="card">
            <div className="card-header">
              <div className="d-sm-flex align-items-center">
                <h5 className="card-title flex-grow-1 mb-0">
                  Trạng thái đơn hàng
                </h5>
                {data.status !== "Hủy" && (
                  <div className="flex mt-2 mt-sm-0 gap-2">
                    <div
                      className="px-3 py-1 bg-[#dff0fa] hover:text-white hover:bg-blue-500 cursor-pointer rounded-md btn-sm mt-2 mt-sm-0"
                      style={{ color: "white !important" }}
                      onClick={() => handleOpen(data)}
                    >
                      <i className="ri-map-pin-line align-middle me-1" />
                      Trạng thái đơn hàng
                    </div>
                    {data.status == "Xác nhận" && (
                      <div
                        className="px-3 py-1 bg-[#fadbd5] hover:text-white  hover:bg-red-500 cursor-pointer rounded-md btn-sm mt-2 mt-sm-0"
                        onClick={() => handleCancelOrder(data, "Hủy")}
                        style={{ color: "white !important" }}
                      >
                        <i className="mdi mdi-archive-remove-outline align-middle me-1" />
                        Hủy đơn hàng
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="profile-timeline">
                <div
                  className="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  <div className="accordion-item border-0">
                    <div className="accordion-header" id="headingOne">
                      <div className="accordion-button p-2 shadow-none">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 avatar-xs">
                            <div className="avatar-title bg-success rounded-circle">
                              <i className="ri-shopping-bag-line" />
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3 ">
                            <h6 className="fs-15 mb-0 fw-semibold flex ">
                              {data?.status}
                              <span className="fw-normal ml-2 flex gap-1">
                                {<FormatDate date={data?.updatedAt} />}
                                {
                                  <FormatDateTime
                                    dateString={data?.updatedAt}
                                  />
                                }
                              </span>
                            </h6>
                            {data?.handledBy && (
                              <h6 className="fs-15">
                                Người {data?.status} :
                                {data?.handledBy?.username}
                              </h6>
                            )}

                            {data?.status === "Hủy" && (
                              <div className=" gap-2 text-[14px] items-center">
                                <div>
                                  <h6 className="fs-15">
                                    Lý do hủy : {data?.cancelReason}
                                  </h6>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*end accordion*/}
              </div>
            </div>
          </div>
          {/*end card*/}
        </div>
        {/*end col*/}
        <div className="col-xl-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="ri-map-pin-line align-middle me-1 text-muted" />
                Địa chỉ giao hàng
              </h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled vstack gap-2 fs-15 mb-0">
                <li className=" fs-14">Tên người mua : {data.customerName}</li>
                <li>Số điện thoại : {data.phone}</li>
                <li>Địa chỉ : {data.address}</li>
                <li>Ghi chú : {data.note}</li>
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="ri-map-pin-line align-middle me-1 text-muted" />
                Thông tin thanh toán
              </h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled vstack gap-2 fs-15 mb-0">
                <li className=" fs-14">
                  Hình thức thanh toán : {data.payment}
                </li>
                <li>
                  Trạng thái thanh toán:{" "}
                  {data.isPaymentSucces ? "Đã thanh toán" : "Chưa Thanh Toán"}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/*end col*/}
      </div>
      <Modal
        open={isOpen}
        onOk={handleSubmit(onSubmitUpdate)}
        onCancel={handleCancel}
        title="Trạng thái đơn hàng"
        width={800}
        // className="modal fade zoomIn"
      >
        <>
          <div className="radio-inputs-order my-6">
            {[
              { label: "Xác nhận", value: "Xác nhận" },
              { label: "Đang giao hàng", value: "Đang giao hàng" },
              { label: "Thành công", value: "Thành Công" },
              { label: "Hủy", value: "Hủy" },
            ].map((item) => (
              <label className="radio" key={item.value}>
                <input
                  type="radio"
                  name="radio"
                  value={item.value}
                  checked={status === item.value}
                  onChange={() => setStatus(item.value)}
                />
                <span className="name">{item.label}</span>
              </label>
            ))}
          </div>
        </>
      </Modal>
      <Modal
        open={isOpenOrder}
        onOk={handleSubmit(onSubmitUpdate)}
        onCancel={handleCancel}
        title="Trạng thái đơn hàng"
        width={800}
        // className="modal fade zoomIn"
      >
        <>
          <div className="">Bạn có chắc chắn muốn hủy đơn hàng này không?</div>
        </>
      </Modal>
    </div>
  );
};

export default Order_Detail;
