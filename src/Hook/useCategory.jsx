import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addCategory,
  categoryForcedelete,
  getCategory,
  updateCategory,
} from "../Apis/Api";
const useCategory = () => {
  const { data: category, isLoading: isCategory } = useQuery({
    queryKey: ["category"],
    queryFn: () => getCategory(),
  });
  return { category, isCategory };
};
const useUpdateCategory = (setIsModalOpenUpdate) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data), // Ensure we receive both id and data in an object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      message.success("Catalog updated successfully");
      setIsModalOpenUpdate(false);
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });
  return { mutate, isLoading };
};

const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (id) => categoryForcedelete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      message.success(data.message);
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });
  return { mutate, isLoading };
};
const useAddCategory = (setIsModalOpenAdd) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      message.success("Category added successfully");
      setIsModalOpenAdd(false);
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });
  return { mutate, isLoading };
};

export { useAddCategory, useCategory, useDeleteCategory, useUpdateCategory };
