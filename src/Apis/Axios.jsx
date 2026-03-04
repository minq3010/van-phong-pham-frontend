import axios from "axios";
import nProgress from "nprogress";

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
    const token = JSON?.parse(localStorage.getItem("auth_token"));
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
    return Promise.reject(error);
  }
);
export default instance;
