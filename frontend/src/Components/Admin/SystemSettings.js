import React, { useState } from 'react';
import { Settings, Store, Bell, Shield, Database, Check } from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Toggle component
  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        enabled ? 'bg-emerald-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const TabButton = ({ value, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === value
          ? 'bg-emerald-500 text-white'
          : 'hover:bg-emerald-50 text-gray-600'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const Input = ({ label, type = "text", placeholder }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
    </div>
  );

  const Select = ({ label, options }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white">
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <TabButton value="general" label="General" icon={Settings} />
        <TabButton value="store" label="Store" icon={Store} />
        <TabButton value="notifications" label="Notifications" icon={Bell} />
        <TabButton value="security" label="Security" icon={Shield} />
        <TabButton value="backup" label="Backup" icon={Database} />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-500" />
              General Settings
            </h2>
            <Input label="Store Name" placeholder="The Book Shelf" />
            <Select 
              label="Time Zone" 
              options={[
                { value: 'utc', label: 'UTC' },
                { value: 'est', label: 'EST' },
                { value: 'pst', label: 'PST' }
              ]} 
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable Dark Mode</span>
              <Toggle enabled={false} onChange={() => {}} />
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-500" />
              Store Settings
            </h2>
            <Select 
              label="Currency" 
              options={[
                { value: 'usd', label: 'USD ($)' },
                { value: 'eur', label: 'EUR (€)' },
                { value: 'gbp', label: 'GBP (£)' }
              ]} 
            />
            <Input label="Tax Rate (%)" type="number" placeholder="0.00" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable Stock Management</span>
              <Toggle enabled={true} onChange={() => {}} />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-500" />
              Notification Settings
            </h2>
            {['Order Notifications', 'Low Stock Alerts', 'Customer Reviews'].map(setting => (
              <div key={setting} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{setting}</span>
                <Toggle enabled={false} onChange={() => {}} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Security Settings
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
              <Toggle enabled={false} onChange={() => {}} />
            </div>
            <Input label="Session Timeout (minutes)" type="number" placeholder="30" />
            <button className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors">
              Change Admin Password
            </button>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Backup & Maintenance
            </h2>
            <Select 
              label="Automatic Backup Frequency" 
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' }
              ]} 
            />
            <button className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors">
              Create Manual Backup
            </button>
            <button className="w-full border border-emerald-500 text-emerald-500 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
              Clear Cache
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;