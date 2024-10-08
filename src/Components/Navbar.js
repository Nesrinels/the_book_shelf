import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Bell, Menu, X, Heart } from 'lucide-react';
import logo from './logo/logo2.png';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu Toggle */}
          <div className="flex items-center">
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-800 focus:outline-none p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            <Link 
              to="/" 
              className="flex items-center ml-2 md:ml-0"
            >
              <img
                src={logo}
                className="h-8 w-auto mr-2"
                alt="Logo"
              />
              <span className="text-lg font-semibold">The Book Shelf</span>
            </Link>
          </div>

          {/* Center - Search bar (hidden on mobile) */}
          <div className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="search" 
                placeholder="Search for books..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side - Navigation Links and Icons */}
          <div className="flex items-center">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 mr-4">
            <Link 
                to="/shop"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Shop
              </Link>
              <Link 
                to="/blog"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <Link 
                to="/contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
              <Link 
                to="/about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About Us
              </Link>
            </div>

            {/* Icons - Always visible */}
            <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
      <Heart className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
          4
        </span>
    </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 ">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
                  3
                </span>
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
                  2
                </span>
              </button>
              <Link
              to="/signin" 
              >
              <button className="relative px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 border border-gray-300 rounded-lg hover:border-gray-400">
                  Sign In
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-4`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="search" 
                  placeholder="Search for books..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                />
              </div>
            </div>
            <Link 
                to="/shop"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Shop
              </Link>
              <Link 
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <Link 
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
              <Link 
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                About Us
              </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}