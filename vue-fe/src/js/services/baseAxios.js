import axios from "axios";
import authenService from "./auth/AuthenServices";
import store from "../store";

const baseAxios = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // gửi cookie, session lên server
  credentials: "include",
});

// Thêm intercepter để gắn token vào yêu cầu API
baseAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

let isRefresh = false;
// Thêm một intercepter để xử lý lỗi trên toàn bộ ứng dụng
baseAxios.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu từ phản hồi
    return {
      success: true,
      statusCode: response.status,
      data: response.data,
    };
  },
  async (error) => {
    // Xử lý lỗi response dựa trên HTTP status code
    if (error.response) {
      const status = error.response.status;
      if (status === 400 || status === 404) {
        store.state.dialogNotify.isShow = true;
        store.state.dialogNotify.text = error.response.data.message;
      } else if (status === 401) {
        const originalConfig = error.config;
        if (originalConfig.url !== "/auth/login" && !isRefresh) {
          isRefresh = true;

          try {
            const res = await authenService.refresh();
            if (res.success) {
              const newToken = res.data.data.accessToken;
              error.config.headers["Authorization"] = `Bearer ${newToken}`;
              localStorage.setItem("accessToken", newToken);
              isRefresh = false;
              return baseAxios(error.config);
            }
          } catch (_error) {
            return Promise.reject(_error);
          }
        } else {
          store.state.dialogNotify.isShow = true;
          store.state.dialogNotify.text = error.response.data.message;
        }
      } else {
        store.state.dialogNotify.isShow = true;
        store.state.dialogNotify.text = error.response.data.message;
      }
    } else {
      // Xử lý lỗi khi không kết nối được đến server
      store.state.dialogNotify.isShow = true;
      store.state.dialogNotify.text =
        "Có lỗi xảy ra vui lòng liên hệ để đươc giúp đỡ !";
    }
    return Promise.reject(error);
  }
);

export default baseAxios;
