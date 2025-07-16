import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isGuest } from '../utils/auth'; // ✅ import guest mode check

export default function AddAnimalModal({ type, onClose, onAdded }) {
  const [ageGroup, setAgeGroup] = useState('');
  const [breedGroup, setBreedGroup] = useState('');
  const [count, setCount] = useState('');
  const [shedId, setShedId] = useState('');
  const [sheds, setSheds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const guest = isGuest(); // ✅ check if user is guest

  const breedOptions = {
    cow: ['Local', 'Jersey', 'Holstein', 'Desi'],
    buffalo: ['Murrah', 'Jaffarabadi', 'Banni', 'Desi'],
    sheep: ['Merino', 'Desi'],
    hen: ['Broiler', 'Layer', 'Desi'],
    pig: ['Yorkshire', 'Landrace', 'Desi'],
    goat: ['Boer', 'Jamunapari', 'Barbari', 'Desi'],
  };

  const ageOptions = ['0-6m', '6m-1y', '1-2y', '2+y'];

  useEffect(() => {
    if (guest) return; // skip fetching sheds for guest
    const fetchSheds = async () => {
      try {
        const token = localStorage.getItem('token');
        const [shedRes, animalRes] = await Promise.all([
          axios.get('http://localhost:5000/api/sheds', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/animals', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const allAnimals = animalRes.data;

        const filtered = shedRes.data
          .filter((shed) => shed.animal.toLowerCase() === type.toLowerCase())
          .map((shed) => {
            const used = allAnimals
              .filter((a) => a.shed === shed._id && a.type === type)
              .reduce((sum, a) => sum + a.count, 0);
            return {
              ...shed,
              remaining: shed.capacity - used,
            };
          });

        setSheds(filtered);
      } catch (err) {
        console.error('Error fetching sheds or animals', err);
      }
    };

    fetchSheds();
  }, [type, guest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (guest) {
      setError('Guest users cannot add animals.');
      return;
    }

    if (!ageGroup || !breedGroup || !count || !shedId) {
      setError('All fields are required.');
      return;
    }

    const selectedShed = sheds.find((s) => s._id === shedId);
    if (selectedShed && parseInt(count) > selectedShed.remaining) {
      setError(`Shed "${selectedShed.name}" only has ${selectedShed.remaining} spots left.`);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/animals',
        {
          type,
          ageGroup,
          breedGroup,
          count: parseInt(count),
          shedId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add animal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h3 className="text-2xl font-bold capitalize text-center">Add {type}</h3>

        {guest && (
          <p className="text-yellow-700 text-sm text-center font-semibold">
            You are in guest mode. You can view but not add animals.
          </p>
        )}

        {!guest && (
          <div>
            <label className="block text-sm font-medium mb-1">Select Shed</label>
            <select
              className="w-full border p-2 rounded"
              value={shedId}
              onChange={(e) => setShedId(e.target.value)}
              required
            >
              <option value="">Select Shed</option>
              {sheds.map((shed) => (
                <option
                  key={shed._id}
                  value={shed._id}
                  disabled={parseInt(count || 0) > shed.remaining}
                >
                  {shed.name} (Remaining: {shed.remaining})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Age Group</label>
          <select
            className="w-full border p-2 rounded"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            required
          >
            <option value="">Select Age Group</option>
            {ageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Breed Group</label>
          <select
            className="w-full border p-2 rounded"
            value={breedGroup}
            onChange={(e) => setBreedGroup(e.target.value)}
            required
          >
            <option value="">Select Breed Group</option>
            {(breedOptions[type] || []).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Count</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            min={1}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={loading || guest}
          >
            {loading ? 'Adding...' : guest ? 'View Only' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
