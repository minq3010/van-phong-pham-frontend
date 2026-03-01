import React from "react";
import { useQuery } from "react-query";
import { getOrderbystatus } from "../Apis/Api.jsx";
import { useParams } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user") || "null");
const UseOrderByStatus = () => {
  const { status } = useParams();
  const { data: orderbyStatus, isLoading: isLoadingOrderbyStatus } = useQuery({
    queryKey: ["order", status],
    queryFn: () => getOrderbystatus(status, user._id),
    enabled: !!user,
  });
  return { orderbyStatus, isLoadingOrderbyStatus };
};

export default UseOrderByStatus;
