import { Button, Empty, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const Emptys = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        // imageStyle={{ height: 60 }}
        className="flex flex-col items-center"
        description={<Typography.Text>No data</Typography.Text>}
      >
        <Button type="primary" onClick={() => navigate("/addproduct")}>
          Add Product
        </Button>
      </Empty>
    </div>
  );
};
export default Emptys;
