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

// Interceptor para manejar errores globales
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expirado o inválido. Cerrando sesión...");
      localStorage.removeItem("token_jwt");
      window.location.href = "/login"; // o navega usando useNavigate si estás en un componente
      // También puedes mostrar un toast aquí
    }

    return Promise.reject(error); // Sigue propagando el error
  }
);

export default AxiosInstance;
