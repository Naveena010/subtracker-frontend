import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';

import Subscriptions from './pages/customer/Subscriptions';
import Notifications from './pages/customer/Notifications';
import RedeemCoupon from './pages/customer/RedeemCoupon';

import Coupons from './pages/admin/Coupons';
import Dashboard from './pages/admin/Dashboard';
import Alerts from './pages/admin/Alerts';
import AddUser from './pages/admin/AddUser';

export default function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer routes */}
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <AppLayout>
              <Subscriptions />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <AppLayout>
              <Notifications />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/redeem"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <AppLayout>
              <RedeemCoupon />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/coupons"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AppLayout>
              <Coupons />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/alerts"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AppLayout>
              <Alerts />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AppLayout>
              <AddUser />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              !isAuthenticated
                ? '/login'
                : role === 'ADMIN'
                ? '/admin/dashboard'
                : '/subscriptions'
            }
            replace
          />
        }
      />
    </Routes>
  );
}