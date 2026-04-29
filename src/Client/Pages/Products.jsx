import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { message } from "antd";
import { Link } from "react-router-dom";
import { addToClientCart, getClientProducts } from "../../Apis/Api.jsx";
import { formatCurrency } from "../utils/format";
import Breadcrumb from "../components/navigation/Breadcrumb.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";

const ClientProducts = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["client-products"], getClientProducts);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortType, setSortType] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const { mutate: addToCart, isLoading: isAdding } = useMutation({
    mutationFn: addToClientCart,
    onSuccess: () => {
      message.success("Đã thêm vào giỏ hàng");
      queryClient.invalidateQueries(["client-cart"]);
      queryClient.invalidateQueries(["client-cart-count"]);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Không thể thêm giỏ hàng");
    },
  });

  const products = Array.isArray(data?.data) ? data.data.filter((item) => item.status === true) : [];
  const bannerProducts = useMemo(() => products.slice(0, 5), [products]);
  const categories = useMemo(() => {
    const values = products
      .map((item) => item?.caterori?.name)
      .filter((name) => Boolean(name && name.trim()));

    return Array.from(new Set(values));
  }, [products]);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);
  const flashSaleProducts = useMemo(() => {
    const discountRows = products.filter((item) => Number(item.discount || 0) > 0);
    return discountRows.length > 0 ? discountRows.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    let rows = [...products];

    if (keyword) {
      rows = rows.filter(
        (item) =>
          item.name?.toLowerCase().includes(keyword) ||
          item.description?.toLowerCase().includes(keyword)
      );
    }

    if (selectedCategory !== "all") {
      rows = rows.filter((item) => item?.caterori?.name === selectedCategory);
    }

    rows.sort((left, right) => {
      if (sortType === "price-asc") {
        return Number(left.price || 0) - Number(right.price || 0);
      }
      if (sortType === "price-desc") {
        return Number(right.price || 0) - Number(left.price || 0);
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

    return rows;
  }, [products, searchKeyword, selectedCategory, sortType]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, totalPages]);

  useEffect(() => {
    if (bannerProducts.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % bannerProducts.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [bannerProducts]);

  useEffect(() => {
    if (activeBannerIndex >= bannerProducts.length && bannerProducts.length > 0) {
      setActiveBannerIndex(0);
    }
  }, [activeBannerIndex, bannerProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedCategory, sortType]);

  const handleQuickBuy = (item) => {
    const defaultColor = item?.variants?.find((variant) => variant.status)?.color || "Mặc định";

    addToCart({
      productId: item._id,
      quantity: 1,
      color: defaultColor,
      product: item,
    });
  };

  if (isLoading) {
    return <div className="py-10 text-center text-blue-600">Đang tải sản phẩm...</div>;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/client/products" },
          { label: "Sản phẩm" },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-blue-900">Trang chủ sản phẩm</h1>
      </div>

      {bannerProducts.length > 0 && (
        <section className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="relative h-[260px] w-full sm:h-[320px]">
            {bannerProducts.map((item, index) => {
              const isActive = index === activeBannerIndex;

              return (
                <article
                  key={item._id}
                  className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                >
                  <img
                    src={item.imageUrl || "https://placehold.co/1200x500?text=Banner"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-blue-700/20" />
                  <div className="absolute inset-0 flex items-end p-5 sm:items-center sm:p-8">
                    <div className="max-w-xl text-white">
                      <p className="mb-2 inline-flex rounded-full bg-orange-500/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        Khuyến mãi nổi bật
                      </p>
                      <h2 className="mb-2 line-clamp-2 text-2xl font-bold sm:text-3xl">{item.name}</h2>
                      <p className="mb-4 line-clamp-2 text-sm text-slate-100 sm:text-base">
                        {item.description || "Bộ sưu tập văn phòng phẩm chất lượng cho doanh nghiệp và học tập."}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-bold sm:text-xl">{formatCurrency(item.price)}</span>
                        <button
                          type="button"
                          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                          onClick={() => handleQuickBuy(item)}
                          disabled={isAdding}
                        >
                          Mua nhanh
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {bannerProducts.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveBannerIndex((prev) =>
                      prev === 0 ? bannerProducts.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-blue-700"
                >
                  <i className="fa-solid fa-chevron-left text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveBannerIndex((prev) => (prev + 1) % bannerProducts.length)
                  }
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-blue-700"
                >
                  <i className="fa-solid fa-chevron-right text-xs" />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  {bannerProducts.map((item, index) => (
                    <button
                      key={`dot-${item._id}`}
                      type="button"
                      className={`h-2.5 rounded-full transition-all ${index === activeBannerIndex ? "w-6 bg-white" : "w-2.5 bg-white/60"}`}
                      onClick={() => setActiveBannerIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-blue-900">Giao nhanh toàn quốc</p>
          <p className="text-sm text-blue-700">Xử lý đơn trong ngày, theo dõi trạng thái giao hàng rõ ràng.</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-sky-50 p-4 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-blue-900">Sản phẩm chính hãng</p>
          <p className="text-sm text-blue-700">Danh mục văn phòng phẩm phong phú, giá minh bạch.</p>
        </div>
        <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-orange-700">Hỗ trợ doanh nghiệp</p>
          <p className="text-sm text-orange-700">Đặt mua số lượng lớn, theo dõi lịch sử đơn hàng dễ dàng.</p>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-900">Danh mục chính</h2>
          <Link to="/client/products" className="text-sm font-semibold text-blue-700">
            Xem tất cả
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium ${selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-white text-blue-700 border border-blue-200"}`}
            onClick={() => setSelectedCategory("all")}
          >
            Tất cả
          </button>
          {categories.map((categoryName) => (
            <button
              key={categoryName}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium ${selectedCategory === categoryName ? "bg-blue-600 text-white" : "bg-white text-blue-700 border border-blue-200"}`}
              onClick={() => setSelectedCategory(categoryName)}
            >
              {categoryName}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-900">Sản phẩm nổi bật</h2>
          <span className="text-sm text-blue-600">Bán chạy tuần này</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((item) => (
            <ProductCard key={`featured-${item._id}`} product={item} onAddToCart={handleQuickBuy} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-orange-200 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-3">
          <h2 className="text-xl font-bold text-orange-700">Flash sale / deal hot</h2>
          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">Hot deal</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flashSaleProducts.map((item) => (
            <ProductCard key={`flash-${item._id}`} product={item} onAddToCart={handleQuickBuy} />
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-blue-700">Tìm kiếm</label>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
              <input
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm theo tên sản phẩm..."
                className="w-full rounded-md border border-blue-200 py-2 pl-9 pr-3 outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-700">Lọc danh mục</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((categoryName) => (
                <option key={`opt-${categoryName}`} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-700">Sắp xếp</label>
            <select
              value={sortType}
              onChange={(event) => setSortType(event.target.value)}
              className="w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:border-blue-400"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-900">Danh sách sản phẩm</h2>
          <span className="text-sm text-blue-600">{filteredProducts.length} sản phẩm</span>
        </div>

        {pagedProducts.length === 0 ? (
          <div className="rounded-lg border border-blue-100 bg-white p-8 text-center text-blue-600">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pagedProducts.map((item) => (
              <ProductCard key={item._id} product={item} onAddToCart={handleQuickBuy} />
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="rounded-md border border-blue-200 px-3 py-2 text-sm text-blue-700 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={`page-${pageNumber}`}
              type="button"
              className={`h-9 w-9 rounded-md text-sm ${currentPage === pageNumber ? "bg-blue-600 text-white" : "border border-blue-200 text-blue-700"}`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            className="rounded-md border border-blue-200 px-3 py-2 text-sm text-blue-700 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
          >
            Sau
          </button>
        </div>
      </section>

      {products.length === 0 ? (
        <div className="rounded-lg border border-blue-100 bg-white p-8 text-center text-blue-600">Chưa có sản phẩm.</div>
      ) : null}

      <section className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white">
        <h2 className="mb-2 text-2xl font-bold">CTA: Sẵn sàng mua sắm?</h2>
        <p className="mb-4 text-sm text-blue-100">
          Khám phá thêm hàng trăm sản phẩm văn phòng phẩm và thiết bị học tập dành cho mọi nhu cầu.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/client/products" className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            Xem thêm sản phẩm
          </Link>
          <Link to="/client/cart" className="rounded-md border border-white/50 px-4 py-2 text-sm font-semibold text-white">
            Mua ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ClientProducts;
