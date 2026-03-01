import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import FullScreenButton from "./FullScreen";
import { message } from "antd";
const Layout = () => {
  const [profile, setProfile] = useState(false);
  const dropdownRef = useRef(null);
  const nav = useNavigate();
  const handleClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setProfile(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  const { pathname } = useLocation();

  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "Dashboards";

  const thirdPathSegment = capitalizeFirstLetter(pathname.split("/")[1]);
  // const { data, isLoading } = useAuth();
  // if (isLoading) {
  //   return (
  //     <Spin
  //       size="large"
  //       className="h-[50vh] mt-[100px] flex items-center justify-center w-full "
  //     />
  //   );
  // }
  const dataString = localStorage.getItem("user");
  const data = JSON.parse(dataString);
  const Logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    message.success("Đăng xuất thành công");
    nav("/signin");
  };
  return (
    <div>
      <>
        <div id="layout-wrapper">
          <header id="page-topbar">
            <div className="layout-width">
              <div className="navbar-header">
                <div className="d-flex">
                  {/* LOGO */}

                  <button
                    type="button"
                    className="btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger border-none bg-none"
                    id="topnav-hamburger-icon"
                  >
                    <span className="hamburger-icon">
                      <span />
                      <span />
                      <span />
                    </span>
                  </button>
                </div>
                <div className="d-flex align-items-center">
                  <div className="dropdown d-md-none topbar-head-dropdown header-item">
                    <button
                      type="button"
                      className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                      id="page-header-search-dropdown"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-search fs-22" />
                    </button>
                    <div
                      className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                      aria-labelledby="page-header-search-dropdown"
                    >
                      <form className="p-3">
                        <div className="form-group m-0">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search ..."
                              aria-label="Recipient's username"
                            />
                            <button className="btn btn-primary" type="submit">
                              <i className="mdi mdi-magnify" />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="ms-1 header-item d-none d-sm-flex">
                    <FullScreenButton />
                  </div>
                  <div className="dropdown ms-sm-3 header-item topbar-user">
                    <button
                      type="button"
                      className="px-3 rounded-md"
                      onClick={() => setProfile(!profile)}
                    >
                      <span className="d-flex align-items-center">
                        <img
                          className="rounded-circle header-profile-user"
                          src={data?.avatar}
                          alt="Header Avatar"
                        />
                        <span className="text-start ms-xl-2">
                          <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                            {data.username}
                          </span>
                          <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text">
                            Admin
                          </span>
                        </span>
                      </span>
                    </button>
                    <div
                      className={`dropdown-menu dropdown-menu-end ${profile ? "show" : ""}`}
                      ref={dropdownRef}
                      style={{
                        position: "absolute",
                        inset: "0px 0px auto auto",
                        margin: "0px",
                        transform: "translate3d(0px, 64.8px, 0px)",
                      }}
                    >
                      <h6 className="dropdown-header">
                        Welcome {data.username}
                      </h6>
                      <Link className="dropdown-item" to={"/profile"}>
                        <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1" />
                        <span className="align-middle">Profile</span>
                      </Link>
                      <div
                        className="dropdown-item cursor-pointer "
                        onClick={Logout}
                      >
                        <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />
                        <span className="align-middle" data-key="t-logout">
                          Logout
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* removeNotificationModal */}
          <div
            id="removeNotificationModal"
            className="modal fade zoomIn"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    id="NotificationModalbtn-close"
                  />
                </div>
                <div className="modal-body">
                  <div className="mt-2 text-center">
                    <lord-icon
                      src="https://cdn.lordicon.com/gsqxdxog.json"
                      trigger="loop"
                      colors="primary:#f7b84b,secondary:#f06548"
                      style={{ width: 100, height: 100 }}
                    />
                    <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                      <h4>Are you sure ?</h4>
                      <p className="text-muted mx-4 mb-0">
                        Are you sure you want to remove this Notification ?
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                    <button
                      type="button"
                      className="btn w-sm btn-light"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn w-sm btn-danger"
                      id="delete-notification"
                    >
                      Yes, Delete It!
                    </button>
                  </div>
                </div>
              </div>
              {/* /.modal-content */}
            </div>
            {/* /.modal-dialog */}
          </div>
          {/*=== App Menu=== */}
          <div className="app-menu navbar-menu bg-[#405189]">
            <div className="navbar-brand-box ">
              <Link to={""} className="logo mr-0">
                <span className="logo-lg ">
                  <img
                    src="https://aobidathietke.com/wp-content/uploads/2023/04/Mau-Logo-Bida-Thiet-Ke-Dep-Danh-Cho-doi-Cau-Lac-Bo-Club-Quan-Billiards-31-400x400.png"
                    alt=""
                    style={{ height: "150px" }}
                  />
                </span>
              </Link>
            </div>
            <div
              id="scrollbar "
              className="overflow-auto h-full"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="container-fluid">
                <div id="two-column-menu" />
                <ul className="navbar-nav" id="navbar-nav">
                  <li className="nav-item">
                    <Link
                      to=""
                      className={`nav-link menu-link ${thirdPathSegment === "Dashboards" ? "active" : ""}`}
                    >
                      <i className="ri-dashboard-2-line" />
                      <span data-key="t-dashboards">Thống kê</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/products"
                      className={`nav-link menu-link ${thirdPathSegment === "Products" ? "active" : ""}`}
                    >
                      <i className="ri-apps-2-line" />
                      <span data-key="t-dashboards">Sản phẩm</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/order"
                      className={`nav-link menu-link ${thirdPathSegment == "Order" ? "active" : ""}`}
                    >
                      <img
                        src="https://media-public.canva.com/fQMlo/MAF38jfQMlo/1/tl.png"
                        alt=""
                        width={20}
                        style={{ filter: "invert(1) hue-rotate(180deg)" }}
                        className="me-2"
                      />
                      <span data-key="t-layouts">Đơn hàng</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/categories"
                      className={`nav-link menu-link ${thirdPathSegment === "Categories" ? "active" : ""}`}
                    >
                      <i className="ri-dashboard-2-line" />
                      <span data-key="t-dashboards">Danh mục</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/voucher"
                      className={`nav-link menu-link ${thirdPathSegment === "Voucher" ? "active" : ""}`}
                    >
                      <i class="fa-solid fa-ticket"></i>
                      <span data-key="t-dashboards">Mã giảm giá</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/comment"
                      className={`nav-link menu-link ${thirdPathSegment === "Comment" ? "active" : ""}`}
                    >
                      <i class="fa-solid fa-comment"></i>
                      <span data-key="t-dashboards">Đánh giá</span>
                    </Link>
                  </li>
                  {data.role === "manage" && (
                    <li className="nav-item">
                      <Link
                        to="customers"
                        className={`nav-link menu-link ${thirdPathSegment == "Customers" ? "active" : ""}`}
                      >
                        <i className="fa fa-user"></i>
                        <span data-key="t-layouts">Tài khoản</span>
                      </Link>
                    </li>
                  )}

                  {/*
                  <li className="nav-item">
                    <Link
                      to="profile"
                      className={`nav-link menu-link relative ${thirdPathSegment == "Profile" ? "active" : ""}`}
                      role="button"
                    >
                      <i className="ri-pages-line" />
                      <span>Profile</span>
                    </Link>
                  </li> */}
                </ul>
              </div>
              {/* Sidebar */}
            </div>
            <div className="sidebar-background" />
          </div>
          {/* Left Sidebar End */}
          {/* Vertical Overlay*/}
          <div className="vertical-overlay" />
          {/*====== */}
          {/* Start right Content here */}
          {/*====== */}
          <div className="main-content overflow-hidden">
            <div className="page-content bg-[#f8fcff] min-h-[100vh]">
              <div className="container-fluid">
                {/* start page title */}
                <div className="row">
                  {thirdPathSegment !== "Dashboards" && (
                    <div className="col-12">
                      <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 className="mb-sm-0">{thirdPathSegment}</h4>
                        <div className="page-title-right">
                          <ol className="breadcrumb m-0">
                            <li className="breadcrumb-item">
                              <Link>Admin</Link>
                            </li>
                            <li className="breadcrumb-item active">
                              {thirdPathSegment}
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Outlet></Outlet>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Layout;
