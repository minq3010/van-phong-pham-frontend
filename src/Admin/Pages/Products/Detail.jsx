import React, { useState } from "react";
import { useDetailProduct } from "../../../Hook/useDetailProduct";
import { Spin, Table } from "antd";
import { FormatDate, FormatPrice } from "../../../Format";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Detail = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { detailProduct, isDetailProduct } = useDetailProduct();

  if (isDetailProduct) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }
  const columns = [
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <FormatPrice price={text} />,
    },

    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
    },
  ];
  const data = detailProduct?.data?.variants.map((item) => ({
    color: item?.color,

    quantity: item.quantity,
    price: item.price,
  }));
  console.log(detailProduct.data.variants);
  // Lấy danh sách ảnh từ bumImage hoặc fallback về imageUrl
  const images =
    detailProduct?.data?.abumImage && detailProduct.data.abumImage.length > 0
      ? detailProduct.data.abumImage
      : detailProduct?.data?.imageUrl
        ? [detailProduct.data.imageUrl]
        : [];
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <div className="row gx-lg-5">
              <div className="col-xl-4 col-md-8 mx-auto">
                <div className="product-img-slider sticky-side-div">
                  {/* Main Product Slider */}
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Thumbs]}
                      navigation={{
                        prevEl: ".custom-prev",
                        nextEl: ".custom-next",
                      }}
                      loop
                      thumbs={{ swiper: thumbsSwiper }}
                      className="product-thumbnail-slider p-2 rounded bg-light"
                    >
                      {detailProduct?.data?.abumImage?.map((img, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="img-fluid d-block w-full object-cover"
                            style={{ maxHeight: "500px" }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Navigation Buttons - Only show if more than 1 image */}
                    {detailProduct?.data?.abumImage.length > 1 && (
                      <>
                        <button className="custom-prev absolute top-1/2 -translate-y-1/2 left-2 z-50 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all">
                          <FaChevronLeft className="text-xl" />
                        </button>
                        <button className="custom-next absolute top-1/2 -translate-y-1/2 right-2 z-50 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all">
                          <FaChevronRight className="text-xl" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation - Only show if more than 1 image */}
                  {images.length >= 1 && (
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      slidesPerView={4}
                      spaceBetween={10}
                      watchSlidesProgress
                      className="product-nav-slider mt-2"
                    >
                      {images.map((img, index) => (
                        <SwiperSlide key={index} className="thumbnail-slide">
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="img-fluid d-block cursor-pointer rounded border hover:border-primary transition-all"
                            style={{ height: "80px", objectFit: "cover" }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              </div>
              {/* end col */}

              <div className="col-xl-8">
                <div className="mt-xl-0 mt-5">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h4 className="text-2xl mb-2 font-semibold">
                        {detailProduct?.data?.name}
                      </h4>
                      <div className="hstack text-[16px] mb-3 gap-3 flex-wrap">
                        <div className="text-muted">
                          Danh mục:{" "}
                          <span className="text-body fw-medium">
                            {detailProduct?.data?.caterori?.name}
                          </span>
                        </div>
                        <div className="vr" />
                        <div className="text-muted">
                          Ngày công khai:{" "}
                          <span className="text-body fw-medium">
                            {detailProduct?.data?.createdAt && (
                              <FormatDate date={detailProduct.data.createdAt} />
                            )}
                          </span>
                        </div>
                        <div className="vr" />
                        <div className="text-muted">
                          Trạng thái:{" "}
                          <span
                            className={`fw-medium ${detailProduct?.data?.status ? "text-success" : "text-danger"}`}
                          >
                            {detailProduct?.data?.status
                              ? "Đang hoạt động"
                              : "Ngừng hoạt động"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="mb-3">
                    {detailProduct?.data?.discount > 0 ? (
                      <div>
                        <h4 className="text-xl mb-2">
                          <span className="text-decoration-line-through text-muted me-2">
                            {detailProduct?.data?.price && (
                              <FormatPrice price={detailProduct.data.price} />
                            )}
                          </span>
                          <span className="badge bg-danger-subtle text-danger">
                            -{detailProduct.data.discount}%
                          </span>
                        </h4>
                        <h3 className="text-2xl text-danger fw-bold">
                          {detailProduct?.data?.price && (
                            <FormatPrice
                              price={
                                detailProduct.data.price *
                                (1 - detailProduct.data.discount / 100)
                              }
                            />
                          )}
                        </h3>
                      </div>
                    ) : (
                      <h4 className="text-xl">
                        Giá:{" "}
                        {detailProduct?.data?.price && (
                          <FormatPrice price={detailProduct.data.price} />
                        )}
                      </h4>
                    )}
                  </div>
                  <Table columns={columns} dataSource={data} />
                  {/* Description */}
                  <div className="mt-4 text-muted">
                    <h5 className="fs-14 fw-semibold">Mô tả:</h5>
                    <p className="text-justify">
                      {detailProduct?.data?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
