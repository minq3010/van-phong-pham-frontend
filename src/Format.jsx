const FormatPrice = ({ price }) => {
  const formatprice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
  return formatprice;
};
const FormatDate = ({ date }) => {
  const formatDate = new Intl.DateTimeFormat("vi-VN").format(new Date(date));
  return formatDate;
};
const FormatDateTime = ({ dateString }) => {
  
  if (!dateString) return <span>Không có dữ liệu</span>; // Kiểm tra nếu không có dữ liệu

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    timeStyle: "medium",
  }).format(new Date(dateString));

  return <span>{formattedDate}</span>; // Trả về JSX thay vì chuỗi
};

export { FormatPrice, FormatDate, FormatDateTime };
