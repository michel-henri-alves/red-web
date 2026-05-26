import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const readStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const mustChangeInitialPassword = (user) =>
  user?.requiresInitialPasswordChange === true;

export function AuthProvider({ children }) {

  const [token, setToken] = useState(localStorage.getItem("token"));
  // const [tenantId, setTenantId] = useState(localStorage.getItem("tenantId"));
  const [user, setUser] = useState(readStoredUser);


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

  const updateUserSession = (updates) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
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
    <AuthContext.Provider value={{ token, user, login, logout, updateUserSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
