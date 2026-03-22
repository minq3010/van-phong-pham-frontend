import { Navigate } from "react-router-dom";
import { getStoredToken, getStoredUser, isStoredTokenExpired } from "../utils/auth";

const ClientPrivateRouter = ({ children }) => {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user || isStoredTokenExpired()) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role === "admin" || user?.role === "manage") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ClientPrivateRouter;
