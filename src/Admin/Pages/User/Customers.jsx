import { Pagination, Spin } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { user } from "../../../Apis/Api";
import { FormatDate } from "../../../Format";
import { useAddUser, useUpdateUser } from "../../../Hook/useUser";

const Customers = () => {
  const { mutate: updateuser } = useUpdateUser();
  const { mutate } = useAddUser();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery); // State cho input
  const [block, setBlock] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, searchQuery],
    queryFn: () => user(page, searchQuery),
  });

  const onShowSizeChange = (current) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", current);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handleOk = (id, active) => {
    updateuser({
      id,
      data: {
        active: active,
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const userData = {
      ...data,
      password: "Abcd@123",
      role: "admin",
    };
    mutate(userData);
    setBlock(false);
  };

  // Hàm xử lý khi submit form search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("search", searchInput);
    searchParams.set("page", "1");
    navigate(`${location.pathname}?${searchParams.toString()}`);
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
    <div className="row px-4">
      <div className="col-lg-12">
        <div className="card" id="customerList">
          <div className="card-body border-bottom-dashed border-bottom">
            <form onSubmit={handleSearchSubmit}>
              <div className="row g-3">
                <div className="col-xl-6">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm theo tên (Nhấn Enter để tìm)"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <i className="ri-search-line search-icon" />
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="row g-3">
                    <div className="col-sm-auto">
                      <div className="d-flex flex-wrap align-items-start gap-2">
                        <button
                          className="btn btn-soft-danger"
                          id="remove-actions"
                          type="button"
                        >
                          <i className="ri-delete-bin-2-line" />
                        </button>
                        <button
                          type="button"
                          className="text-white text-[0.9rem] bg-[#03A9F4] px-4 py-[0.4rem] rounded-md"
                          onClick={() => setBlock(true)}
                        >
                          <i className="ri-add-line align-bottom" /> Thêm admin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="card-body">
            <div>
              <div className="table-responsive table-card mb-1">
                <table className="table align-middle" id="customerTable">
                  <thead className="table-light text-muted">
                    <tr>
                      <th scope="col" style={{ width: 50 }}>
                        #
                      </th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Ngày tạo tài khoản</th>
                      <th>Trạng thái</th>
                      <th>Vai trò</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    {data?.data?.map((item, index) => (
                      <tr key={item._id}>
                        <th scope="row">
                          {(page - 1) * (data?.pagination?.itemsPerPage || 10) +
                            index +
                            1}
                        </th>
                        <td className="id" style={{ display: "none" }}>
                          <Link to="#" className="fw-medium link-primary">
                            #VZ2101
                          </Link>
                        </td>
                        <td className="customer_name">{item.username}</td>
                        <td className="email">{item.email}</td>
                        <td className="phone">
                          {item.phone ?? "Chưa cập nhật"}
                        </td>
                        <td className="date">
                          {FormatDate({ date: item.createdAt })}
                        </td>
                        <td className="status">
                          <span
                            className={`badge ${
                              item.active === true
                                ? "bg-success-subtle text-success"
                                : "bg-red-500"
                            } text-uppercase`}
                          >
                            {item.active === true ? "Hoạt động" : "Khóa"}
                          </span>
                        </td>
                        <td className="role">
                          <span className="text-sm text-uppercase">
                            {item.role}
                          </span>
                        </td>
                        <td className="text-center">
                          <li className="list-inline-item edit">
                            <div
                              className="text-primary d-inline-block edit-item-btn cursor-pointer"
                              onClick={() => handleOk(item._id, !item.active)}
                            >
                              {!item.active ? (
                                <i class="fa-solid fa-lock-open"></i>
                              ) : (
                                <i class="fa-solid fa-lock"></i>
                              )}
                            </div>
                          </li>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.data?.length === 0 && (
                  <div className="noresult">
                    <div className="text-center py-4">
                      <h5 className="mt-2">Không tìm thấy kết quả</h5>
                      <p className="text-muted mb-0">
                        Không tìm thấy người dùng nào phù hợp với tìm kiếm của
                        bạn.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex justify-center mb-4">
                <Pagination
                  onChange={onShowSizeChange}
                  current={data?.pagination?.currentPage || 1}
                  total={data?.pagination?.totalItems || 0}
                  pageSize={data?.pagination?.itemsPerPage || 10}
                  align="center"
                  showSizeChanger={false}
                />
              </div>
            </div>

            <div
              className={`modal fade ${block ? "block opacity-100" : ""}`}
              style={{ background: "rgba(0, 0, 0, 0.5)" }}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                style={{ transform: "none" }}
              >
                <div className="modal-content">
                  <div className="modal-header bg-light p-3">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Thêm admin
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setBlock(false)}
                    />
                  </div>
                  <form
                    className="tablelist-form"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="modal-body">
                      <div className="mb-3">
                        <label
                          htmlFor="customername-field"
                          className="form-label"
                        >
                          Tên
                        </label>
                        <input
                          type="text"
                          id="customername-field"
                          className="form-control"
                          placeholder="Enter name"
                          {...register("username", { required: true })}
                        />
                        <div className="text-red-500 mt-1">
                          {errors.username && "Please enter a customer name."}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email-field" className="form-label">
                          Email
                        </label>
                        <input
                          type="text"
                          id="email-field"
                          className="form-control"
                          placeholder="Enter email"
                          {...register("email", {
                            required: "Please enter a email.",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                              message: "Please enter a valid email.",
                            },
                          })}
                        />
                        <div className="text-red-500 mt-1">
                          {errors.email && errors.email.message}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <div className="hstack gap-2 justify-content-end">
                        <button
                          type="button"
                          className="px-3 py-2 mt-2 rounded-md bg-[#F3F6F9]"
                          onClick={() => setBlock(false)}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-2 mt-2 rounded-md btn-success"
                          id="add-btn"
                        >
                          Add Customer
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
