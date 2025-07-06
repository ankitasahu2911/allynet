import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);    // {name, role}
  const [token, setToken] = useState(null);  // JWT
  const [loading, setLoading] = useState(true);

  // 🔁 1st load: check sessionStorage instead of localStorage
  useEffect(() => {
    const t = sessionStorage.getItem("token");
    const u = JSON.parse(sessionStorage.getItem("user") || "null");
    if (t && u) {
      setToken(t);
      setUser(u);
    }
    setLoading(false);
  }, []);

  const login = (tk, usr) => {
    setToken(tk);
    setUser(usr);
    sessionStorage.setItem("token", tk);
    sessionStorage.setItem("user", JSON.stringify(usr));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
