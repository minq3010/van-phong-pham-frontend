import { Spin } from "antd";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import "../../node_modules/nprogress/nprogress.css";
import PrivateRouter from "./PrivateRouter.jsx";
import Signin from "../Admin/Pages/Signin.jsx";
import Signup from "../Admin/Pages/Signup.jsx";
import VoucherList from "../Admin/Pages/Vouchers/VoucherList.jsx";
import CommentList from "../Admin/Pages/Comment/CommentList.jsx";
import CommentListProduct from "../Admin/Pages/Comment/CommentListProduct.jsx";
// Admin Pages
const LayoutAdmin = lazy(() => import("../Admin/Ui/Layout.jsx"));
const Dashboards = lazy(() => import("../Admin/Dashboards.jsx"));
const Products = lazy(() => import("../Admin/Pages/Products/Products.jsx"));
const AddProduct = lazy(() => import("../Admin/Pages/Products/AddProduct.jsx"));
const Detail_Product = lazy(() => import("../Admin/Pages/Products/Detail.jsx"));
const UpdateProduct = lazy(
  () => import("../Admin/Pages/Products/UpdateProduct.jsx")
);

const Customers = lazy(() => import("../Admin/Pages/User/Customers.jsx"));

const Orders = lazy(() => import("../Admin/Pages/Orders/Orders.jsx"));
const Order_Detail = lazy(
  () => import("../Admin/Pages/Orders/Order_Detail.jsx")
);

const Profile = lazy(() => import("../Admin/Pages/Profile.jsx"));

const Categories = lazy(
  () => import("../Admin/Pages/Categories/Categories.jsx")
);

const Error = lazy(() => import("../Ui/Error.jsx"));
const FullScreenButton = lazy(() => import("../Admin/Ui/FullScreen.jsx"));

const Router = () => {
  // ScrollToTop();
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          className="h-[50vh] mt-[100px] flex items-center justify-center w-full "
        />
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRouter>
              <LayoutAdmin />
            </PrivateRouter>
          }
        >
          <Route index element={<Dashboards />} />
          <Route path="products" element={<Products />} />
          <Route path="uppdateproduct/:id" element={<UpdateProduct />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="product_detail/:id" element={<Detail_Product />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<Customers />} />
          <Route path="order" element={<Orders />} />
          <Route path="order_detail/:id" element={<Order_Detail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="voucher" element={<VoucherList />} />
          <Route path="comment" element={<CommentListProduct />} />
          <Route path="commentdetail/:id" element={<CommentList />} />
          <Route path="fullscreen" element={<FullScreenButton />} />
          {/* <Route path="login/callback" element={<LoginCallback />} /> */}
        </Route>

        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        {/* Other Routes */}
        {/* <Route path="logout" element={<Logout />} /> */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
