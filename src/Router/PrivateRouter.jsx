import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  authExpiredEventName,
  clearStoredAuth,
  getTokenExpiryTime,
  getStoredToken,
  getStoredUser,
  isStoredTokenExpired,
} from "../utils/auth";

// Role hierarchy: manage (cao nhất) > admin > user
const ALLOWED_ROLES = ["admin", "manage"];

const PrivateRouter = (props) => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const token = getStoredToken();
  const user = getStoredUser();
  const location = useLocation();
  const tokenExpiryTime = useMemo(() => getTokenExpiryTime(), [token]);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearStoredAuth();
      setSessionExpired(true);
    };

    if (!token || isStoredTokenExpired()) {
      handleSessionExpired();
      return undefined;
    }

    const timeoutDuration = tokenExpiryTime ? Math.max(tokenExpiryTime - Date.now(), 0) : null;
    const timeoutId =
      timeoutDuration !== null
        ? window.setTimeout(handleSessionExpired, timeoutDuration)
        : null;

    window.addEventListener(authExpiredEventName, handleSessionExpired);

    return () => {
      window.removeEventListener(authExpiredEventName, handleSessionExpired);

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [token, tokenExpiryTime]);

  if (sessionExpired || !token || !user) {
    return <Navigate to="/signin" replace />;
  }

  if (!ALLOWED_ROLES.includes(user?.role)) {
    clearStoredAuth();
    return <Navigate to="/signin" replace />;
  }

  if (user?.mustChangePassword && location.pathname !== "/force-change-password") {
    return <Navigate to="/force-change-password" replace />;
  }

  return <div>{props.children}</div>;
};

export default PrivateRouter;
