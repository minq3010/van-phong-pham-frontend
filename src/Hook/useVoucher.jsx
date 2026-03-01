import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createVoucher,
  deleteVoucher,
  getVoucherDetail,
  getVouchers,
  updateVoucher,
} from "../Apis/Api";

export const useVouchers = () => {
  const { data: vouchers, isLoading } = useQuery({
    queryKey: ["vouchers"],
    queryFn: () => getVouchers(),
  });

  return { vouchers, isLoading };
};

export const useVoucherDetail = (id) => {
  const { data: voucher, isLoading } = useQuery({
    queryKey: ["voucher", id],
    queryFn: () => getVoucherDetail(id),
    enabled: !!id,
  });

  return { voucher, isLoading };
};

export const useAddVoucher = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      message.success("Voucher added successfully");
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });

  return { mutate, isLoading };
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ id, ...data }) => updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      message.success("Voucher update successful");
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });

  return { mutate, isLoading };
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (id) => deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      message.success("Voucher deleted successfully");
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });

  return { mutate, isLoading };
};
