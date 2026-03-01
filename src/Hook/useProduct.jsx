import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  // addProductGalleries,
  categoryProduct,
  forceDeleteProduct,
  getProducts,
} from "../Apis/Api";

export const useProduct = ( ) => {
  const { data: products, isLoading: isProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  return { products, isProducts };
};

export const useProducts = () => {
  const { data: products, isLoading: isProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  return { products, isProducts };
};
export const useCategoryProducts = () => {
  const { caterory } = useParams();

  const { data: categoryproducts, isLoading: iscategoryProducts } = useQuery({
    queryKey: ["product", caterory],
    queryFn: () => categoryProduct(caterory),
    enabled: !!caterory,
  });
  return { categoryproducts, iscategoryProducts };
};
export const useDeleteProduct = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (id) => forceDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success("Product deleted successfully");
      onSuccessCallback?.();
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });

  return { mutate, isLoading };
};
