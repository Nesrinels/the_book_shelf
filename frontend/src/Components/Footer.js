import React from 'react';
import { Facebook, Youtube, Linkedin, Instagram, Phone, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-700 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">The Book Shelf</span>
            </div>
            <p className="text-emerald-100 text-sm">
              The Book Shelf is a Book Store Ecommerce Website specializing in 
              bringing literary treasures to book lovers worldwide.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-emerald-100 hover:text-emerald-300 cursor-pointer" />
              <Youtube className="w-5 h-5 text-emerald-100 hover:text-emerald-300 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-emerald-100 hover:text-emerald-300 cursor-pointer" />
              <Instagram className="w-5 h-5 text-emerald-100 hover:text-emerald-300 cursor-pointer" />
            </div>
          </div>

          {/* Our Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Links</h3>
            <ul className="space-y-2 text-emerald-100">
              <li className="hover:text-emerald-300 cursor-pointer">About Us</li>
              <li className="hover:text-emerald-300 cursor-pointer">Contact Us</li>
              <li className="hover:text-emerald-300 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-emerald-300 cursor-pointer">Pricing Table</li>
              <li className="hover:text-emerald-300 cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* The Book Shelf */}
          <div>
            <h3 className="text-lg font-semibold mb-4">The Book Shelf</h3>
            <ul className="space-y-2 text-emerald-100">
              <li className="hover:text-emerald-300 cursor-pointer">Our Store</li>
              <li className="hover:text-emerald-300 cursor-pointer">Services</li>
              <li className="hover:text-emerald-300 cursor-pointer">Book Details</li>
              <li className="hover:text-emerald-300 cursor-pointer">Blog</li>
              <li className="hover:text-emerald-300 cursor-pointer">Shop</li>
            </ul>
          </div>

          {/* Get in Touch With Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch With Us</h3>
            <div className="space-y-4 text-emerald-100">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <p>123 Book Street, Literary Lane, Reading City 12345, US</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p>+1 234 567 8900</p>
                  <p>+1 234 567 8901</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p>support@bookshelf.com</p>
                  <p>info@bookshelf.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-emerald-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-emerald-100 text-sm">
            <p>The Book Shelf Ecommerce Website - © 2024 All Rights Reserved</p>
            <p className="flex items-center">
              Made with <span className="text-red-500 mx-1">❤</span> by Nesrinels
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;