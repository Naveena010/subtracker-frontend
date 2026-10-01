import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('subtracker_token'));
  const [role, setRole] = useState(() => localStorage.getItem('subtracker_role'));  // <-- role lives here
  const [email, setEmail] = useState(() => localStorage.getItem('subtracker_email'));

  const login = ({ token, role, email }) => {
    localStorage.setItem('subtracker_token', token);
    localStorage.setItem('subtracker_role', role);   // <-- saved from the login API response
    localStorage.setItem('subtracker_email', email);
    setToken(token);
    setRole(role);
    setEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('subtracker_token');
    localStorage.removeItem('subtracker_role');
    localStorage.removeItem('subtracker_email');
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, role, email, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}