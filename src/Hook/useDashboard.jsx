import React from "react";
import { useQuery } from "react-query";
import { dashboard } from "../Apis/Api";

const useDashboard = ({ startdate, enddate }) => {
    const { data, isLoading } = useQuery({
      queryKey: ["dashboard", startdate, enddate],
      queryFn: () => dashboard(startdate, enddate),
    });
  
    return { data, isLoading };
  };
  

export default useDashboard;
