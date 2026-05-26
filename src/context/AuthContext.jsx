import { createContext, useContext, useEffect, useState } from "react";
import {
  AUTH_SESSION_CHANGED_EVENT,
  clearAuthSession,
  msUntilSessionExpires,
  persistAuthSession,
  readStoredToken,
  readStoredUser,
} from "../shared/utils/authSession";

const AuthContext = createContext(null);

export const mustChangeInitialPassword = (user) =>
  user?.requiresInitialPasswordChange === true;

export function AuthProvider({ children }) {

  const [token, setToken] = useState(readStoredToken);
  // const [tenantId, setTenantId] = useState(localStorage.getItem("tenantId"));
  const [user, setUser] = useState(readStoredUser);
  const [sessionVersion, setSessionVersion] = useState(0);

  const syncSession = () => {
    setToken(readStoredToken());
    setUser(readStoredUser());
    setSessionVersion((currentVersion) => currentVersion + 1);
  };

  useEffect(() => {
    const handleSessionChanged = () => syncSession();

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);
    window.addEventListener("storage", handleSessionChanged);

    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);
      window.removeEventListener("storage", handleSessionChanged);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const expiresIn = msUntilSessionExpires();
    const timeoutId = window.setTimeout(() => {
      clearAuthSession();
    }, expiresIn);

    return () => window.clearTimeout(timeoutId);
  }, [token, sessionVersion]);

  // const login = (jwt) => {
  const login = (input) => {
    const jwt = input.accessToken;
    // const tenant = input.user.tenantId;
    const userData = input.user;

    persistAuthSession({ accessToken: jwt, user: userData });
    // localStorage.setItem("tenantId", tenant);

    setToken(jwt);
    // setTenantId(tenant);
    setUser(userData);
    setSessionVersion((currentVersion) => currentVersion + 1);
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
    clearAuthSession({ notify: false });
    // localStorage.removeItem("tenantId");
    setToken(null);
    // setTenantId(null);
    setUser(null);
    setSessionVersion((currentVersion) => currentVersion + 1);
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
