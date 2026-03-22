import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { addToClientCart, DetailProduct } from "../../Apis/Api.jsx";
import Breadcrumb from "../components/navigation/Breadcrumb.jsx";
import { formatCurrency } from "../utils/format";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewInput, setReviewInput] = useState("");
  const [wishlistVersion, setWishlistVersion] = useState(0);

  const { data, isLoading } = useQuery(["client-product-detail", id], () => DetailProduct(id), {
    enabled: Boolean(id),
  });

  const product = data?.data;

  const gallery = useMemo(() => {
    if (!product) {
      return [];
    }

    const baseImages = Array.isArray(product.abumImage)
      ? product.abumImage.filter(Boolean)
      : [];

    if (baseImages.length > 0) {
      return baseImages;
    }

    return product.imageUrl ? [product.imageUrl] : ["https://placehold.co/800x600?text=Product"];
  }, [product]);

  const availableVariants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants.filter((item) => item.status) : []),
    [product]
  );

  const selectedVariant = useMemo(() => {
    if (!availableVariants.length) {
      return null;
    }

    return (
      availableVariants.find((item) => item.color === selectedColor) ||
      availableVariants[0]
    );
  }, [availableVariants, selectedColor]);

  const currentStock = Number(selectedVariant?.quantity ?? product?.quantity ?? 0);
  const currentPrice = Number(selectedVariant?.price ?? product?.price ?? 0);

  const reviewsKey = `client_reviews_${id}`;
  const wishlistIds = useMemo(() => {
    try {
      const raw = localStorage.getItem("client_wishlist");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [wishlistVersion]);
  const isWishlist = wishlistIds.includes(id);
  const reviews = useMemo(() => {
    try {
      const raw = localStorage.getItem(reviewsKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [reviewsKey]);

  const { mutate: addCart, isLoading: addingCart } = useMutation({
    mutationFn: addToClientCart,
    onSuccess: () => {
      message.success("Đã thêm vào giỏ hàng");
      queryClient.invalidateQueries(["client-cart"]);
      queryClient.invalidateQueries(["client-cart-count"]);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Không thể thêm vào giỏ hàng");
    },
  });

  const handleAddToCart = () => {
    if (!product?._id) {
      return;
    }

    const color = selectedVariant?.color || "Mặc định";
    addCart({ productId: product._id, quantity, color });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/client/cart");
  };

  const handleSubmitReview = () => {
    if (!reviewInput.trim()) {
      message.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    const nextReviews = [
      {
        id: Date.now(),
        content: reviewInput.trim(),
        createdAt: new Date().toISOString(),
      },
      ...reviews,
    ];

    localStorage.setItem(reviewsKey, JSON.stringify(nextReviews));
    setReviewInput("");
    message.success("Đã gửi đánh giá");
    window.location.reload();
  };

  const handleToggleWishlist = () => {
    const nextRows = isWishlist
      ? wishlistIds.filter((itemId) => itemId !== id)
      : [...wishlistIds, id];

    localStorage.setItem("client_wishlist", JSON.stringify(nextRows));
    setWishlistVersion((prev) => prev + 1);
    message.success(isWishlist ? "Đã bỏ khỏi yêu thích" : "Đã thêm vào yêu thích");
  };

  if (isLoading) {
    return <div className="py-10 text-center text-slate-500">Đang tải chi tiết sản phẩm...</div>;
  }

  if (!product) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-slate-500">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/client/products" },
          { label: "Sản phẩm", to: "/client/products" },
          { label: product.name },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 rounded-xl border bg-white p-5 shadow-sm lg:grid-cols-2">
        <div>
          <div className="mb-3 overflow-hidden rounded-lg border">
            <img
              src={gallery[selectedImage]}
              alt={product.name}
              className="h-[320px] w-full object-cover sm:h-[420px]"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {gallery.map((image, index) => (
              <button
                key={`thumb-${index}`}
                type="button"
                className={`overflow-hidden rounded border ${selectedImage === index ? "border-slate-900" : "border-slate-200"}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`thumb-${index}`} className="h-16 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-sm text-slate-500">{product?.caterori?.name || "Danh mục"}</p>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(currentPrice)}</div>
          <p className="text-sm leading-6 text-slate-600">{product.description || "Không có mô tả chi tiết."}</p>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Màu sắc / biến thể</p>
            <div className="flex flex-wrap gap-2">
              {availableVariants.length > 0 ? (
                availableVariants.map((variant) => (
                  <button
                    key={variant.color}
                    type="button"
                    className={`rounded-full px-3 py-1 text-sm ${selectedVariant?.color === variant.color ? "bg-slate-900 text-white" : "border text-slate-700"}`}
                    onClick={() => setSelectedColor(variant.color)}
                  >
                    {variant.color}
                  </button>
                ))
              ) : (
                <span className="text-sm text-slate-500">Sản phẩm mặc định</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Số lượng</span>
            <div className="flex items-center gap-2 rounded-md border px-2 py-1">
              <button
                type="button"
                className="h-7 w-7 rounded border"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                className="h-7 w-7 rounded border"
                onClick={() => setQuantity((prev) => Math.min(currentStock || 1, prev + 1))}
              >
                +
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600">Tồn kho: <span className="font-semibold">{currentStock}</span></p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingCart || currentStock <= 0}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50"
            >
              Thêm vào giỏ
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={addingCart || currentStock <= 0}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Mua ngay
            </button>
          </div>

          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold ${isWishlist ? "border-red-200 bg-red-50 text-red-600" : "border-slate-300 text-slate-700"}`}
            onClick={handleToggleWishlist}
          >
            <i className={`${isWishlist ? "fa-solid" : "fa-regular"} fa-heart`} />
            {isWishlist ? "Đã yêu thích" : "Thêm vào wishlist"}
          </button>

        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Đánh giá & bình luận</h2>
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có đánh giá nào, hãy là người đầu tiên đánh giá sản phẩm.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-3 text-sm text-slate-700">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Khách hàng</span>
                    <span>{new Date(review.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                  <p>{review.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Viết review</label>
            <textarea
              value={reviewInput}
              onChange={(event) => setReviewInput(event.target.value)}
              rows={3}
              className="w-full rounded-md border px-3 py-2 outline-none focus:border-slate-500"
              placeholder="Chia sẻ trải nghiệm của bạn..."
            />
            <button
              type="button"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={handleSubmitReview}
            >
              Gửi đánh giá
            </button>
          </div>
        </article>

        <article className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Thông tin thêm</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Thương hiệu: {product.brand || "Đang cập nhật"}</li>
            <li>Xuất xứ: {product.origin || "Đang cập nhật"}</li>
            <li>Mã sản phẩm: {product._id}</li>
            <li>Vận chuyển: Giao nhanh toàn quốc</li>
          </ul>
        </article>
      </section>
    </div>
  );
};

export default ProductDetail;
