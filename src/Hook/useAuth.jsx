import { getStoredUser, getStoredToken } from "../utils/auth";

const useAuth = () => {
  const token = typeof window !== "undefined" ? getStoredToken() : null;
  const rawUser = typeof window !== "undefined" ? getStoredUser() : null;
  const data = rawUser ? { ...rawUser, id: rawUser.id ?? rawUser._id } : null;

  return {
    data,
    isLoading: false,
    isAuthenticated: Boolean(token && data),
  };
};

export default useAuth;
