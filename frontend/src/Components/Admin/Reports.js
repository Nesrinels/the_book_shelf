import React, { useState } from 'react';
import { 
  LineChart, 
  Line as RechartsLine,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Calendar, TrendingUp, Package, Users, DollarSign, BookOpen, ChevronDown, Download } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

const Reports = () => {
  const [dateRange, setDateRange] = useState('last7days');
  const navigate = useNavigate();
  const [showOrders, setShowOrders] = useState(false); // State to toggle Orders view

  const handleOrdersClick = () => {
    setShowOrders(true);
    navigate('/admin-dashboard/reports/orders'); // Navigate to the Orders route
  };

  // Sample data - in a real app, this would come from your backend
  const salesData = [
    { date: 'Mon', sales: 2400, orders: 24 },
    { date: 'Tue', sales: 1398, orders: 15 },
    { date: 'Wed', sales: 3800, orders: 38 },
    { date: 'Thu', sales: 3908, orders: 42 },
    { date: 'Fri', sales: 4800, orders: 45 },
    { date: 'Sat', sales: 3800, orders: 36 },
    { date: 'Sun', sales: 4300, orders: 41 }
  ];

  const topSellingBooks = [
    { title: "Pride and Prejudice", sales: 145, revenue: 1594.55 },
    { title: "1984", sales: 132, revenue: 1847.68 },
    { title: "The Hobbit", sales: 128, revenue: 1791.72 },
    { title: "Lord of the Rings", sales: 112, revenue: 2238.88 },
    { title: "Jane Eyre", sales: 98, revenue: 1027.02 }
  ];

  const Select = ({ value, onChange, options }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, trend = null, onClick, clickable }) => (
    <div 
      className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm ${
        clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        {trend !== null && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm mt-4">{label}</h3>
      <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'last7days', label: 'Last 7 Days' },
              { value: 'lastMonth', label: 'Last Month' },
              { value: 'lastYear', label: 'Last Year' }
            ]}
          />
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={DollarSign} label="Total Revenue" value="$12,426" trend={8.2} />
        <StatCard
          icon={Package}
          label="Total Orders"
          value="241"
          trend={5.1}
          clickable={true}
          onClick={handleOrdersClick} // Trigger Orders view
        />
        <StatCard icon={Users} label="New Customers" value="18" trend={-2.4} />
        <StatCard icon={BookOpen} label="Books Sold" value="526" trend={12.5} />
      </div>

      {/* Render the Outlet only when showOrders is true */}
      {showOrders && (
        <div className="mt-6">
          <Outlet />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <RechartsLine type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Books Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Top Selling Books</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topSellingBooks.map((book, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{book.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{book.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${book.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-gray-600">12.3%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
