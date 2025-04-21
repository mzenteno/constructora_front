import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar el token
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token_jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
