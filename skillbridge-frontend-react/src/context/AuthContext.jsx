import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sb_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    // نتأكد إن التوكن لسه صالح ونجيب أحدث بيانات المستخدم
    authService
      .getMe()
      .then((freshUser) => {
        setUser(freshUser);
        localStorage.setItem('sb_user', JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem('sb_token');
        localStorage.removeItem('sb_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser, token } = await authService.login(credentials);
    localStorage.setItem('sb_token', token);
    localStorage.setItem('sb_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { user: newUser, token } = await authService.register(payload);
    localStorage.setItem('sb_token', token);
    localStorage.setItem('sb_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
