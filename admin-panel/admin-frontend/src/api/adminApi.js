import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:6001/api/admin",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (
    config.url.includes("/login") ||
    config.url.includes("/register") ||
    config.url.includes("/forgot-password")
  ) {
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => {
    if (res.headers["x-token-warning"] === "expiring-soon") {
      toast.warn("Your session will expire soon.");
    }
    return res;
  },
  (err) => {
    const status = err.response?.status;
    const code = err.response?.data?.code;
    const msg = err.response?.data?.message;

    if (status === 401 || code === "TOKEN_EXPIRED" || code === "TOKEN_INVALID") {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
      return;
    }

    if (status === 403) toast.error("You do not have permission.");
    if (code === "NO_AUTH_HEADER") toast.error("Authentication required.");
    if (code === "INVALID_FORMAT") toast.error("Invalid authentication token.");
    if (msg) toast.error(msg);

    return Promise.reject(err);
  }
);

const adminApi = {
  login(data) {
    return api.post("/login", data);
  },

  getRestaurants({ page = 1, search = "" }) {
    return api.get(`/restaurants?page=${page}&search=${search}`);
  },

  getMenuByUsername(username) {
    return api.get(`/restaurants/menu?username=${username}`);
  },

  deleteDish(dishId) {
    return api.delete(`/dish/${dishId}`);
  },

  updateDish(dishId, data) {
    return api.patch(`/dish/${dishId}`, data);
  },

  uploadGLB(dishId, file) {
    const fd = new FormData();
    fd.append("model", file);
    return api.post(`/dish/${dishId}/upload-glb`, fd);
  },

  uploadIOS(dishId, file) {
    const fd = new FormData();
    fd.append("iosModel", file);
    return api.post(`/dish/${dishId}/upload-ios`, fd);
  }
};

// EXPORT BOTH
export { api };       // axios instance
export default adminApi; 
