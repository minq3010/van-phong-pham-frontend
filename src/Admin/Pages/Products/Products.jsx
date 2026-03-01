import { Image, Modal, Spin } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FormatPrice } from "../../../Format.jsx";
import { useDeleteProduct, useProduct } from "../../../Hook/useProduct.jsx";
import Emptys from "../../Ui/Emty.jsx";
const Products = () => {
  const dataString = localStorage.getItem("user");
  const data = JSON.parse(dataString);
  const { isProducts, products } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const { mutate } = useDeleteProduct();
  const showModal = (id) => {
    setIdDelete(id);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = () => {
    mutate(idDelete);
    setIsModalOpen(false);
  };

  // const handleSearch = (e) => {
  //   if (e.key === "Enter") {
  //     const value = e.target.value.trim();
  //     const updateValue = new URLSearchParams(searchParam.toString());
  //     updateValue.set("search", value);
  //     navigate(`?${updateValue.toString()}`);
  //   }
  // };

  if (isProducts) {
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
        {products?.data.length > 0 ? (
          <div className="card" id="orderList">
            <div className="card-header border-0 bg-none">
              <div className="row align-items-center gy-3">
                <div className="col-sm pl-2">
                  <form>
                    <div className="row g-3">
                      <div className="col-xxl-5 col-sm-5">
                        {/* <div className="search-box">
                          <input
                            type="text"
                            className="form-control search"
                            placeholder="Search for product ..."
                            onKeyDown={(e) => handleSearch(e)}
                          />
                          <i className="ri-search-line search-icon" />
                        </div> */}
                      </div>
                    </div>
                    {/*end row*/}
                  </form>
                </div>
                <div className="col-sm-auto">
                  <div className="d-flex gap-1 flex-wrap">
                    <Link
                      to="/addproduct"
                      type="button"
                      className="text-white text-[0.9rem] bg-[#03A9F4] px-4 py-2 rounded-md "
                    >
                      Add product
                    </Link>
                    <button className="btn btn-soft-danger" id="remove-actions">
                      <i className="ri-delete-bin-2-line" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              <div>
                <div className="table-responsive table-card mb-1 mt-3 overflow-hidden">
                  <table
                    className="table table-nowrap align-middle"
                    id="orderTable"
                  >
                    <thead className="text-muted table-light bg-white">
                      <tr className="text-uppercase ">
                        <th>#</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Giảm giá</th>
                        <th>Ảnh</th>
                        <th>Số lượng</th>
                        <th>Người tạo</th>
                        <th>Người cập nhật</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="list form-check-all">
                      {products?.data.map((item, index) => (
                        <tr key={index}>
                          <td className="id">
                            <div className="fw-medium">{index + 1}</div>
                          </td>
                          <td className="customer_name">
                            <Link
                              to={`/product_detail/${item._id}`}
                              className="fw-medium "
                            >
                              {item.name.length > 30
                                ? item.name.slice(0, 30) + "..."
                                : item.name}
                            </Link>
                          </td>

                          <td>{item?.caterori?.name}</td>
                          <td className="amount">
                            {<FormatPrice price={item.price} />}
                          </td>
                          <td className="amount">{item.discount || 0} %</td>
                          <td>
                            <Image
                              width={100}
                              style={{ maxHeight: "200px" }}
                              src={item.imageUrl}
                              alt="product"
                            />
                          </td>
                          <td>{item.quantity}</td>
                          <td>{item.createdBy?.username}</td>
                          <td>{item.updatedBy?.username}</td>
                          <td className="status">
                            <span
                              className={`badge ${item.status === true ? "text-green-500" : "text-red-500"} text-uppercase`}
                            >
                              {item.status === true ? "Active" : "Block"}
                            </span>
                          </td>
                          <td>
                            <ul className="list-inline hstack gap-2 mb-0">
                              <li
                                className="list-inline-item"
                                data-bs-toggle="tooltip"
                                data-bs-trigger="hover"
                                data-bs-placement="top"
                                title="View"
                              >
                                <Link
                                  to={`/product_detail/${item._id}`}
                                  className="text-primary d-inline-block"
                                >
                                  <i className="ri-eye-fill fs-16" />
                                </Link>
                              </li>
                              <li className="list-inline-item edit">
                                <Link
                                  to={`/uppdateproduct/${item._id}`}
                                  data-bs-toggle="modal"
                                  className="text-primary d-inline-block edit-item-btn"
                                >
                                  <i className="ri-pencil-fill fs-16" />
                                </Link>
                              </li>
                              {data.role === "manage" && (
                                <li className="list-inline-item">
                                  <div
                                    className="text-danger d-inline-block remove-item-btn"
                                    onClick={() => showModal(item._id)}
                                  >
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                  </div>
                                </li>
                              )}
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
        ) : (
          <Emptys />
        )}

        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}

          // className="modal fade zoomIn"
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
      </div>
      {/*end col*/}
    </div>
  );
};

export default Products;
