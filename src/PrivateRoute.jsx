import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();
  console.log("Verificando token de autenticação...");
  if (!token) {
    console.log("Token não encontrado, redirecionando para login...");
    return <Navigate to="/login" replace />;
  }

  console.log("Token encontrado, acesso permitido.");

  return children;
}