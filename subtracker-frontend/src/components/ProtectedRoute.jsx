import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {           // <-- the actual gate
    return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/subscriptions'} replace />;
  }

  return children;
}