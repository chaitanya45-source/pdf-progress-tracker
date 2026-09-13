import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    console.log("Server Error:", message);

    return Promise.reject(new Error(message));
  }
);
export default axiosInstance;