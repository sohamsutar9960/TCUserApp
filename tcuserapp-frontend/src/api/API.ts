import axios from "axios";
import Cookies from "js-cookie";
import adminApiConfig from "./adminConfig";

const { serverBaseURL } = adminApiConfig;

// Axios instance
const axiosInstance = axios.create({
  baseURL: serverBaseURL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (request) => {
    const token = Cookies.get("token");
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and debugging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "Response error:",
      error.response ? error.response.data : error.message
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
