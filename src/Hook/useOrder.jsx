import { useMutation, useQuery, useQueryClient } from "react-query";

import { message } from "antd";
import { useParams } from "react-router-dom";
import {
  createAdminOrder,
  detailOrder,
  getOrdersAdmin,
  getProducts,
  getVouchers,
  udateStatusOrder,
} from "../Apis/Api.jsx";

const UseDetailOrder = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["order_id", id],
    queryFn: () => detailOrder(id),
    enabled: !!id,
    staleTime: 0, // Đảm bảo luôn fetch dữ liệu mới
    cacheTime: 0, // Không cache dữ liệu
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch, // Cho phép refetch thủ công khi cần
  };
};

const useOrder = ( filters = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order",  filters],
    queryFn: () => getOrdersAdmin( filters),
  });
  return { data, isLoading, isError, error };
};
// const deleteOrder=()=>{
//   const {mutate,isLoading}=useMutation({
//     mutationFn:(id)=>deleteOrder(id),
//   })
// }

const useStatusOrderAdmin = (id) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ id, data }) => udateStatusOrder(id, data),
    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["order_id", id] });
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });
  return { mutate, isLoading };
};

const useOrderFormOptions = () => {
  const productsQuery = useQuery({
    queryKey: ["order-form-products"],
    queryFn: () => getProducts(),
  });

  const vouchersQuery = useQuery({
    queryKey: ["order-form-vouchers"],
    queryFn: () => getVouchers(),
  });

  return {
    products: productsQuery.data?.data || [],
    vouchers: Array.isArray(vouchersQuery.data)
      ? vouchersQuery.data
      : vouchersQuery.data?.data || [],
    isLoading: productsQuery.isLoading || vouchersQuery.isLoading,
  };
};

const useCreateOrderAdmin = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => createAdminOrder(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["order-form-products"] });
      message.success(response?.message || "Tạo đơn hàng thành công");
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Tạo đơn hàng thất bại");
    },
  });

  return { mutate, isLoading };
};

export {
  UseDetailOrder,
  useOrder,
  useCreateOrderAdmin,
  useOrderFormOptions,
  useStatusOrderAdmin,

};
