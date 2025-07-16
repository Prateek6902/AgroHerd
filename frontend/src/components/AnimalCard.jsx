import React from 'react';

export default function AnimalCard({ type, count = 0, large = false }) {
  const icons = {
    cow: '/icons/cow.png',
    pig: '/icons/pig.png',
    sheep: '/icons/sheep.png',
    hen: '/icons/hen.png',
    buffalo: '/icons/buffalo.png',
    goat: '/icons/goat.png',
  };

  const bgColor = {
    cow: 'bg-green-200',
    pig: 'bg-orange-100',
    sheep: 'bg-yellow-100',
    hen: 'bg-green-100',
    buffalo: 'bg-orange-200',
    goat: 'bg-gray-200',
  };

  const fallbackIcon = '/icons/fallback.png';

  return (
    <div
      className={`rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
        bgColor[type] || 'bg-gray-100'
      } ${large ? 'text-xl' : ''}`}
      title={`${type} count: ${count}`}
    >
      {/* Inline icon + count */}
      <div className="flex justify-center items-center gap-2 mb-1">
        <img
          src={icons[type] || fallbackIcon}
          alt={type}
          className={`${large ? 'w-8 h-8' : 'w-6 h-6'} object-contain`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackIcon;
          }}
        />
        <span
          className={`font-bold text-green-800 ${large ? 'text-2xl' : 'text-lg'}`}
        >
          {count}
        </span>
      </div>

      <p className="text-sm capitalize text-gray-700">{type}</p>
    </div>
  );
}
