import { useQuery } from "react-query";
import { getCommentDetail, getComments } from "../Apis/Api";

export const useComments = () => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getComments(),
  });
  return { comments, isLoading };
};

export const useCommentDetail = (id) => {
  const { data: comment, isLoading } = useQuery({
    queryKey: ["comment", id],
    queryFn: () => getCommentDetail(id),
    enabled: !!id,
  }); 
  return { comment, isLoading };
};
