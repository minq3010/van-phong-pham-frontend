import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { addUsers, updateUsers } from "../Apis/Api";

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ id, data }) => updateUsers(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      message.success("User update successfully");
    },
    onError: () => {
      message.error("User not update");
    },
  });
  return { mutate, isLoading };
};
const useAddUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => addUsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
        message.success("User create successfully");
    },
    onError: (error) => {
      console.log(error);
      message.error(error.response.data.message);
    },
  });
  return { mutate, isLoading };
};
export { useAddUser, useUpdateUser };
