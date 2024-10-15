import React from 'react';
import { User, ShoppingCart, Heart, ShoppingBag, MessageSquareMore, Shield, LogOut } from 'lucide-react';
import {Link} from 'react-router-dom';

const ProfilePage = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen mt-5">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 shadow-lg mt-10">
        <div className="text-center mb-8">
          <img src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png" alt="Profile" className="rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-bold">David Matin</h2>
          <p className="text-gray-500">Web developer</p>
        </div>
        <nav>
          <MenuItem icon={<User />} text="Profile" active />
          <MenuItem icon={<ShoppingCart />} text="My Cart" />
          <MenuItem icon={<Heart />} text="Wishlist" />
          <Link to='/shop'><MenuItem icon={<ShoppingBag />} text="Shop" /></Link>
          <MenuItem icon={<MessageSquareMore />} text="Services" />
          <MenuItem icon={<MessageSquareMore />} text="Help Desk" />
          <MenuItem icon={<Shield />} text="Privacy Policy" />
          <MenuItem icon={<LogOut />} text="Log Out" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 mt-10">
        <h1 className="text-2xl font-bold mb-6">BASIC INFORMATION</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <InputField label="Your Name" value="Alexander Weir" />
            <InputField label="Professional title" value="Web Designer" />
            <InputField label="Languages" value="Language" />
            <InputField label="Age" value="Age" />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s."
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-6">CONTACT INFORMATION</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <InputField label="Contact Number" value="+1 123 456 7890" />
            <InputField label="Email Address" value="info@example.com" />
            <InputField label="Country" value="Country Name" />
            <InputField label="Postcode" value="112233" />
            <InputField label="City" value="City Name" />
            <InputField label="Full Address" value="New York City" />
          </div>
        </div>

        <button className="mt-6 bg-emerald-700 text-white py-2 px-4 rounded-md hover:bg-emerald-800 transition duration-300">
          Save Setting
        </button>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, active = false }) => (
  <div className={`flex items-center py-2 px-4 rounded-md ${active ? 'bg-emerald-100 text-emerald-500' : 'text-gray-600 hover:bg-gray-100'}`}>
    {icon}
    <span className="ml-2">{text}</span>
  </div>
);

const InputField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}:</label>
    <input
      type="text"
      className="w-full p-2 border rounded-md"
      defaultValue={value}
    />
  </div>
);

export default ProfilePage;