import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertBox from './AlertBox';
import WeatherBox from './WeatherBox';
import TaskList from './TaskList';

const animalTypes = [
  { type: 'cow', icon: '/icons/cow.png', color: 'bg-green-200' },
  { type: 'pig', icon: '/icons/pig.png', color: 'bg-orange-100' },
  { type: 'sheep', icon: '/icons/sheep.png', color: 'bg-orange-200' },
  { type: 'hen', icon: '/icons/hen.png', color: 'bg-green-100' },
  { type: 'buffalo', icon: '/icons/buffalo.png', color: 'bg-orange-300' },
  { type: 'goat', icon: '/icons/goat.png', color: 'bg-yellow-100' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [animalCounts, setAnimalCounts] = useState({});

  useEffect(() => {
    const fetchAnimalCounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/animals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const animals = await res.json();

        const counts = {};
        animalTypes.forEach((a) => (counts[a.type] = 0));

        animals.forEach((animal) => {
          const type = animal.type.toLowerCase();
          if (counts[type] !== undefined) {
            counts[type] += animal.count || 0;
          }
        });

        setAnimalCounts(counts);
      } catch (err) {
        console.error('Failed to fetch animal counts:', err);
      }
    };

    fetchAnimalCounts();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-neutral-100">
      <div
        className="rounded-xl p-6 shadow-lg bg-white bg-opacity-95 backdrop-blur-md"
        style={{
          backgroundImage: 'url(/images/farm-bg.png)', // ✅ Set background image here
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        

        <h3 className="text-3xl font-bold mb-6 flex items-center gap-4 text-green-800 border border-green-300 px-6 py-3 rounded-full shadow-inner bg-white/80 backdrop-blur">
          <img
            src="/icons/animals.png"
            alt="Animal Icon"
            className="w-10 h-10 object-contain"
          />
          Animal Count
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {animalTypes.map((animal) => (
            <div
              key={animal.type}
              onClick={() => navigate(`/${animal.type}`)}
              className={`cursor-pointer rounded-lg p-4 ${animal.color} text-center shadow-md hover:shadow-xl transform transition hover:scale-105`}
            >
              <img
                src={animal.icon}
                alt={animal.type}
                className="w-12 h-12 mx-auto mb-2 object-contain"
              />
              <p className="text-xl font-bold">{animalCounts[animal.type] || 0}</p>
              <p className="text-sm capitalize">{animal.type}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AlertBox />
          <WeatherBox />
          <TaskList />
        </div>
      </div>
    </div>
  );
}
