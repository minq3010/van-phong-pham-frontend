export const calculateVoucherDiscount = (voucher, subtotal) => {
  const normalizedSubtotal = Math.max(0, Number(subtotal || 0));

  if (!voucher || normalizedSubtotal <= 0) {
    return 0;
  }

  const percentDiscount = Math.round(
    (normalizedSubtotal * Number(voucher.discount || 0)) / 100
  );
  const minimumDiscount = Math.max(0, Number(voucher.maxPriceDis || 0));

  return Math.min(
    Math.max(percentDiscount, minimumDiscount),
    normalizedSubtotal
  );
};
