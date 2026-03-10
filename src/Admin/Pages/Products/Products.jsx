import { Image, Modal, Spin } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FormatPrice } from "../../../Format.jsx";
import { useDeleteProduct, useProduct } from "../../../Hook/useProduct.jsx";
import Emptys from "../../Ui/Emty.jsx";

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

const Products = () => {
  const data = getStoredUser();
  const { isProducts, products } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const { mutate } = useDeleteProduct();
  const productRows = Array.isArray(products?.data) ? products.data : [];

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
                </form>
              </div>
              <div className="col-sm-auto">
                <div className="d-flex gap-1 flex-wrap">
                  <Link
                    to="/addproduct"
                    type="button"
                    className="text-white text-[0.9rem] bg-[#03A9F4] px-4 py-2 rounded-md"
                  >
                    Add product
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body pt-0">
            {productRows.length > 0 ? (
              <div>
                <div className="table-responsive table-card mb-1 mt-3 admin-products-table-wrap">
                  <table
                    className="table table-nowrap align-middle admin-products-table"
                    id="orderTable"
                  >
                    <colgroup>
                      <col className="admin-products-col-index" />
                      <col className="admin-products-col-product" />
                      <col className="admin-products-col-price" />
                      <col className="admin-products-col-stock" />
                      <col className="admin-products-col-owner" />
                      <col className="admin-products-col-action" />
                    </colgroup>
                    <thead className="text-muted table-light bg-white">
                      <tr className="text-uppercase ">
                        <th className="admin-products-head-cell">#</th>
                        <th className="admin-products-head-cell">Sản phẩm</th>
                        <th className="admin-products-head-cell">Giá bán</th>
                        <th className="admin-products-head-cell">Tồn kho</th>
                        <th className="admin-products-head-cell">Phụ trách</th>
                        <th className="admin-products-action-cell">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="list form-check-all">
                      {productRows.map((item, index) => (
                        <tr key={index} className="admin-products-row">
                          <td className="id admin-products-cell text-center">
                            <div className="fw-medium">{index + 1}</div>
                          </td>
                          <td className="admin-products-cell">
                            <div className="d-flex align-items-center gap-3 min-w-0 admin-products-summary">
                              <Image
                                width={72}
                                height={72}
                                style={{ objectFit: "cover" }}
                                src={item.imageUrl}
                                alt="product"
                              />
                              <div className="min-w-0 admin-products-meta">
                                <Link
                                  to={`/product_detail/${item._id}`}
                                  className="fw-semibold d-block admin-products-name"
                                >
                                  {item.name}
                                </Link>
                                <div className="text-muted small mt-1">
                                  Danh mục: {item?.caterori?.name || "Chưa cập nhật"}
                                </div>
                                <div className="text-muted small">
                                  Hãng: {item?.brand || "---"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="admin-products-cell">
                            <div className="fw-semibold admin-products-price">
                              <FormatPrice price={item.price} />
                            </div>
                            <div className="text-muted small mt-1">
                              Giảm giá: {item.discount || 0}%
                            </div>
                          </td>

                          <td className="admin-products-cell">
                            <span
                              className={`badge ${item.status === true ? "text-green-500" : "text-red-500"} text-uppercase admin-products-status-badge`}
                            >
                              {item.status === true ? "Active" : "Block"}
                            </span>
                            <div className="fw-semibold mt-2 admin-products-stock-value">{item.quantity}</div>
                            <div className="text-muted small">Sản phẩm còn lại</div>
                          </td>

                          <td className="admin-products-cell">
                            <div className="small admin-products-owner">
                              <div>
                                <span className="text-muted">Tạo bởi:</span>{" "}
                                <span className="fw-medium">{item.createdBy?.username || "---"}</span>
                              </div>
                              <div className="mt-1">
                                <span className="text-muted">Cập nhật:</span>{" "}
                                <span className="fw-medium">{item.updatedBy?.username || "---"}</span>
                              </div>
                            </div>
                          </td>

                          <td className="admin-products-action-cell">
                            <ul className="list-inline hstack gap-2 mb-0 justify-content-center admin-products-actions">
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
                              {data?.role === "manage" && (
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
            ) : (
              <Emptys />
            )}
          </div>
        </div>

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
