import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRoute }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  
  // Parse the token to check if the user is an admin
  const decodedToken = JSON.parse(atob(token.split('.')[1]));

  // If it's an admin route and the user is not an admin, redirect to home
  if (isAdminRoute && decodedToken.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the component
  return children;
};

export default ProtectedRoute;