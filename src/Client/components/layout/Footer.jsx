import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../../../Apis/Axios.jsx";

const ClientFooter = () => {
  const [settings, setSettings] = useState({
    appName: "Văn Phòng Phẩm",
    description: "Chuyên cung cấp văn phòng phẩm chính hãng cho cá nhân, trường học và doanh nghiệp.",
    hotline: "0900 000 000",
    email: "support@vanphongpham.vn",
    address: "Nhổn, Bắc Từ Liêm, Hà Nội",
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: ""
  });
  
  const [navs, setNavs] = useState([]);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [resSettings, resNavs, resPolicies] = await Promise.all([
          instance.get("/store-setting"),
          instance.get("/navigations"),
          instance.get("/policies")
        ]);
        
        if (resSettings.data && resSettings.data.data) {
          setSettings(resSettings.data.data);
        }
        
        if (resNavs.data && resNavs.data.data) {
          setNavs(resNavs.data.data.filter(n => n.isActive));
        }

        if (resPolicies.data && resPolicies.data.data) {
          setPolicies(resPolicies.data.data.filter(p => p.isActive));
        }
      } catch (error) {
        console.error("Failed to fetch footer data", error);
      }
    };
    fetchFooterData();
  }, []);

  return (
    <footer className="mt-10 border-t border-blue-200 bg-gradient-to-r from-blue-700 to-blue-800 text-blue-50">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4">
        <section>
          <h3 className="mb-3 text-base font-semibold text-white">{settings.appName || "Văn Phòng Phẩm"}</h3>
          <p className="text-sm text-blue-100">
            {settings.description || "Chuyên cung cấp văn phòng phẩm chính hãng cho cá nhân, trường học và doanh nghiệp."}
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-base font-semibold text-white">Điều hướng</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            {navs.length > 0 ? (
              navs.map((nav) => (
                <li key={nav._id}>
                  <Link to={nav.link} className="hover:text-white">{nav.name}</Link>
                </li>
              ))
            ) : (
              <>
                <li><Link to="/client/products" className="hover:text-white">Trang chủ</Link></li>
                <li><Link to="/client/products" className="hover:text-white">Sản phẩm</Link></li>
                <li><Link to="/client/cart" className="hover:text-white">Giỏ hàng</Link></li>
                <li><Link to="/client/orders" className="hover:text-white">Đơn hàng của tôi</Link></li>
              </>
            )}
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-base font-semibold text-white">Chính sách</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            {policies.length > 0 ? (
              policies.map((policy) => (
                <li key={policy._id}>
                  <Link to={`/client/policies/${policy.slug}`} className="hover:text-white">{policy.title}</Link>
                </li>
              ))
            ) : (
              <>
                <li>Chính sách đổi trả</li>
                <li>Chính sách bảo mật</li>
                <li>Điều khoản sử dụng</li>
                <li>Vận chuyển & giao nhận</li>
              </>
            )}
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-base font-semibold text-white">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>Hotline: {settings.hotline}</li>
            <li>Email: {settings.email}</li>
            <li>Địa chỉ: {settings.address}</li>
          </ul>
          <div className="mt-3 flex items-center gap-3 text-orange-300">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-white">
                <i className="fa-brands fa-facebook" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
                <i className="fa-brands fa-instagram" />
              </a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} target="_blank" rel="noreferrer" className="hover:text-white">
                <i className="fa-brands fa-youtube" />
              </a>
            )}
            {settings.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noreferrer" className="hover:text-white">
                <i className="fa-brands fa-tiktok" />
              </a>
            )}
            {!settings.facebook && !settings.instagram && !settings.youtube && !settings.tiktok && (
               <>
                 <i className="fa-brands fa-facebook" />
                 <i className="fa-brands fa-instagram" />
                 <i className="fa-brands fa-youtube" />
                 <i className="fa-brands fa-tiktok" />
               </>
            )}
          </div>
        </section>
      </div>

      <div className="border-t border-blue-600 py-4 text-center text-sm text-blue-100">
        © {new Date().getFullYear()} {settings.appName || "Văn Phòng Phẩm"}. All rights reserved.
      </div>
    </footer>
  );
};

export default ClientFooter;
