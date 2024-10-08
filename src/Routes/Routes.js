import { Route, Routes } from 'react-router-dom';
import Register from '../Components/Register';
import Home from '../Components/Home'; 
import Signin from '../Components/Signin'; 
// import CategoriesPage from './CategoriesPage'; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<Signin />} />
      {/* <Route path="/categories" element={<CategoriesPage />} /> */}
     
    </Routes>
  );
};

export default AppRoutes;