import Axios from "./Axios";
import { getStoredToken, getStoredUser } from "../utils/auth";
export const getProducts = async (page, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.price) params.append("price", filters.price);
  if (filters.search) params.append("search", filters.search);
  const res = await Axios.get(`/products`);
  return res.data;
};
export const getCategory = async () => {
  const res = await Axios.get(`categorys`);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await Axios.delete(`category/${id}`);
  return res.data;
};
export const updateCategory = async (id, data) => {
  const res = await Axios.patch(`category/${id}`, data);
  return res.data;
};

export const addCategory = async (data) => {
  const res = await Axios.post(`category`, data);
  return res.data;
};
export const DetailProduct = async (id) => {
  const res = await Axios.get(`product/${id}`);
  return res.data;
};
export const forceDeleteProduct = async (id) => {
  const res = await Axios.delete(`products/${id}`);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await Axios.patch(`products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
export const categoryProduct = async (id) => {
  const res = await Axios.get(`/products/category/${id}`);
  return res.data;
};

export const signin = async (data) => {
  const res = await Axios.post(`login`, data);
  return res.data;
};
export const signup = async (data) => {
  const res = await Axios.post(`/register`, data);
  return res.data;
};
// export const logout=async ()=>{
//   const res = await Axios.post(`api/logout`, {
//     headers: {
//       Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth_token")).split("|")[1]}`,
//     },
//   });
//   return res.data.user;
// }

export const logout = async () => {
  const token = getStoredToken();
  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await Axios.post(`/logout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.user;
};

export const getUserToken = async () => {
  return getStoredUser();
};
export const categoryForcedelete = async (id) => {
  const res = await Axios.delete(`/category/${id}`);
  return res.data;
};
export const user = async (page, search = "") => {
  const param = new URLSearchParams();
  param.append("page", page);
  if (search) param.append("search", search);
  const res = await Axios.get(`/user?${param.toString()}`);
  return res.data;
};

export const getOrderCustomers = async () => {
  const res = await Axios.get(`/user?page=1&limit=200&includeOrderCount=1`);
  return res.data;
};
export const detailUser = async () => {
  const user = getStoredUser();

  if (!user?._id) {
    throw new Error("User not found in local storage");
  }

  const res = await Axios.get(`/user/${user._id}`);
  return res.data;
};
export const detailUserId = async (id) => {
  const res = await Axios.get(`/user/${id}`);
  return res.data;
};
export const deleteUser = async (id) => {
  const res = await Axios.delete(`/user/${id}`);
  return res.data;
};
export const addUsers = async (data) => {
  const res = await Axios.post(`/addUser`, data);
  return res.data;
};
export const forceChangePasswordApi = async (id, data) => {
  const res = await Axios.patch(`/user/force-change-password/${id}`, data);
  return res.data;
};
export const updateUsers = async (id, data) => {
  const res = await Axios.patch(`/user/${id}`, data);
  return res.data;
};
export const getOrdersAdmin = async ( filters = {}) => {
  const params = new URLSearchParams({
    ...(filters.search && { search: filters.search }),
    ...(filters.statusOrder && { status: filters.statusOrder }),
    ...((filters.payment || filters.paymen) && {
      payment: filters.payment || filters.paymen,
    }),
    ...(filters.sourceOrder && { source: filters.sourceOrder }),
  });
  const res = await Axios.get(`/orders/?${params.toString()}`);
  return res.data;
};

export const createAdminOrder = async (data) => {
  const res = await Axios.post(`/order`, data);
  return res.data;
};

export const udateStatusOrder = async (id, data) => {
  const res = await Axios.patch(`order/${id}`,data);
  return res.data;
};
export const detailOrder = async (id) => {
  const res = await Axios.get(`/order/${id}`);
  return res.data;
};

export const addProduct = async (data) => {
  const res = await Axios.post(`/products`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const dashboard = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("from", startDate);
    if (endDate) params.append("to", endDate);

    const res = await Axios.get(`/dashboard?${params.toString()}`);
    return res.data;
  } catch (error) {
    // Xử lý lỗi tốt hơn
    console.error("Error fetching dashboard data:", error);
    throw error; // Ném lỗi để component có thể bắt và xử lý
  }
};
export const emailPassword = async (data) => {
  const res = await Axios.post(`/forgot`, data);
  return res.data;
};
export const verifytoken = async (data) => {
  const res = await Axios.post(`/verify-token`, data);
  return res.data;
};
export const resetpassword = async (data) => {
  const res = await Axios.post(`/reset-password`, data);
  return res.data;
};

export const getVouchers = async () => {
  const res = await Axios.get(`/vouchers`);
  return res.data;
};

export const getClientVouchers = async () => {
  const res = await Axios.get(`/vouchers-public`);
  return res.data;
};

export const getVoucherDetail = async (id) => {
  const res = await Axios.get(`/voucher/${id}`);
  return res.data;
};

// Used by profile hooks
export const updateUser = async (data, id) => {
  const res = await Axios.patch(`/user/${id}`, data);
  return res.data;
};

export const createVoucher = async (data) => {
  const res = await Axios.post(`/voucher`, data);
  return res.data;
};

export const updateVoucher = async (id, data) => {
  const res = await Axios.patch(`/voucher/${id}`, data);
  return res.data;
};

export const deleteVoucher = async (id) => {
  const res = await Axios.delete(`/voucher/${id}`);
  return res.data;
};

export const getComments = async () => {
  const res = await Axios.get(`/comment/admin/products`);
  return res.data;
};
export const getCommentDetail = async (id) => {
  const res = await Axios.get(`/comment/${id}`);
  return res.data;
};

export const getProductComments = async (productId) => {
  const res = await Axios.get(`/comment/product/${productId}`);
  return res.data;
};

export const createProductComment = async (data) => {
  const res = await Axios.post(`/comment`, data);
  return res.data;
};

const getRequiredUserId = () => {
  const currentUser = getStoredUser();

  if (!currentUser?._id) {
    throw new Error("Bạn cần đăng nhập để tiếp tục");
  }

  return currentUser._id;
};

export const getClientProducts = async () => {
  const res = await Axios.get(`/products`);
  return res.data;
};

export const getClientCart = async () => {
  const userId = getRequiredUserId();
  const res = await Axios.get(`/cart/${userId}`);
  return res.data;
};

export const addToClientCart = async ({ productId, quantity = 1, color = "Mặc định" }) => {
  const userId = getRequiredUserId();
  const res = await Axios.post(`/cart/${userId}`, {
    productid: productId,
    quantity,
    color,
  });
  return res.data;
};

export const updateClientCartItem = async ({ cartItemId, quantity }) => {
  const res = await Axios.patch(`/cart/${cartItemId}`, { quantity });
  return res.data;
};

export const removeClientCartItem = async (cartItemId) => {
  const res = await Axios.delete(`/cart/${cartItemId}`);
  return res.data;
};

export const clearClientCart = async () => {
  const userId = getRequiredUserId();
  const res = await Axios.delete(`/carts/${userId}`);
  return res.data;
};

export const createClientOrder = async (payload) => {
  const user = getStoredUser();
  const res = await Axios.post(`/order`, {
    ...payload,
    userId: user?._id || null,
  });
  return res.data;
};

export const getClientOrders = async () => {
  const userId = getRequiredUserId();
  const res = await Axios.get(`/order/user/${userId}`);
  return res.data;
};

export const getClientProfile = async () => {
  const userId = getRequiredUserId();
  const res = await Axios.get(`/user/${userId}`);
  return res.data;
};

export const updateClientProfile = async (data) => {
  const userId = getRequiredUserId();
  const res = await Axios.patch(`/user/${userId}`, data);
  return res.data;
};

export const askClientChatbot = async (message) => {
  const res = await Axios.post(`/chatbot`, { message });
  return res.data;
};
