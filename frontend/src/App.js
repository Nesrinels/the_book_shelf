import './App.css';
import Navbar from './Components/Navbar.js';
import Routes from './Routes/Routes.js';
import {CartProvider} from './contexts/CartContext.js';
import {AuthProvider} from './contexts/AuthContext.js';

function App() {
  return (
    <>
    <AuthProvider>
    <CartProvider>
      <Navbar />
      <Routes />
    </CartProvider>
    </AuthProvider>
     </>
 );
}

export default App;
