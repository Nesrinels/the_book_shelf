import { Route, Routes } from 'react-router-dom';
import Register from '../Components/Register';
import Home from '../Components/Home';
import Signin from '../Components/Signin';
import ForgetPassword from '../Components/ForgetPassword';
import ChangePassword from '../Components/ChangePassword';
import Shop from '../Components/Shop';
import AdminDashboard from '../Components/Admin/AdminDashboard'; 
import ProtectedRoute from './ProtectedRoute'; 
import Profile from '../Components/Profile'; 
import Book from '../Components/Book'; 
import CartPage from '../Components/Cartpage/CartPage'; 
import Users from '../Components/Admin/UsersPage';
import Books from '../Components/Admin/BooksPage';
import Settings from '../Components/Admin/SystemSettings';
import Reports from '../Components/Admin/Reports';
import Orders from '../Components/Admin/Orders';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/books/:id" element={<Book />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Protected Route for Shop */}
      <Route path="/shop" element={<Shop />} />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute isAdminRoute={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        {/* Nested Admin Routes */}
        <Route
          path="users"
          element={
            <ProtectedRoute isAdminRoute={true}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="books" element={<Books />} />
        <Route path="reports" element={<Reports />}>
          {/* Nested route for Orders under Reports */}
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
