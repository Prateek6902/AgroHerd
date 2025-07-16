import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddAnimalModal from './AddAnimalModal';

const animalMeta = {
  cow: { icon: '/icons/cow.png', eats: 'Grass, Hay, TMR', products: ['Milk', 'Dung'] },
  pig: { icon: '/icons/pig.png', eats: 'Grains, Vegetables, Leftovers', products: ['Meat'] },
  sheep: { icon: '/icons/sheep.png', eats: 'Grass, Clover', products: ['Wool', 'Meat'] },
  hen: { icon: '/icons/hen.png', eats: 'Grains, Insects', products: ['Eggs', 'Meat'] },
  buffalo: { icon: '/icons/buffalo.png', eats: 'Grass, Straw, Bran, TMR', products: ['Milk', 'Dung'] },
  goat: { icon: '/icons/goat.png', eats: 'Leaves, Shrubs, Hay', products: ['Milk', 'Meat'] },
};

export default function AnimalPage({ type }) {
  const [data, setData] = useState({ total: 0, ageGroups: {}, breedGroups: {} });
  const [animalEntries, setAnimalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const meta = animalMeta[type] || {
    icon: '/icons/fallback.png',
    eats: 'Varied diet',
    products: ['Farm Products'],
  };

  const fetchAnimalData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [summaryRes, listRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/animals/${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/animals`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const { total = 0, ageGroups = {}, breedGroups = {} } = summaryRes.data || {};
      setData({ total, ageGroups, breedGroups });

      const filtered = listRes.data.filter((item) => item.type === type);
      setAnimalEntries(filtered);
    } catch (err) {
      setError('Failed to load animal data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimalData();
  }, [type]);

  const handleReduceAnimal = async (id, currentCount) => {
    const quantity = parseInt(prompt(`How many to remove? (1 - ${currentCount})`), 10);
    if (!quantity || quantity < 1 || quantity > currentCount) {
      alert('Invalid quantity');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/animals/${id}/reduce`, {
        quantity,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAnimalData();
    } catch (err) {
      alert('Failed to reduce animal count');
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading {type} data...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-6 p-6">
      {/* Header with capsule and icon */}
      <div className="flex items-center gap-4 bg-green-100 rounded-full px-4 py-2 shadow-md">
        <img src={meta.icon} alt={type} className="w-10 h-10 object-contain" />
        <h2 className="text-2xl md:text-3xl font-extrabold capitalize text-green-800">
          {type} Management
        </h2>
      </div>

      {/* Overview box */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>What they eat:</strong> {meta.eats}</p>
        <p><strong>Products:</strong> {meta.products.join(', ')}</p>
        <p><strong>Total {type}s:</strong> {data.total || 0}</p>
      </div>

      {/* Add Animal Section */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Add {type}</h3>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Animal
          </button>
        </div>
      </div>

      {/* Animal Entries List */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Your {type}s</h3>
        {animalEntries.length ? (
          <ul className="space-y-2">
            {animalEntries.map((a) => (
              <li key={a._id} className="flex justify-between items-center border-b py-1">
                <span>{a.count} × {a.breedGroup} ({a.ageGroup})</span>
                <button
                  onClick={() => handleReduceAnimal(a._id, a.count)}
                  className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No records found.</p>
        )}
      </div>

      {/* Distribution Sections */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Age Group Distribution</h3>
          {Object.keys(data.ageGroups).length ? (
            <ul className="list-disc pl-6 space-y-1">
              {Object.entries(data.ageGroups).map(([age, count]) => (
                <li key={age}><strong>{age}:</strong> {count}</li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No age data available.</p>}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Breed Group Distribution</h3>
          {Object.keys(data.breedGroups).length ? (
            <ul className="list-disc pl-6 space-y-1">
              {Object.entries(data.breedGroups).map(([breed, count]) => (
                <li key={breed}><strong>{breed}:</strong> {count}</li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No breed data available.</p>}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddAnimalModal
          type={type}
          onClose={() => setShowModal(false)}
          onAdded={fetchAnimalData}
        />
      )}
    </div>
  );
}
