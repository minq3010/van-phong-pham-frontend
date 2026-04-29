import Axios from "./Axios";
import { getStoredToken, getStoredUser } from "../utils/auth";

const GUEST_CART_KEY = "guest_cart";

const parseGuestCart = (raw) => {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getGuestCartItems = () => {
  if (typeof window === "undefined") {
    return [];
  }

  return parseGuestCart(window.localStorage.getItem(GUEST_CART_KEY));
};

const saveGuestCartItems = (items) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(Array.isArray(items) ? items : []));
};

const normalizeCartProduct = (product) => ({
  _id: product._id,
  name: product.name,
  price: Number(product.price || 0),
  imageUrl: product.imageUrl || "",
});

const getGuestCartResponse = (items) => {
  const data = Array.isArray(items) ? items : [];
  const totalPrice = data.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.product?.price || 0),
    0
  );

  return { data, totalPrice };
};

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
  const user = getStoredUser();

  if (user?._id) {
    const res = await Axios.get(`/cart/${user._id}`);
    return res.data;
  }

  return getGuestCartResponse(getGuestCartItems());
};

export const addToClientCart = async ({ productId, quantity = 1, color = "Mặc định", size, product }) => {
  const user = getStoredUser();

  if (user?._id) {
    const res = await Axios.post(`/cart/${user._id}`, {
      productid: productId,
      quantity,
      color,
      size,
    });
    return res.data;
  }

  let itemProduct = product;
  if (!itemProduct) {
    const response = await DetailProduct(productId);
    itemProduct = response?.data;
  }

  if (!itemProduct?._id) {
    throw new Error("Không tìm thấy sản phẩm để thêm giỏ hàng");
  }

  const normalizedColor = String(color || "Mặc định").trim() || "Mặc định";
  const normalizedQuantity = Math.max(1, Number(quantity || 1));
  const guestItemId = `guest-${productId}-${normalizedColor}`.replace(/\s+/g, "-");
  const guestItems = getGuestCartItems();
  const existingIndex = guestItems.findIndex((item) => item._id === guestItemId);
  const cartProduct = normalizeCartProduct(itemProduct);

  if (existingIndex >= 0) {
    guestItems[existingIndex].quantity = Number(guestItems[existingIndex].quantity || 0) + normalizedQuantity;
    saveGuestCartItems(guestItems);
    return { message: "Thêm thành công", data: guestItems[existingIndex] };
  }

  const newItem = {
    _id: guestItemId,
    product: cartProduct,
    quantity: normalizedQuantity,
    color: normalizedColor,
    size: size || undefined,
    isGuest: true,
  };

  guestItems.push(newItem);
  saveGuestCartItems(guestItems);
  return { message: "Thêm thành công", data: newItem };
};

export const updateClientCartItem = async ({ cartItemId, quantity }) => {
  const user = getStoredUser();

  if (user?._id) {
    const res = await Axios.patch(`/cart/${cartItemId}`, { quantity });
    return res.data;
  }

  const guestItems = getGuestCartItems();
  const itemIndex = guestItems.findIndex((item) => item._id === cartItemId);

  if (itemIndex === -1) {
    throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
  }

  const normalizedQuantity = Number(quantity);
  if (!Number.isFinite(normalizedQuantity) || normalizedQuantity < 0) {
    throw new Error("Số lượng không hợp lệ");
  }

  if (normalizedQuantity <= 0) {
    guestItems.splice(itemIndex, 1);
  } else {
    guestItems[itemIndex].quantity = normalizedQuantity;
  }

  saveGuestCartItems(guestItems);
  return { message: "Cập nhật thành công", data: guestItems[itemIndex] || null };
};

export const removeClientCartItem = async (cartItemId) => {
  const user = getStoredUser();

  if (user?._id) {
    const res = await Axios.delete(`/cart/${cartItemId}`);
    return res.data;
  }

  const guestItems = getGuestCartItems();
  const nextItems = guestItems.filter((item) => item._id !== cartItemId);
  saveGuestCartItems(nextItems);
  return { message: "Xóa thành công" };
};

export const clearClientCart = async () => {
  const user = getStoredUser();

  if (user?._id) {
    const res = await Axios.delete(`/carts/${user._id}`);
    return res.data;
  }

  saveGuestCartItems([]);
  return { message: "Xóa thành công" };
};

export const createClientOrder = async (payload) => {
  const userId = getRequiredUserId();
  const res = await Axios.post(`/order`, {
    ...payload,
    userId,
  });
  return res.data;
};

export const getClientOrders = async () => {
  const userId = getRequiredUserId();
  const res = await Axios.get(`/order/user/${userId}`);
  return res.data;
};

export const getClientProfile = async () => {
  const user = getStoredUser();

  if (!user?._id) {
    return {};
  }

  const res = await Axios.get(`/user/${user._id}`);
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
