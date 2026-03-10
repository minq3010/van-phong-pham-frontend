import { createRoot } from "react-dom/client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Router/Router";
import { QueryClient, QueryClientProvider } from "react-query";
import AppErrorBoundary from "./Ui/AppErrorBoundary.jsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 phút — không refetch lại khi chuyển trang
      cacheTime: 1000 * 60 * 10,     // 10 phút — giữ cache sau khi unmount
      refetchOnWindowFocus: false,   // không refetch khi focus lại tab
      refetchOnReconnect: false,     // không refetch khi reconnect mạng
      retry: 1,                      // thử lại 1 lần thay vì 3 lần mặc định
    },
  },
});
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AppErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppErrorBoundary>
  </QueryClientProvider>
);
