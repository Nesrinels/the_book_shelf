import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  ChevronDown, 
  Search,
  Filter,
  Download
} from 'lucide-react';

// StatCard component remains the same
const StatCard = ({ icon: Icon, label, value, trend = null, onClick, clickable = false }) => {
  if (!Icon) return null;
  
  return (
    <div 
      className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm ${
        clickable ? 'cursor-pointer hover:border-emerald-500 transition-colors' : ''
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
};

// Orders Page Component
const Orders = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Updated sample orders data with a canceled status
  const ordersData = [
    { 
      id: '#ORD-001',
      customer: 'John Doe',
      date: '2024-03-01',
      items: ['Pride and Prejudice', 'The Hobbit'],
      total: 45.98,
      status: 'in-delivery'
    },
    { 
      id: '#ORD-002',
      customer: 'Jane Smith',
      date: '2024-03-02',
      items: ['1984'],
      total: 15.99,
      status: 'delivered'
    },
    { 
      id: '#ORD-003',
      customer: 'Bob Wilson',
      date: '2024-03-03',
      items: ['Lord of the Rings', 'Jane Eyre'],
      total: 52.98,
      status: 'canceled'
    },
  ];

  const filteredOrders = ordersData.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-delivery':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full w-full bg-gray-50"> {/* Added full width and height */}
      <div className="px-4 py-6 mx-auto"> {/* Adjusted padding */}
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Download className="w-4 h-4" />
            Export Orders
          </button>
        </div>

        {/* Filters and Search - Made more compact */}
        <div className="flex flex-col md:flex-row gap-3 mb-4"> {/* Reduced gap and margin */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative min-w-[180px]"> {/* Slightly reduced min-width */}
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="in-delivery">In Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Orders Table - Made more compact */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.items.join(', ')}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Orders, StatCard };
export default Orders;