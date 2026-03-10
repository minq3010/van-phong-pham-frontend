import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import FullScreenButton from "./FullScreen";
import { message } from "antd";
import appLogo from "../../assets/images/logo.png";
import { getStoredUser } from "../../utils/auth";

const Layout = () => {
  const [profile, setProfile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const dropdownRef = useRef(null);
  const isSidebarCollapsedRef = useRef(false);
  const orderModalSidebarStateRef = useRef({
    previousCollapsed: false,
    autoCollapsed: false,
  });
  const nav = useNavigate();

  useEffect(() => {
    isSidebarCollapsedRef.current = isSidebarCollapsed;
  }, [isSidebarCollapsed]);

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

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth < 768;
      setIsMobileViewport(nextIsMobile);

      if (!nextIsMobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleCreateOrderModalToggle = (event) => {
      if (window.innerWidth < 768) {
        return;
      }

      const isOpen = Boolean(event.detail?.open);

      if (isOpen) {
        orderModalSidebarStateRef.current = {
          previousCollapsed: isSidebarCollapsedRef.current,
          autoCollapsed: !isSidebarCollapsedRef.current,
        };

        if (!isSidebarCollapsedRef.current) {
          setIsSidebarCollapsed(true);
        }

        return;
      }

      if (orderModalSidebarStateRef.current.autoCollapsed) {
        setIsSidebarCollapsed(
          orderModalSidebarStateRef.current.previousCollapsed
        );
      }

      orderModalSidebarStateRef.current = {
        previousCollapsed: false,
        autoCollapsed: false,
      };
    };

    window.addEventListener(
      "admin:create-order-modal-toggle",
      handleCreateOrderModalToggle
    );

    return () => {
      window.removeEventListener(
        "admin:create-order-modal-toggle",
        handleCreateOrderModalToggle
      );
    };
  }, []);

  const { pathname } = useLocation();

  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "Dashboards";
  const formatRoleLabel = (role) => {
    const roleLabels = {
      admin: "Admin",
      manage: "Manager",
      user: "Người dùng",
    };

    if (!role) {
      return "Tài khoản";
    }

    return roleLabels[role] || capitalizeFirstLetter(role);
  };

  const thirdPathSegment = capitalizeFirstLetter(pathname.split("/")[1]);
  const data = getStoredUser();
  const roleLabel = formatRoleLabel(data?.role);
  const displayName = data?.username || "Tài khoản";
  const menuItems = [
    {
      to: "",
      match: "Dashboards",
      icon: "ri-bar-chart-box-line",
      label: "Thống kê",
    },
    {
      to: "/products",
      match: "Products",
      icon: "ri-shopping-bag-3-line",
      label: "Sản phẩm",
    },
    {
      to: "/order",
      match: "Order",
      icon: "ri-file-list-3-line",
      label: "Đơn hàng",
    },
    {
      to: "/categories",
      match: "Categories",
      icon: "ri-folders-line",
      label: "Danh mục",
    },
    {
      to: "/voucher",
      match: "Voucher",
      icon: "ri-coupon-3-line",
      label: "Mã giảm giá",
    },
    {
      to: "/comment",
      match: "Comment",
      icon: "ri-chat-1-line",
      label: "Đánh giá",
    },
    ...(data?.role === "manage"
      ? [
          {
            to: "admins",
            match: "Admins",
            icon: "ri-user-settings-line",
            label: "Tài khoản Admin",
          },
        ]
      : []),
  ];
  // const { data, isLoading } = useAuth();
  // if (isLoading) {
  //   return (
  //     <Spin
  //       size="large"
  //       className="h-[50vh] mt-[100px] flex items-center justify-center w-full "
  //     />
  //   );
  // }
  const Logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    message.success("Đăng xuất thành công");
    nav("/signin");
  };

  const handleSidebarToggle = () => {
    if (isMobileViewport) {
      setIsMobileSidebarOpen((current) => !current);
      return;
    }

    setIsSidebarCollapsed((current) => !current);
  };

  const isSidebarOpen = isMobileViewport ? isMobileSidebarOpen : !isSidebarCollapsed;
  const layoutWrapperClassName = [
    "layout-wrapper",
    isMobileSidebarOpen ? "vertical-sidebar-enable navbar-show" : "",
    !isMobileViewport && isSidebarCollapsed ? "admin-sidebar-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!data) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <>
        <div
          id="layout-wrapper"
          className={layoutWrapperClassName}
          data-layout="vertical"
          data-sidebar-size={isSidebarCollapsed ? "sm" : undefined}
        >
          <header id="page-topbar">
            <div className="layout-width">
              <div className="navbar-header">
                <div className="d-flex">
                  {/* LOGO */}

                  <button
                    type="button"
                    className="btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger border-none bg-none"
                    id="topnav-hamburger-icon"
                    onClick={handleSidebarToggle}
                    aria-label={isSidebarOpen ? "An sidebar" : "Hien sidebar"}
                  >
                    <i
                      className={`${isSidebarOpen ? "ri-menu-fold-line" : "ri-menu-unfold-line"} text-[24px] leading-none text-slate-600`}
                    />
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
                            {displayName}
                          </span>
                          <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text">
                            {roleLabel}
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
                        Welcome {displayName}
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
              <Link
                to={""}
                className="logo mr-0 flex items-center justify-center admin-sidebar-logo"
                style={{ padding: "18px 12px 10px" }}
              >
                <span
                  className="logo-lg flex items-center justify-center w-full"
                  style={{ minHeight: "128px" }}
                >
                  <img
                    src={appLogo}
                    alt="Van phong pham"
                    style={{
                      width: "150px",
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "contain",
                      display: "block",
                      margin: "0 auto",
                      borderRadius: "16px",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
                    }}
                  />
                </span>
                <span className="logo-sm admin-sidebar-logo-sm">
                  <img
                    src={appLogo}
                    alt="Van phong pham"
                    className="admin-sidebar-logo-sm-image"
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
                  {menuItems.map((item) => (
                    <li className="nav-item" key={item.to || item.label}>
                      <Link
                        to={item.to}
                        className={`nav-link menu-link admin-menu-link ${thirdPathSegment === item.match ? "active" : ""}`}
                      >
                        <i className={`${item.icon} admin-menu-icon`} />
                        <span data-key="t-dashboards">{item.label}</span>
                      </Link>
                    </li>
                  ))}

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
          <div
            className="vertical-overlay"
            onClick={() => setIsMobileSidebarOpen(false)}
            role="button"
            tabIndex={isMobileSidebarOpen ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setIsMobileSidebarOpen(false);
              }
            }}
            aria-label="Dong sidebar"
          />
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
