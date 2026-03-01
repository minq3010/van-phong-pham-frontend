import { useQuery } from "react-query";
import { getUserToken } from "../Apis/Api";

const useAuth = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserToken(),
    enabled: !!token,
  });
  return { data, isLoading };
};

export default useAuth;
