import React from "react";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: "",
    };

    this.handleWindowError = this.handleWindowError.bind(this);
    this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Đã xảy ra lỗi không xác định",
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App runtime error:", error, errorInfo);
  }

  componentDidMount() {
    window.addEventListener("error", this.handleWindowError);
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener("error", this.handleWindowError);
    window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
  }

  handleWindowError(event) {
    const nextMessage =
      event?.error?.message ||
      event?.message ||
      "Đã xảy ra lỗi JavaScript ngoài vòng render của React";

    this.setState({
      hasError: true,
      errorMessage: nextMessage,
    });
  }

  handleUnhandledRejection(event) {
    const reason = event?.reason;
    const nextMessage =
      reason?.message ||
      (typeof reason === "string" ? reason : "Có promise bị reject nhưng không được xử lý");

    this.setState({
      hasError: true,
      errorMessage: nextMessage,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-xl w-full rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500 mb-2">
              Runtime Error
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 mb-3">
              Giao diện gặp lỗi khi tải dữ liệu
            </h1>
            <p className="text-slate-600 mb-4">
              Ứng dụng đã chặn lỗi để tránh trắng màn hình toàn bộ. Hãy tải lại trang hoặc đăng nhập lại.
            </p>
            <div className="rounded-xl bg-slate-900 text-slate-100 px-4 py-3 text-sm break-words mb-4">
              {this.state.errorMessage}
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-[#0AB39C] px-4 py-2 text-white"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
              onClick={() => {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                window.location.href = "/signin";
              }}
            >
              Về trang đăng nhập
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
