const parseValidDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const FormatPrice = ({ price }) => {
  const formatprice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
  return formatprice;
};
const FormatDate = ({ date }) => {
  const parsedDate = parseValidDate(date);

  if (!parsedDate) {
    return "Không có dữ liệu";
  }

  const formatDate = new Intl.DateTimeFormat("vi-VN").format(parsedDate);
  return formatDate;
};
const FormatDateTime = ({ dateString }) => {
  const parsedDate = parseValidDate(dateString);

  if (!parsedDate) return <span>Không có dữ liệu</span>;

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    timeStyle: "medium",
  }).format(parsedDate);

  return <span>{formattedDate}</span>;
};

export { FormatPrice, FormatDate, FormatDateTime };
