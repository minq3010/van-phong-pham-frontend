import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { message } from "antd";
import logo from "../../assets/images/logo.png";
import { askClientChatbot, getClientCart, logout } from "../../Apis/Api.jsx";
import { clearStoredAuth, getStoredToken, getStoredUser, isStoredTokenExpired } from "../../utils/auth";
import ClientFooter from "../components/layout/Footer.jsx";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap",
    isActive ? "bg-blue-600 text-white" : "bg-sky-100 text-blue-700 hover:bg-sky-200",
  ].join(" ");

const ClientLayout = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const token = getStoredToken();
  const isAuthenticated =
    Boolean(token) &&
    Boolean(user) &&
    !isStoredTokenExpired() &&
    user?.role !== "admin" &&
    user?.role !== "manage";
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatInputRef = useRef(null);
  const chatBottomRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome",
      role: "bot",
      text: "Xin chào! Mình có thể tư vấn sản phẩm, đơn hàng và khuyến mãi cho bạn.",
    },
  ]);

  const { data: cartData } = useQuery(["client-cart-count"], getClientCart, {
    staleTime: 30000,
  });

  const cartCount = useMemo(() => {
    const rows = Array.isArray(cartData?.data) ? cartData.data : [];
    return rows.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [cartData]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore backend logout errors and clear local session anyway
    } finally {
      clearStoredAuth();
      message.success("Đăng xuất thành công");
      navigate("/signin", { replace: true });
    }
  };

  const { mutate: askBot, isLoading: isBotTyping } = useMutation({
    mutationFn: askClientChatbot,
    onSuccess: (payload) => {
      const answer = payload?.data?.answer || "Xin lỗi, mình chưa thể trả lời lúc này.";
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "bot",
          text: answer,
        },
      ]);
    },
    onError: (error) => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          role: "bot",
          text: error?.response?.data?.message || "Chatbot tạm thời bận, bạn thử lại sau nhé.",
        },
      ]);
    },
  });

  const handleSendChat = () => {
    const normalized = chatInput.trim();

    if (!normalized || isBotTyping) {
      return;
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: normalized,
      },
    ]);
    setChatInput("");
    askBot(normalized);
  };

  useEffect(() => {
    if (!isChatOpen) {
      return;
    }

    const timer = setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [isChatOpen]);

  useEffect(() => {
    if (!isChatOpen) {
      return;
    }

    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isBotTyping, isChatOpen]);

  return (
    <div className="min-h-screen bg-sky-50">
      <header className="sticky top-0 z-20 border-b border-blue-100 bg-gradient-to-r from-white to-sky-50/95 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/client/products" className="flex items-center gap-3">
              <img src={logo} alt="Văn phòng phẩm" className="h-10 w-10 rounded object-cover" />
              <div>
                <p className="text-base font-bold text-slate-800">Văn phòng phẩm</p>
                <p className="text-xs text-blue-600">Mua sắm nhanh - Giao hàng toàn quốc</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to={isAuthenticated ? "/client/profile" : "/signin"}
                replace={!isAuthenticated}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700"
                title="Hồ sơ"
              >
                <i className="fa-regular fa-user text-sm" />
              </Link>
              <Link
                to={isAuthenticated ? "/client/orders" : "/signin"}
                replace={!isAuthenticated}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700"
                title="Đơn hàng"
              >
                <i className="fa-solid fa-box text-sm" />
              </Link>
              <Link
                to="/client/cart"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700"
                title="Giỏ hàng"
              >
                <i className="fa-solid fa-cart-shopping text-sm" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                to={isAuthenticated ? "/client/wishlist" : "/signin"}
                replace={!isAuthenticated}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700"
                title="Yêu thích"
              >
                <i className="fa-regular fa-heart text-sm" />
              </Link>

              {isAuthenticated ? (
                <button
                  type="button"
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              ) : (
                <Link
                  to="/signin"
                  replace
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <nav className="flex items-center gap-2 overflow-x-auto">
              <NavLink to="/client/products" className={navLinkClass}>
                Sản phẩm
              </NavLink>
              <NavLink to="/client/cart" className={navLinkClass}>
                Giỏ hàng
              </NavLink>
              <NavLink
                to={isAuthenticated ? "/client/orders" : "/signin"}
                replace={!isAuthenticated}
                className={navLinkClass}
              >
                Đơn hàng của tôi
              </NavLink>
              <NavLink
                to={isAuthenticated ? "/client/wishlist" : "/signin"}
                replace={!isAuthenticated}
                className={navLinkClass}
              >
                Wishlist
              </NavLink>
              <NavLink
                to={isAuthenticated ? "/client/profile" : "/signin"}
                replace={!isAuthenticated}
                className={navLinkClass}
              >
                Tài khoản
              </NavLink>
            </nav>

            <span className="hidden text-sm text-blue-700 md:block">
              Xin chào, <span className="font-semibold">{user?.username || "Khách hàng"}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <Outlet />
      </main>

      <ClientFooter />

      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3">
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
          title="Chat hỗ trợ"
          onClick={() => setIsChatOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-comments" />
        </button>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Lên đầu trang"
        >
          <i className="fa-solid fa-arrow-up" />
        </button>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-20 right-3 z-40 flex max-h-[75vh] w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl border border-blue-200 bg-white shadow-2xl sm:right-5">
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Trợ lý mua sắm</p>
              <p className="text-xs text-blue-100">Tư vấn sản phẩm văn phòng phẩm • Trực tuyến</p>
            </div>
            <button type="button" onClick={() => setIsChatOpen(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-sky-50/40 p-3">
            {chatMessages.map((chatItem) => (
              <div
                key={chatItem.id}
                className={`flex ${chatItem.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${chatItem.role === "user" ? "bg-orange-500 text-white" : "bg-sky-100 text-blue-900"}`}
                >
                  {chatItem.text}
                </div>
              </div>
            ))}

            {isBotTyping && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-sky-100 px-3 py-2 text-sm text-blue-900">Đang trả lời...</div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <div className="border-t border-blue-100 bg-white p-3">
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleSendChat();
              }}
            >
              <input
                ref={chatInputRef}
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                className="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isBotTyping || !chatInput.trim()}
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientLayout;
