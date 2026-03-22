import { Link } from "react-router-dom";

const ClientFooter = () => {
  return (
    <footer className="mt-10 border-t border-blue-200 bg-gradient-to-r from-blue-700 to-blue-800 text-blue-50">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4">
        <section>
          <h3 className="mb-3 text-base font-semibold text-white">Văn Phòng Phẩm</h3>
          <p className="text-sm text-blue-100">
            Chuyên cung cấp văn phòng phẩm chính hãng cho cá nhân, trường học và doanh nghiệp.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-base font-semibold text-white">Điều hướng</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li><Link to="/client/products" className="hover:text-white">Trang chủ</Link></li>
            <li><Link to="/client/products" className="hover:text-white">Sản phẩm</Link></li>
            <li><Link to="/client/cart" className="hover:text-white">Giỏ hàng</Link></li>
            <li><Link to="/client/orders" className="hover:text-white">Đơn hàng của tôi</Link></li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-base font-semibold text-white">Chính sách</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo mật</li>
            <li>Điều khoản sử dụng</li>
            <li>Vận chuyển & giao nhận</li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-base font-semibold text-white">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>Hotline: 0900 000 000</li>
            <li>Email: support@vanphongpham.vn</li>
            <li>Địa chỉ: Nhổn, Bắc Từ Liêm, Hà Nội</li>
          </ul>
          <div className="mt-3 flex items-center gap-3 text-orange-300">
            <i className="fa-brands fa-facebook" />
            <i className="fa-brands fa-instagram" />
            <i className="fa-brands fa-youtube" />
            <i className="fa-brands fa-tiktok" />
          </div>
        </section>
      </div>

      <div className="border-t border-blue-600 py-4 text-center text-sm text-blue-100">
        © {new Date().getFullYear()} Văn Phòng Phẩm. All rights reserved.
      </div>
    </footer>
  );
};

export default ClientFooter;
