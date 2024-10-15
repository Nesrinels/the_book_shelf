import { Route, Routes } from 'react-router-dom';
import Register from '../Components/Register';
import Home from '../Components/Home';
import Signin from '../Components/Signin';
import ForgetPassword from '../Components/ForgetPassword';
import ChangePassword from '../Components/ChangePassword';
import Shop from '../Components/Shop';
import AdminDashboard from '../Components/AdminDashboard'; // Import admin dashboard
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import Profile from '../Components/Profile'; // Import the Profile component';
import Book from '../Components/Book'; // Import the Book component

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Missing closing tag added for the Book route */}
      <Route path="/book/:id" element={<Book />} />

      {/* Protected Route for Shop */}
      <Route
        path="/shop"
        element={<Shop />
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
