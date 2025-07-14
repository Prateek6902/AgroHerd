// src/components/AnimalCard.jsx
import React from 'react';

export default function AnimalCard({ type, count = 0, large = false }) {
  const icons = {
    cow: '/icons/cow.png',
    pig: '/icons/pig.png',
    sheep: '/icons/sheep.png',
    hen: '/icons/hen.png',
    buffalo: '/icons/buffalo.png',
    goat: '/icons/goat.png', // ✅ Added goat
  };

  const bgColor = {
    cow: 'bg-green-200',
    pig: 'bg-orange-100',
    sheep: 'bg-yellow-100',
    hen: 'bg-green-100',
    buffalo: 'bg-orange-200',
    goat: 'bg-gray-200', // ✅ Neutral background for goat
  };

  const fallbackIcon = '/icons/fallback.png';

  return (
    <div
      className={`rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
        bgColor[type] || 'bg-gray-100'
      } ${large ? 'text-xl' : ''}`}
      title={`${type} count: ${count}`}
    >
      <img
        src={icons[type] || fallbackIcon}
        alt={type}
        className={`mx-auto mb-2 ${large ? 'w-16 h-16' : 'w-12 h-12'} object-contain`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackIcon;
        }}
      />
      <p className={`font-bold ${large ? 'text-2xl' : 'text-lg'} text-green-800`}>
        {count}
      </p>
      <p className="text-sm capitalize text-gray-700">{type}</p>
    </div>
  );
}
