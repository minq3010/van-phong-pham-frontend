import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  Switch,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "../../../Apis/Api.jsx";
import { useCategory } from "../../../Hook/useCategory.jsx";
import { useDetailProduct } from "../../../Hook/useDetailProduct.jsx";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("Chỉ có thể upload file JPG/PNG!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Ảnh phải nhỏ hơn 2MB!");
    return false;
  }
  return true;
};

const UpdateProduct = () => {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const { category, isCategory } = useCategory();
  const { detailProduct, isDetailProduct } = useDetailProduct();
  const idAdmin = JSON.parse(localStorage.getItem("user"));
  const [status, setStatus] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const onChangeStatus = (checked) => {
    setStatus(checked);
  };

  // Load dữ liệu từ detailProduct vào form
  useEffect(() => {
    if (detailProduct && detailProduct.data) {
      const product = detailProduct.data;

      // Set giá trị cho các field trong form
      form.setFieldsValue({
        name: product.name || "",
        price: product.price || "",
        discount: product.discount || "",
        caterori: product.caterori?._id || product.caterori || undefined,
        description: product.description || "",
        quantity: product.quantity || "",
        variants: product.variants ,
      });

      // Set ảnh từ bumImage (album images)
      if (product.abumImage && Array.isArray(product.abumImage)) {
        const images = product.abumImage.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.png`,
          status: "done",
          url: url,
        }));
        setFileList(images);
      }

      // Set status
      setStatus(product?.status ?? true);
    }
  }, [detailProduct, form]);

  const validateFileList = () => {
    if (fileList.length < 1) {
      return Promise.reject(new Error("Vui lòng upload ít nhất 1 ảnh"));
    }
    if (fileList.length > 5) {
      return Promise.reject(new Error("Chỉ được upload tối đa 5 ảnh"));
    }
    return Promise.resolve();
  };

  const onhandluploadimg = (e) => {
    let newFileList = [...e.fileList];

    // Nếu upload thành công, cập nhật URL
    newFileList = newFileList.map((file) => {
      if (file.response && file.response.secure_url) {
        file.url = file.response.secure_url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["detailProduct", id] });
      message.success("Cập nhật sản phẩm thành công!");
      navigate("/products");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Có lỗi xảy ra!";
      message.error(errorMessage);
    },
  });

  const onSubmit = (values) => {
    if (fileList.length < 1) {
      message.error("Vui lòng upload ít nhất 1 ảnh sản phẩm!");
      return;
    }

    // Lấy danh sách URL từ fileList
    const bumImage = fileList
      .map((file) => file.url || file.response?.secure_url)
      .filter(Boolean);

    // Ảnh đại diện là ảnh đầu tiên
    const imageUrl = bumImage[0];

    const productData = {
      ...values,
      bumImage: bumImage,
      imageUrl: imageUrl,
      status: status,
      updatedBy: idAdmin._id,
    };

    mutate(productData);
  };

  if (isCategory || isDetailProduct) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="grid grid-cols-12 gap-4 px-4">
      <section className="col-span-12">
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <section
            className="bg-white mt-10 px-4 rounded-xl py-4"
            style={{ boxShadow: "0px 0px 4px 1px #d1d1d1" }}
          >
            <div className="text-[1.5rem] font-bold mb-4">Thông tin cơ bản</div>

            {/* Upload Ảnh */}
            <div className="grid grid-cols-12 mb-4 gap-4">
              <div className="flex gap-1 mb-2 col-span-2 justify-end items-start pt-2">
                <span className="text-red-500">*</span>
                <div className="text-[1rem]">Album Ảnh</div>
              </div>
              <div className="col-span-10">
                <Form.Item
                  className="col-span-10 mt-4"
                  rules={[
                    {
                      validator: validateFileList,
                    },
                  ]}
                >
                  <Upload
                    action={
                      "https://api.cloudinary.com/v1_1/dkrcsuwbc/image/upload"
                    }
                    listType="picture-card"
                    fileList={fileList}
                    data={{
                      upload_preset: "image1",
                    }}
                    accept="image/*"
                    beforeUpload={beforeUpload}
                    maxCount={5}
                    onChange={onhandluploadimg}
                    onRemove={(file) => {
                      const newFileList = fileList.filter(
                        (item) => item.uid !== file.uid
                      );
                      setFileList(newFileList);
                    }}
                  >
                    {fileList.length < 5 && (
                      <button
                        style={{
                          border: 0,
                          background: "none",
                        }}
                        type="button"
                      >
                        +
                        <div
                          style={{
                            marginTop: 8,
                            color: "red",
                          }}
                        >
                          Ảnh {fileList.length} / 5
                        </div>
                      </button>
                    )}
                  </Upload>
                </Form.Item>
              </div>
            </div>

            {/* Ảnh đại diện (ảnh đầu tiên) */}
            <div className="grid grid-cols-12 mb-4 gap-4">
              <div className="flex gap-1 mb-2 col-span-2 justify-end items-start pt-2">
                <span className="text-red-500">*</span>
                <div className="text-[1rem]">Ảnh đại diện</div>
              </div>
              <div className="col-span-10">
                <Form.Item>
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    disabled
                  >
                    {fileList.length >= 1 && (
                      <img
                        draggable={false}
                        src={fileList[0].url}
                        alt="avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Upload>
                  <div className="text-gray-500 text-sm mt-2">
                    Ảnh đầu tiên trong album sẽ là ảnh đại diện
                  </div>
                </Form.Item>
              </div>
            </div>

            {/* Tên sản phẩm & Ngành hàng */}
            <div className="grid grid-cols-12 gap-4 mb-2">
              <div className="text-[1rem] col-span-2 text-right pt-2">
                <span className="text-red-500">*</span> Tên
              </div>
              <Form.Item
                className="col-span-4 mb-0"
                name="name"
                rules={[
                  { required: true, message: "Tên sản phẩm là bắt buộc!" },
                  { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
                  { max: 255, message: "Tên không quá 255 ký tự!" },
                ]}
              >
                <Input size="large" placeholder="Nhập tên sản phẩm" />
              </Form.Item>
              <div className="text-[1rem] col-span-2 text-left pt-2">
                <span className="text-red-500">*</span> Ngành hàng
              </div>
              <Form.Item
                className="col-span-4 mb-0"
                name="caterori"
                rules={[
                  { required: true, message: "Vui lòng chọn ngành hàng!" },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Chọn ngành hàng"
                  options={category?.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </div>

            {/* Giá & Giảm giá */}
            <div className="grid grid-cols-12 gap-4 mb-2">
              <div className="text-[1rem] col-span-2 text-right pt-2">
                <span className="text-red-500"></span>Giảm Giá
              </div>
              <Form.Item
                className="col-span-4 mb-0"
                name="discount"
                rules={[
                  {
                    pattern: /^[0-9]+$/,
                    message: "Giảm giá phải là số!",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const numValue = Number(value);
                      if (numValue < 0) {
                        return Promise.reject(
                          new Error("Giảm giá phải lớn hơn hoặc bằng 0")
                        );
                      }
                      if (numValue > 99) {
                        return Promise.reject(
                          new Error("Giảm giá phải nhỏ hơn hoặc bằng 99")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Nhập giảm giá (%)"
                  type="number"
                  min={0}
                  max={99}
                />
              </Form.Item>
            </div>
            {/* Mô tả */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="text-[1rem] col-span-2 text-right pt-2">
                <span className="text-red-500">*</span> Mô tả
              </div>
              <Form.Item
                name="description"
                className="col-span-10 mb-0"
                rules={[
                  { required: true, message: "Mô tả là bắt buộc!" },
                  { min: 100, message: "Mô tả phải có ít nhất 100 ký tự!" },
                  { max: 250, message: "Mô tả không quá 250 ký tự!" },
                ]}
              >
                <TextArea
                  rows={5}
                  placeholder="Nhập mô tả sản phẩm"
                  style={{ resize: "none" }}
                  showCount
                  maxLength={250}
                />
              </Form.Item>
            </div>

            {/* Trạng thái */}
            <div className="grid grid-cols-12 gap-4">
              <div className="text-[1rem] col-span-2 text-right">
                Trạng thái
              </div>
              <div className="col-span-10">
                <Switch checked={status} onChange={onChangeStatus} />
                <span className="ml-2 text-gray-600">
                  {status ? "Đang hoạt động" : "Ngừng hoạt động"}
                </span>
              </div>
            </div>
          </section>

          <div
            className=" bg-white p-3 rounded-lg mt-4 mb-4"
            style={{ boxShadow: "rgb(209, 209, 209) 0px 0px 4px 1px" }}
          >
            <div className="flex justify-between">
              <h1 className="text-[1.5rem] font-bold mb-4">
                Biến thể sản phẩm
              </h1>
              <Button
                type="dashed"
                onClick={() =>
                  form.setFieldsValue({
                    variants: [
                      ...(form.getFieldValue("variants") || []),
                      { color: null, price: "", quantity: "" },
                    ],
                  })
                }
              >
                Thêm biến thể
              </Button>
            </div>
            <Form.List name="variants">
              {(fields, { remove }) => (
                <>
                  <div className="flex flex-col gap-4 mt-4">
                    {fields.map(({ key, name }) => (
                      <div key={key} className="flex items-start gap-4">
                        {/* Màu */}
                        <Form.Item
                          name={[name, "color"]}
                          rules={[
                            { required: true, message: "Vui lòng chọn màu" },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const variants =
                                  getFieldValue("variants") || [];
                                const colors = variants
                                  .map((v) => v?.color)
                                  .filter(Boolean);
                                const duplicate =
                                  colors.filter((c) => c === value).length > 1;

                                if (duplicate) {
                                  return Promise.reject("Màu không được trùng");
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <Select
                            placeholder="Chọn màu"
                            style={{ width: 200 }}
                            options={[
                              { value: "Đen", label: "Đen" },
                              { value: "Nâu", label: "Nâu" },
                              { value: "Trắng", label: "Trắng" },
                              { value: "Xám", label: "Xám" },
                            ]}
                          />
                        </Form.Item>

                        {/* Giá */}
                        <Form.Item
                          name={[name, "price"]}
                          rules={[
                            { required: true, message: "Nhập giá" },
                            {
                              validator(_, value) {
                                if (value > 0) return Promise.resolve();
                                return Promise.reject("Giá phải lớn hơn 0");
                              },
                            },
                          ]}
                        >
                          <Input type="number" placeholder="Giá" />
                        </Form.Item>

                        {/* Số lượng */}
                        <Form.Item
                          name={[name, "quantity"]}
                          rules={[
                            { required: true, message: "Nhập số lượng" },
                            {
                              validator(_, value) {
                                if (value >= 0) return Promise.resolve();
                                return Promise.reject("Số lượng ≥ 0");
                              },
                            },
                          ]}
                        >
                          <Input type="number" placeholder="Số lượng" />
                        </Form.Item>

                        {/* Xóa */}
                        {fields.length > 1 && (
                          <Button danger onClick={() => remove(name)}>
                            Xóa
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Form.List>
          </div>

          {/* Buttons */}
          <div
            className="flex gap-4 justify-end bg-white p-3 rounded-lg mt-4 mb-4"
            style={{ boxShadow: "rgb(209, 209, 209) 0px 0px 4px 1px" }}
          >
            <Link
              to="/products"
              className="py-2 px-6 bg-white border-2 border-[#EBEBEB] rounded-lg text-black hover:bg-gray-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-6 bg-red-600 border-2 border-red-400 rounded-lg text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spin size="small" /> : "Cập nhật"}
            </button>
          </div>
        </Form>
      </section>
    </section>
  );
};

export default UpdateProduct;
