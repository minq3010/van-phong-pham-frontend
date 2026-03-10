import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  Switch,
  Upload,
  Typography,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { addProduct } from "../../../Apis/Api.jsx";
import { useCategory } from "../../../Hook/useCategory.jsx";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("Chỉ có thể upload file JPG/PNG!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Ảnh phải nhỏ hơn 2MB!");
    return Upload.LIST_IGNORE;
  }
  return false;
};

const normalizeFileList = (nextFileList) =>
  nextFileList.map((file) => {
    if (!file.url && file.originFileObj) {
      return {
        ...file,
        url: URL.createObjectURL(file.originFileObj),
      };
    }

    return file;
  });

const buildProductFormData = (values, fileList, status, userId) => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("caterori", values.caterori);
  formData.append("brand", values.brand || "");
  formData.append("origin", values.origin || "");
  formData.append("discount", values.discount || 0);
  formData.append("description", values.description);
  formData.append("status", String(status));
  formData.append("createdBy", userId || "");
  formData.append("variants", JSON.stringify(values.variants || []));

  fileList.forEach((file) => {
    if (file.originFileObj) {
      formData.append("images", file.originFileObj);
    }
  });

  return formData;
};

const AddProduct = () => {
  const [form] = Form.useForm();
  const { category, isCategory } = useCategory();
  const idAdmin = JSON.parse(localStorage.getItem("user"));

  const [fileList, setFileList] = useState([]);

  const [status, setStatus] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onChangeStatus = (checked) => {
    setStatus(checked);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success("Thêm sản phẩm thành công!");
      form.resetFields();
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
      message.warning("Sản phẩm đang được lưu mà chưa có ảnh.");
    }

    const productData = buildProductFormData(
      values,
      fileList,
      status,
      idAdmin?._id
    );

    mutate(productData);
  };

  const onhandluploadimg = (e) => {
    setFileList(normalizeFileList([...e.fileList]));
  };

  if (isCategory) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="grid grid-cols-12 gap-4">
      <section className="col-span-12">
        <Form
          form={form}
          onFinish={onSubmit}
          layout="vertical"
          initialValues={{
            variants: [{ color: null, price: "", quantity: "" }],
          }}
        >
          <section
            className="bg-white mt-10 px-4 rounded-xl py-4"
            style={{ boxShadow: "0px 0px 4px 1px #d1d1d1" }}
          >
            <div className="text-[1.5rem] font-bold mb-4">Thông tin cơ bản</div>

            {/* Upload Ảnh */}
            <div className="grid grid-cols-12 mb-4 gap-4">
              <div className="flex gap-1 mb-2 col-span-2 justify-end items-start pt-2">
                <div className="text-[1rem]">Abum Ảnh</div>
              </div>
              <div className="col-span-10">
                <Form.Item name="abumImage" className="col-span-10 mt-4">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    accept="image/*"
                    beforeUpload={beforeUpload}
                    maxCount={5}
                    onChange={(e) => onhandluploadimg(e)}
                    onRemove={(file) => {
                      setFileList((current) =>
                        current.filter((item) => item.uid !== file.uid)
                      );
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
                  <Typography.Text type="secondary">
                    Có thể bỏ trống ảnh khi tạo sản phẩm. Ảnh sẽ được lưu trong thư mục nội bộ của server.
                  </Typography.Text>
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-12 mb-4 gap-4">
              <div className="flex gap-1 mb-2 col-span-2 justify-end items-start pt-2">
                <div className="text-[1rem]">Ảnh</div>
              </div>
              <div className="col-span-10">
                <Form.Item>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    disabled
                  >
                    {fileList.length >= 1 && fileList[0]?.url && (
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
                </Form.Item>
              </div>
            </div>

            {/* Tên sản phẩm */}
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

            <div className="grid grid-cols-12 gap-4 mb-2">
              <div className="text-[1rem] col-span-2 text-right pt-2">
                Hãng sản xuất
              </div>
              <Form.Item
                className="col-span-4 mb-0"
                name="brand"
              >
                <Input size="large" placeholder="Nhập hãng sản xuất (VD: Thiên Long)" />
              </Form.Item>
              <div className="text-[1rem] col-span-2 text-left pt-2">
                Xuất xứ
              </div>
              <Form.Item
                className="col-span-4 mb-0"
                name="origin"
              >
                <Input size="large" placeholder="Nhập xuất xứ (VD: Việt Nam)" />
              </Form.Item>
            </div>

            {/* Giá */}

            <div className="grid grid-cols-12 gap-4 mb-2">
              <div className="text-[1rem] col-span-2 text-left pt-2">
                <div className="text-[1rem] col-span-2 text-right pt-2">
                  Giảm Giá
                </div>
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
                      if (numValue < 1) {
                        return Promise.reject(
                          new Error("Giảm giá phải lớn hơn hoặc bằng 1")
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
                  min={1}
                  max={99}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-2">
              {/* <div className="text-[1rem] col-span-2 text-right pt-2">
                <span className="text-red-500">*</span> Số lượng
              </div>
              <Form.Item
                className="col-span-4 mb-0"
                name="quantity"
                rules={[
                  { required: true, message: "Số lượng là bắt buộc!" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Số lượng phải là số!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Nhập Số lượng sản phẩm"
                  type="number"
                />
              </Form.Item> */}

              {/* <div className="text-[1rem] col-span-2 text-left pt-2">
                <span className="text-red-500">*</span> Giảm Giá
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
                      if (numValue < 1) {
                        return Promise.reject(
                          new Error("Giảm giá phải lớn hơn hoặc bằng 1")
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
                  min={1}
                  max={99}
                />
              </Form.Item> */}
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
            <div className="grid grid-cols-12 gap-4 ">
              <div className="text-[1rem] col-span-2 text-right ">
                Trạng thái
              </div>
              <div>
                <Switch
                  defaultChecked
                  defaultValue={status}
                  onChange={onChangeStatus}
                />
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
              {isLoading ? <Spin size="small" /> : "Lưu"}
            </button>
          </div>
        </Form>
      </section>
    </section>
  );
};

export default AddProduct;
