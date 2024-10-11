import { Route, Routes } from 'react-router-dom';
import Register from '../Components/Register';
import Home from '../Components/Home';
import Signin from '../Components/Signin';
import ForgetPassword from '../Components/ForgetPassword';
import ChangePassword from '../Components/ChangePassword';
import Shop from '../Components/Shop';
import AdminDashboard from '../Components/AdminDashboard'; // Import admin dashboard
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/changepassword" element={<ChangePassword />} />

      {/* Protected Route for Shop */}
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Route */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute isAdminRoute={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
