import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '../context/AuthContext';

export function AdminRoute() {
  const { isAdmin } = useCurrentUser();

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
