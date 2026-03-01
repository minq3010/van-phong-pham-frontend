import { Navigate } from "react-router-dom";

const PrivateRouter = (props) => {
  const data = localStorage.getItem("auth_token");

  if (!data) {
    return <Navigate to="/signin" />;
  }
  return <div>{props.children}</div>;
};

export default PrivateRouter;
