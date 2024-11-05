import './App.css';
import Navbar from './Components/Navbar.js';
import Routes from './Routes/Routes.js';
import {CartProvider} from './contexts/CartContext.js';
import {AuthProvider} from './contexts/AuthContext.js';
import {WishlistProvider} from './contexts/WishlistContext.js';

function App() {
  return (
    <>
    <AuthProvider>
    <CartProvider>
      <WishlistProvider>
      <Navbar />
      <Routes />
    </WishlistProvider>
    </CartProvider>
    </AuthProvider>
     </>
 );
}

export default App;
