import { useMutation, useQueryClient } from "react-query";
import { updateUser } from "../Apis/Api";
import { message } from "antd";
import useAuth from "./useAuth";

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();
  const { mutate, isLoading: isLoadingUser } = useMutation({
    mutationFn: (data) => updateUser(data, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      message.success("Thành công");
    },
  });
  return { mutate, isLoadingUser };
};

export default useUpdateUser;
