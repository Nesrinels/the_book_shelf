import React, { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        {
            _id: "670960aa09d694773b9d5890",
            title: "Pride and Prejudice",
            author: "Jane Austen",
            genre: "Romance",
            price: 10.99,
            description: "A witty exploration of manners, upbringing, and marriage in Regency-era England.",
            publishedYear: 1813,
            pages: 279,
            inStock: true,
            imageUrl: "/images/pride-and-prejudice.jpeg",
            fullImageUrl: "http://localhost:3000/images/pride-and-prejudice.jpeg",
            quantity: 0
        },
        {
            _id: "67095fa709d694773b9d5886",
            title: "1984",
            author: "George Orwell",
            genre: "Dystopian",
            price: 13.99,
            description: "A chilling portrayal of a totalitarian regime that uses surveillance and mind control.",
            publishedYear: 1949,
            pages: 328,
            inStock: true,
            imageUrl: "/images/1984.jpeg",
            fullImageUrl: "http://localhost:3000/images/1984.jpeg",
            quantity: 0
        },
        {
            _id: "67088513f63550b96b9d12f5",
            title: "Anna Karenina",
            author: "Leo Tolstoy",
            genre: "Fiction",
            price: 13.49,
            description: "A tragic love story set against the backdrop of Russian aristocracy.",
            publishedYear: 1877,
            pages: 864,
            inStock: true,
            imageUrl: "/images/anna-karenina.jpeg",
            fullImageUrl: "http://localhost:3000/images/anna-karenina.jpeg",
            quantity: 0
        }
    ]);
    

  const updateQuantity = (id, increment) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + (increment ? 1 : -1)) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-16">
      <h1 className="text-3xl font-bold mb-8">Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-4 pb-2 border-b text-sm font-semibold">
                <div className="col-span-2">Product</div>
                <div>Unit Price</div>
                <div>Quantity</div>
                <div>Total</div>
                <div></div>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-2 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div>${item.price.toFixed(2)}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, false)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, true)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                  <div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-gray-100 rounded text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Calculate Shipping</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Credit Card Number"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Card Verification Number"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-colors">
                  Apply Coupon
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-4">Cart Subtotal</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Order Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free Shipping</span>
                </div>
                <div className="flex justify-between">
                  <span>Coupon</span>
                  <span>$25.00</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${(subtotal - 25).toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full border border-emerald-600 text-emerald-700 py-3  mt-6 rounded-md hover:bg-emerald-50 transition-colors">
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;