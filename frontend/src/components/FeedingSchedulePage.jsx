import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FeedingSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [animal, setAnimal] = useState('Cow');
  const [time, setTime] = useState('');
  const [food, setFood] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchSchedules = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data);
    } catch (err) {
      console.error('Failed to load feeding schedules:', err.message);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const validate = () => {
    if (!time || !food.trim()) {
      setFormError('Time and food details are required');
      return false;
    }
    setFormError('');
    return true;
  };

  const addSchedule = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:5000/api/feedings',
        { animalType: animal, time, food },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTime('');
      setFood('');
      fetchSchedules();
    } catch (err) {
      alert('Failed to add feeding schedule');
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/feedings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSchedules();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <img src="/icons/feeding.png" alt="Feeding Icon" className="w-20 h-20 object-contain" />
        <h2 className="text-3xl font-bold">Feeding Schedule</h2>
        </div>


      {/* Display all schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.length === 0 && (
          <p className="text-gray-500 col-span-2">No feeding schedules found.</p>
        )}

        {schedules.map((s) => (
          <div
            key={s._id}
            className="bg-white p-4 shadow rounded relative hover:shadow-lg transition transform hover:scale-[1.02]"
          >
            <h3 className="font-semibold text-green-700">{s.animalType}</h3>
            <p className="text-sm text-gray-700">Time: {s.time}</p>
            <p className="text-sm text-gray-700">Food: {s.food}</p>
            <button
              onClick={() => deleteSchedule(s._id)}
              className="absolute top-2 right-2 text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              aria-label="Delete schedule"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Schedule Form */}
      <div className="bg-yellow-100 p-4 rounded shadow space-y-3">
        <h3 className="font-semibold text-lg text-yellow-900">Add Feeding Schedule</h3>

        <div className="space-y-2">
          <select
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
            className="p-2 border w-full rounded"
          >
            {['Cow', 'Pig', 'Sheep', 'Hen', 'Buffalo'].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border w-full rounded"
            required
          />

          <input
            type="text"
            placeholder="Food Details"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="p-2 border w-full rounded"
            required
          />

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            onClick={addSchedule}
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding...' : 'Add Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}
