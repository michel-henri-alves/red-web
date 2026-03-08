import { createContext, useContext, useState } from "react";
import { set } from "zod";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = useState(localStorage.getItem("token"));
  // const [tenantId, setTenantId] = useState(localStorage.getItem("tenantId"));
  const [user, setUser] = useState(null);


  // const login = (jwt) => {
  const login = (input) => {
    const jwt = input.accessToken;
    // const tenant = input.user.tenantId;
    const userData = input.user;
    
    localStorage.setItem("token", jwt);
    // localStorage.setItem("tenantId", tenant);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(jwt);
    // setTenantId(tenant);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("tenantId");
    localStorage.removeItem("user");
    setToken(null);
    // setTenantId(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
