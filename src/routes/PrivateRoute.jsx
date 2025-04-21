import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "@store/AuthContext";

const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now(); // true si aún no ha expirado
  } catch {
    return false;
  }
};

export const PrivateRoute = () => {
  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const token = localStorage.getItem("token_jwt");
  const valid = token && isTokenValid(token);

  return valid ? <Outlet /> : <Navigate to="/login" replace />;
};
