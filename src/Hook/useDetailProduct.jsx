import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  DetailProduct,
} from "../Apis/Api";
const useDetailProduct = () => {
  const { id } = useParams();

  const { data: detailProduct, isLoading: isDetailProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => DetailProduct(id),
    enabled: !!id,
  });

  return { detailProduct, isDetailProduct };
};

export {
  useDetailProduct,
};
