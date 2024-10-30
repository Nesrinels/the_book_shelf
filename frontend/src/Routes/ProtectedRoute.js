import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, isAdminRoute }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  console.log(isAuthenticated);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check for admin access if it's an admin route
  if (isAdminRoute && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Render the protected component
  return children;
};

// Example usage of different protection levels
export const AdminRoute = ({ children }) => (
  <ProtectedRoute isAdminRoute>{children}</ProtectedRoute>
);

export const UserRoute = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export default ProtectedRoute;