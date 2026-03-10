import { getStoredUser, getStoredToken } from "../utils/auth";

const useAuth = () => {
  const token = typeof window !== "undefined" ? getStoredToken() : null;
  const data = typeof window !== "undefined" ? getStoredUser() : null;

  return {
    data,
    isLoading: false,
    isAuthenticated: Boolean(token && data),
  };
};

export default useAuth;
