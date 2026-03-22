import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format";

const ProductCard = ({ product, onAddToCart }) => {
  const displayPrice = Number(product?.price || 0);

  return (
    <article className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:shadow-blue-100/70">
      <Link to={`/client/products/${product._id}`}>
        <img
          src={product.imageUrl || "https://placehold.co/600x400?text=Product"}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </Link>

      <div className="space-y-3 p-4">
        <Link to={`/client/products/${product._id}`} className="line-clamp-1 text-base font-semibold text-blue-900">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-blue-700">{product.description || "Không có mô tả"}</p>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-blue-900">{formatCurrency(displayPrice)}</p>
            {Number(product.discount || 0) > 0 && (
              <p className="text-xs font-medium text-red-500">Giảm {product.discount}%</p>
            )}
          </div>
          <span className="rounded-full bg-sky-100 px-2 py-1 text-xs text-blue-700">
            Tồn: {Number(product.quantity || 0)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/client/products/${product._id}`}
            className="rounded-md border border-blue-200 px-3 py-2 text-center text-sm font-medium text-blue-700"
          >
            Xem thêm
          </Link>
          <button
            type="button"
            className="rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
            onClick={() => onAddToCart(product)}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
