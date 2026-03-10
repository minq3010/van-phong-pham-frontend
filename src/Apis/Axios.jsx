import axios from "axios";
import nProgress from "nprogress";
import { getStoredToken, isStoredTokenExpired, logoutUser } from "../utils/auth";

nProgress.configure({
  showSpinner: false,
  easing: "ease",
  speed: 200,
  trickle: true,
  trickleRate: 0.02,
  trickleSpeed: 100,
});
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,  // gửi cookie (accessToken) theo mỗi request
});

instance.interceptors.request.use(
  function (config) {
    if (isStoredTokenExpired()) {
      nProgress.done();
      logoutUser();
      return Promise.reject(new axios.Cancel("Token expired"));
    }

    const token = getStoredToken();

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    nProgress.start();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    nProgress.done();
    return response;
  },
  function (error) {
    nProgress.done();

    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";
    const shouldLogout =
      status === 401 ||
      /token expired|invalid token|access token missing/i.test(message);

    if (shouldLogout) {
      logoutUser();
    }

    return Promise.reject(error);
  }
);
export default instance;
