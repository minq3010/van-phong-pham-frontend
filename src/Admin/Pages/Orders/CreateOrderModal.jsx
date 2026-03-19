import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import OrderForm from "./OrderForm";

const CreateOrderModal = ({ open, onClose }) => {
  const [submitHandler, setSubmitHandler] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    if (!open) {
      setResetCounter((current) => current + 1);
    }
  }, [open]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("admin:create-order-modal-toggle", {
        detail: { open },
      })
    );

    return () => {
      if (open) {
        window.dispatchEvent(
          new CustomEvent("admin:create-order-modal-toggle", {
            detail: { open: false },
          })
        );
      }
    };
  }, [open]);

  return (
    <Modal
      title="Tạo đơn hàng mới"
      open={open}
      onCancel={onClose}
      onOk={() => submitHandler?.()}
      width={980}
      wrapClassName="admin-order-modal"
      okText="Tạo đơn"
      cancelText="Đóng"
      confirmLoading={isSubmitting}
      style={{ top: 24 }}
      destroyOnClose
    >
      <OrderForm
        onSubmitReady={setSubmitHandler}
        onSubmittingChange={setIsSubmitting}
        onSubmitSuccess={onClose}
        resetSignal={resetCounter}
      />
    </Modal>
  );
};

export default CreateOrderModal;