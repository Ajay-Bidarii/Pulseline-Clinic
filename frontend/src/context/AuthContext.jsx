import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session.user);
    setInitializing(false);
  }, []);

  const login = async (credentials) => {
    const { user: loggedInUser } = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginDoctor = async (credentials) => {
    const { user: loggedInUser } = await authService.loginDoctor(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginPatient = async (credentials) => {
    const { user: loggedInUser } = await authService.loginPatient(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const registerPatient = async (details) => {
    const { user: newUser } = await authService.registerPatient(details);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };
//
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      role: user?.role || null,
      initializing,
      login,
      loginDoctor,
      loginPatient,
      registerPatient,
      logout,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
