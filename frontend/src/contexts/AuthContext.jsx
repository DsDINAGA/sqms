import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const auth = data.data;
    localStorage.setItem('token', auth.token);
    const userData = { id: auth.userId, name: auth.name, email: auth.email, role: auth.role };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    const auth = data.data;
    localStorage.setItem('token', auth.token);
    const userData = { id: auth.userId, name: auth.name, email: auth.email, role: auth.role };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      authAPI.getProfile()
        .then(({ data }) => {
          const u = data.data;
          const userData = { id: u.id, name: u.name, email: u.email, role: u.role };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        })
        .catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
