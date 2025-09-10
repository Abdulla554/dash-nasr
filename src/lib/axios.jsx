import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://j8s4o4s8kgokwkk0skgwgcc8.91.92.136.18.sslip.io",
  timeout: 30000, // 30 seconds timeout
  headers: {
    Accept: "application/json",
  },
  withCredentials: false, // Disable credentials for now since server doesn't support it properly
});

// Add request interceptor to remove Content-Type for FormData
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let the browser set the Content-Type header automatically for FormData
    delete config.headers["Content-Type"];
  }
  return config;
});

export default axiosInstance;
