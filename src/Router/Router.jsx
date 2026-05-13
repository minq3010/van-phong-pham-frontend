import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "../../node_modules/nprogress/nprogress.css";
import PrivateRouter from "./PrivateRouter.jsx";
import ClientPrivateRouter from "./ClientPrivateRouter.jsx";

// Lazy load tất cả các page
const LayoutAdmin = lazy(() => import("../Admin/Ui/Layout.jsx"));
const Dashboards = lazy(() => import("../Admin/Dashboards.jsx"));
const Signin = lazy(() => import("../Admin/Pages/Signin.jsx"));
const Signup = lazy(() => import("../Admin/Pages/Signup.jsx"));
const Products = lazy(() => import("../Admin/Pages/Products/Products.jsx"));
const AddProduct = lazy(() => import("../Admin/Pages/Products/AddProduct.jsx"));
const Detail_Product = lazy(() => import("../Admin/Pages/Products/Detail.jsx"));
const UpdateProduct = lazy(() => import("../Admin/Pages/Products/UpdateProduct.jsx"));
const AdminUsers = lazy(() => import("../Admin/Pages/User/AdminUsers.jsx"));
const ForgotPassword = lazy(() => import("../Admin/Pages/User/TwoStep.jsx"));
const Orders = lazy(() => import("../Admin/Pages/Orders/Orders.jsx"));
const WholesaleOrder = lazy(() => import("../Admin/Pages/Orders/WholesaleOrder.jsx"));
const Order_Detail = lazy(() => import("../Admin/Pages/Orders/Order_Detail.jsx"));
const Profile = lazy(() => import("../Admin/Pages/Profile.jsx"));
const Categories = lazy(() => import("../Admin/Pages/Categories/Categories.jsx"));
const VoucherList = lazy(() => import("../Admin/Pages/Vouchers/VoucherList.jsx"));
const CommentList = lazy(() => import("../Admin/Pages/Comment/CommentList.jsx"));
const CommentListProduct = lazy(() => import("../Admin/Pages/Comment/CommentListProduct.jsx"));
const Settings = lazy(() => import("../Admin/Pages/Settings/Settings.jsx"));
const Error = lazy(() => import("../Ui/Error.jsx"));
const FullScreenButton = lazy(() => import("../Admin/Ui/FullScreen.jsx"));
const ForceChangePassword = lazy(() => import("../Admin/Pages/ForceChangePassword.jsx"));
const ClientLayout = lazy(() => import("../Client/Ui/ClientLayout.jsx"));
const ClientProducts = lazy(() => import("../Client/Pages/Products.jsx"));
const ClientCart = lazy(() => import("../Client/Pages/Cart.jsx"));
const ClientCheckout = lazy(() => import("../Client/Pages/Checkout.jsx"));
const ClientOrdersHistory = lazy(() => import("../Client/Pages/OrdersHistory.jsx"));
const ClientOrderDetail = lazy(() => import("../Client/Pages/OrderDetail.jsx"));
const ClientProfile = lazy(() => import("../Client/Pages/Profile.jsx"));
const ClientProductDetail = lazy(() => import("../Client/Pages/ProductDetail.jsx"));
const ClientWishlist = lazy(() => import("../Client/Pages/Wishlist.jsx"));
const ClientSignup = lazy(() => import("../Client/Pages/Signup.jsx"));
const ClientPolicyDetail = lazy(() => import("../Client/Pages/PolicyDetail.jsx"));

// Spinner nhỏ dùng cho fallback từng page
const PageSpinner = () => (
  <div className="h-[60vh] flex items-center justify-center w-full">
    <div className="w-8 h-8 border-4 border-[#0AB39C] border-t-transparent rounded-full animate-spin" />
  </div>
);

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/client/products" replace />} />
      <Route
        path="/admin"
        element={
          <PrivateRouter>
            <Suspense fallback={<PageSpinner />}>
              <LayoutAdmin />
            </Suspense>
          </PrivateRouter>
        }
      >
        <Route index element={<Suspense fallback={<PageSpinner />}><Dashboards /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<PageSpinner />}><Products /></Suspense>} />
        <Route path="uppdateproduct/:id" element={<Suspense fallback={<PageSpinner />}><UpdateProduct /></Suspense>} />
        <Route path="addproduct" element={<Suspense fallback={<PageSpinner />}><AddProduct /></Suspense>} />
        <Route path="categories" element={<Suspense fallback={<PageSpinner />}><Categories /></Suspense>} />
        <Route path="product_detail/:id" element={<Suspense fallback={<PageSpinner />}><Detail_Product /></Suspense>} />
        <Route path="admins" element={<Suspense fallback={<PageSpinner />}><AdminUsers /></Suspense>} />
        <Route path="admins/:id" element={<Suspense fallback={<PageSpinner />}><AdminUsers /></Suspense>} />
        <Route path="order" element={<Suspense fallback={<PageSpinner />}><Orders /></Suspense>} />
        <Route path="wholesale-orders" element={<Suspense fallback={<PageSpinner />}><WholesaleOrder /></Suspense>} />
        <Route path="order_detail/:id" element={<Suspense fallback={<PageSpinner />}><Order_Detail /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<PageSpinner />}><Profile /></Suspense>} />
        <Route path="voucher" element={<Suspense fallback={<PageSpinner />}><VoucherList /></Suspense>} />
        <Route path="comment" element={<Suspense fallback={<PageSpinner />}><CommentListProduct /></Suspense>} />
        <Route path="commentdetail/:id" element={<Suspense fallback={<PageSpinner />}><CommentList /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageSpinner />}><Settings /></Suspense>} />
        <Route path="fullscreen" element={<Suspense fallback={<PageSpinner />}><FullScreenButton /></Suspense>} />
      </Route>

      <Route path="signin" element={<Suspense fallback={<PageSpinner />}><Signin /></Suspense>} />
      <Route path="signup" element={<Suspense fallback={<PageSpinner />}><Signup /></Suspense>} />
      <Route path="emailpassword" element={<Suspense fallback={<PageSpinner />}><ForgotPassword /></Suspense>} />
      <Route path="client/signin" element={<Navigate to="/signin" replace />} />
      <Route path="client/signup" element={<Suspense fallback={<PageSpinner />}><ClientSignup /></Suspense>} />
      <Route
        path="client"
        element={
          <Suspense fallback={<PageSpinner />}>
            <ClientLayout />
          </Suspense>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<Suspense fallback={<PageSpinner />}><ClientProducts /></Suspense>} />
        <Route path="products/:id" element={<Suspense fallback={<PageSpinner />}><ClientProductDetail /></Suspense>} />
        <Route path="policies/:slug" element={<Suspense fallback={<PageSpinner />}><ClientPolicyDetail /></Suspense>} />
        <Route path="cart" element={<Suspense fallback={<PageSpinner />}><ClientCart /></Suspense>} />
        <Route element={<ClientPrivateRouter />}>
          <Route path="checkout" element={<Suspense fallback={<PageSpinner />}><ClientCheckout /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageSpinner />}><ClientOrdersHistory /></Suspense>} />
          <Route path="orders/:id" element={<Suspense fallback={<PageSpinner />}><ClientOrderDetail /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={<PageSpinner />}><ClientProfile /></Suspense>} />
          <Route path="wishlist" element={<Suspense fallback={<PageSpinner />}><ClientWishlist /></Suspense>} />
        </Route>
      </Route>

      <Route path="force-change-password" element={<Suspense fallback={<PageSpinner />}><ForceChangePassword /></Suspense>} />
      <Route path="*" element={<Suspense fallback={<PageSpinner />}><Error /></Suspense>} />
    </Routes>
  );
};

export default Router;
