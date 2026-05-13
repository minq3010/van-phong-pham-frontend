import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin, Tabs, Table, Modal, Switch } from "antd";
import instance from "../../../Apis/Axios.jsx";

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [navs, setNavs] = useState([]);
  const [policies, setPolicies] = useState([]);
  
  const [isNavModalVisible, setIsNavModalVisible] = useState(false);
  const [isPolicyModalVisible, setIsPolicyModalVisible] = useState(false);
  const [navForm] = Form.useForm();
  const [policyForm] = Form.useForm();
  const [editingNavId, setEditingNavId] = useState(null);
  const [editingPolicyId, setEditingPolicyId] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchNavs();
    fetchPolicies();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/store-setting");
      if (res.data && res.data.data) {
        form.setFieldsValue(res.data.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải thông tin cài đặt");
    } finally {
      setLoading(false);
    }
  };

  const fetchNavs = async () => {
    try {
      const res = await instance.get("/navigations");
      setNavs(res.data.data);
    } catch (error) {
      message.error("Lỗi khi tải điều hướng");
    }
  };

  const fetchPolicies = async () => {
    try {
      const res = await instance.get("/policies");
      setPolicies(res.data.data);
    } catch (error) {
      message.error("Lỗi khi tải chính sách");
    }
  };

  const onFinishGeneral = async (values) => {
    try {
      setLoading(true);
      await instance.put("/store-setting", values);
      message.success("Cập nhật thông tin cài đặt thành công");
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi cập nhật cài đặt");
    } finally {
      setLoading(false);
    }
  };

  // Nav Handlers
  const handleSaveNav = async (values) => {
    try {
      if (editingNavId) {
        await instance.put(`/navigations/${editingNavId}`, values);
        message.success("Cập nhật thành công");
      } else {
        await instance.post("/navigations", values);
        message.success("Thêm mới thành công");
      }
      setIsNavModalVisible(false);
      navForm.resetFields();
      setEditingNavId(null);
      fetchNavs();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleDeleteNav = async (id) => {
    try {
      await instance.delete(`/navigations/${id}`);
      message.success("Xóa thành công");
      fetchNavs();
    } catch (error) {
      message.error("Lỗi khi xóa");
    }
  };

  // Policy Handlers
  const handleSavePolicy = async (values) => {
    try {
      if (editingPolicyId) {
        await instance.put(`/policies/${editingPolicyId}`, values);
        message.success("Cập nhật thành công");
      } else {
        await instance.post("/policies", values);
        message.success("Thêm mới thành công");
      }
      setIsPolicyModalVisible(false);
      policyForm.resetFields();
      setEditingPolicyId(null);
      fetchPolicies();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleDeletePolicy = async (id) => {
    try {
      await instance.delete(`/policies/${id}`);
      message.success("Xóa thành công");
      fetchPolicies();
    } catch (error) {
      message.error("Lỗi khi xóa");
    }
  };

  const navColumns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Link", dataIndex: "link", key: "link" },
    { title: "Trạng thái", dataIndex: "isActive", key: "isActive", render: (isActive) => isActive ? "Hiển thị" : "Ẩn" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => {
            setEditingNavId(record._id);
            navForm.setFieldsValue(record);
            setIsNavModalVisible(true);
          }}>Sửa</Button>
          <Button size="small" danger onClick={() => handleDeleteNav(record._id)}>Xóa</Button>
        </div>
      )
    }
  ];

  const policyColumns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Trạng thái", dataIndex: "isActive", key: "isActive", render: (isActive) => isActive ? "Hiển thị" : "Ẩn" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => {
            setEditingPolicyId(record._id);
            policyForm.setFieldsValue(record);
            setIsPolicyModalVisible(true);
          }}>Sửa</Button>
          <Button size="small" danger onClick={() => handleDeletePolicy(record._id)}>Xóa</Button>
        </div>
      )
    }
  ];

  const items = [
    {
      key: "1",
      label: "Thông tin chung",
      children: (
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={onFinishGeneral}>
            <Form.Item label="Tên cửa hàng (App Name)" name="appName" rules={[{ required: true }]}>
              <Input placeholder="Văn Phòng Phẩm" />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Hotline" name="hotline" rules={[{ required: true }]}>
              <Input placeholder="0900 000 000" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input type="email" placeholder="support@vanphongpham.vn" />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address" rules={[{ required: true }]}>
              <Input placeholder="Nhổn, Bắc Từ Liêm, Hà Nội" />
            </Form.Item>
            <h5 className="mb-3 mt-4">Liên kết Mạng xã hội</h5>
            <Form.Item label="Facebook" name="facebook"><Input /></Form.Item>
            <Form.Item label="Instagram" name="instagram"><Input /></Form.Item>
            <Form.Item label="YouTube" name="youtube"><Input /></Form.Item>
            <Form.Item label="TikTok" name="tiktok"><Input /></Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
            </Form.Item>
          </Form>
        </Spin>
      )
    },
    {
      key: "2",
      label: "Điều hướng (Footer)",
      children: (
        <div>
          <Button type="primary" className="mb-4" onClick={() => {
            navForm.resetFields();
            navForm.setFieldsValue({ isActive: true });
            setEditingNavId(null);
            setIsNavModalVisible(true);
          }}>Thêm liên kết</Button>
          <Table dataSource={navs} columns={navColumns} rowKey="_id" pagination={false} />
        </div>
      )
    },
    {
      key: "3",
      label: "Chính sách (Footer)",
      children: (
        <div>
          <Button type="primary" className="mb-4" onClick={() => {
            policyForm.resetFields();
            policyForm.setFieldsValue({ isActive: true });
            setEditingPolicyId(null);
            setIsPolicyModalVisible(true);
          }}>Thêm chính sách</Button>
          <Table dataSource={policies} columns={policyColumns} rowKey="_id" pagination={false} />
        </div>
      )
    }
  ];

  return (
    <Card title="Quản lý giao diện & Cài đặt" className="m-4">
      <Tabs defaultActiveKey="1" items={items} />

      {/* Nav Modal */}
      <Modal
        title={editingNavId ? "Sửa liên kết" : "Thêm liên kết"}
        open={isNavModalVisible}
        onCancel={() => setIsNavModalVisible(false)}
        onOk={() => navForm.submit()}
      >
        <Form form={navForm} layout="vertical" onFinish={handleSaveNav}>
          <Form.Item label="Tên hiển thị" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Link URL" name="link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Policy Modal */}
      <Modal
        title={editingPolicyId ? "Sửa chính sách" : "Thêm chính sách"}
        open={isPolicyModalVisible}
        onCancel={() => setIsPolicyModalVisible(false)}
        onOk={() => policyForm.submit()}
        width={800}
      >
        <Form form={policyForm} layout="vertical" onFinish={handleSavePolicy}>
          <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Nội dung" name="content" rules={[{ required: true }]}>
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Settings;
