import { Route, Routes } from 'react-router-dom';
import Register from '../Components/Register';
import Home from '../Components/Home'; 
import Signin from '../Components/Signin';
import ForgetPassword from '../Components/ForgetPassword'; 
import ChangePassword from '../Components/ChangePassword'; 
import Shop from '../Components/Shop';  

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/shop" element={<Shop />} />
      
     
    </Routes>
  );
};

export default AppRoutes;