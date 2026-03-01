import { useQuery } from "react-query";
import { detailUser } from "../Apis/Api.jsx";
import { useParams } from "react-router-dom";
const UseDetailUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => detailUser(),
  });
  return { data, isLoading };
};
const useDetailUserId = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => detailUser(id),
  });
  return { data, isLoading };
};
export { UseDetailUser, useDetailUserId };
