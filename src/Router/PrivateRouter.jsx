import { Navigate, useLocation } from "react-router-dom";

// Role hierarchy: manage (cao nhất) > admin > user
const ALLOWED_ROLES = ["admin", "manage"];

const PrivateRouter = (props) => {
  const token = localStorage.getItem("auth_token");
  const userRaw = localStorage.getItem("user");
  const location = useLocation();

  if (!token || !userRaw) {
    return <Navigate to="/signin" />;
  }

  try {
    const user = JSON.parse(userRaw);
    if (!ALLOWED_ROLES.includes(user?.role)) {
      return <Navigate to="/signin" />;
    }
    // Nếu admin chưa đổi mật khẩu lần đầu, chặn mọi trang và buộc đổi mật khẩu
    if (user?.mustChangePassword && location.pathname !== "/force-change-password") {
      return <Navigate to="/force-change-password" />;
    }
  } catch {
    return <Navigate to="/signin" />;
  }

  return <div>{props.children}</div>;
};

export default PrivateRouter;
