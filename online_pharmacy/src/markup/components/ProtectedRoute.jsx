import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['customer', 'pharmacist', 'admin'] 
}) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!hasRole(allowedRoles)) {
    // User is authenticated but doesn't have the required role
    // Redirect to their appropriate dashboard
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === 'pharmacist') {
      return <Navigate to="/pharmacist/dashboard" replace />;
    }
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;