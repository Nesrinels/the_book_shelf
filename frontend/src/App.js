import './App.css';
import Navbar from './Components/Navbar.js';
import Routes from './Routes/Routes.js';
import {CartProvider} from './Components/Cartpage/CartContext.js';

function App() {
  return (
    <>
    <CartProvider>
      <Navbar />
      <Routes />
    </CartProvider>
     </>
 );
}

export default App;
