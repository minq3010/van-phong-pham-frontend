import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getClientProducts } from "../../Apis/Api.jsx";
import Breadcrumb from "../components/navigation/Breadcrumb.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";

const Wishlist = () => {
  const { data } = useQuery(["client-products"], getClientProducts);

  const products = Array.isArray(data?.data) ? data.data : [];
  const wishlistIds = useMemo(() => {
    try {
      const raw = localStorage.getItem("client_wishlist");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const wishlistProducts = useMemo(
    () => products.filter((item) => wishlistIds.includes(item._id)),
    [products, wishlistIds]
  );

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/client/products" },
          { label: "Wishlist" },
        ]}
      />

      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">Sản phẩm yêu thích</h1>
        <Link to="/client/products" className="text-sm font-semibold text-orange-500 underline">
          Tiếp tục mua sắm
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="rounded-lg border border-blue-100 bg-white p-8 text-center text-blue-600">
          Bạn chưa có sản phẩm yêu thích nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistProducts.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
