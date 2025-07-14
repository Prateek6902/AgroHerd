// src/components/Header.jsx
import React from 'react';
import { getName } from '../utils/auth';

export default function Header() {
  const name = getName();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-yellow-100 shadow-sm rounded-b-lg">
      <div className="flex items-center gap-4">
        <img
          src="/icons/farmer-avatar.png"
          alt="AgroHerd Logo"
          className="w-16 h-28 rounded-full object-cover border border-black shadow-md transition-transform duration-300 transform animate-pulse hover:scale-105"
        />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Namaste, Farmer {name} 
        </h2>
      </div>
    </header>
  );
}
