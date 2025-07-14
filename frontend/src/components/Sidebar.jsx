import React from 'react';
import { NavLink } from 'react-router-dom';
import { getRole, logout } from '../utils/auth';

const sidebarItems = [
  { label: 'Dashboard', icon: '/icons/dashboard.png', path: '/dashboard' },
  { label: 'Cow', icon: '/icons/cow.png', path: '/cow' },
  { label: 'Pig', icon: '/icons/pig.png', path: '/pig' },
  { label: 'Sheep', icon: '/icons/sheep.png', path: '/sheep' },
  { label: 'Hen', icon: '/icons/hen.png', path: '/hen' },
  { label: 'Buffalo', icon: '/icons/buffalo.png', path: '/buffalo' },
  { label: 'Goat', icon: '/icons/goat.png', path: '/goat' },
  { label: 'Products', icon: '/icons/products.png', path: '/products' },
  { label: 'Shed Manager', icon: '/icons/shed.png', path: '/shed' },
  { label: 'Feeding Schedule', icon: '/icons/feeding.png', path: '/feeding' },
  { label: 'Analytics', icon: '/icons/analytics.png', path: '/analytics' },
];

export default function Sidebar() {
  const role = getRole();

  return (
    <div className="bg-green-100 w-64 min-h-screen p-4 flex flex-col shadow-md">
      {/* 🔥 Logo & App Name */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/icons/logo.png"
          alt="AgroHerd Logo"
          className="w-24 h-24 rounded-full object-cover border-2 border-[#4b5320] shadow-lg transition duration-300 hover:shadow-[0_0_20px_rgba(139,69,19,0.4)]"
        />
        <h1
        className="mt-4 px-6 py-2 text-3xl font-bold text-center inline-block glow-text"
        style={{
          fontFamily: '"Londrina Outline", sans-serif',
          color: '#4C956C',
          //textShadow: '2px 2px 0 #16a34a, -2px -2px 0 #16a34a',
          letterSpacing: '1px',}}
          >
            <span className="text-green-600">Agro</span>
            <span className="text-yellow-400">Herd</span>
            
            </h1>
      </div>

      {/* Sidebar Navigation Items */}
      {sidebarItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 mb-2 rounded-lg transition-all duration-200 ${
              isActive ? 'bg-green-700 text-white' : 'hover:bg-green-200 text-gray-800'
            }`
          }
        >
          <img src={item.icon} alt={item.label} className="w-6 h-6 object-contain" />
          <span className="text-sm font-medium">{item.label}</span>
        </NavLink>
      ))}

      {/* Logout Button */}
      <button
        onClick={logout}
        className="mt-auto text-sm px-3 py-2 rounded bg-red-100 hover:bg-red-200 text-red-800 transition"
      >
        Logout
      </button>
    </div>
  );
}
