import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShedManagerPage() {
  const [sheds, setSheds] = useState([]);
  const [form, setForm] = useState({ name: '', animal: 'Cow', capacity: '', _id: null });
  const [formError, setFormError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');

  const fetchSheds = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sheds', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSheds(res.data);
    } catch (error) {
      console.error('Failed to load sheds:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheds();
  }, []);

  const validateForm = () => {
    const capacity = Number(form.capacity);
    if (!form.name.trim() || isNaN(capacity) || capacity <= 0) {
      setFormError('Name and a positive capacity are required.');
      return false;
    }
    setFormError('');
    return true;
  };

  const resetForm = () => {
    setForm({ name: '', animal: 'Cow', capacity: '', _id: null });
    setFormError('');
    setIsEditing(false);
    setSaving(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      animal: form.animal,
      capacity: Number(form.capacity),
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/sheds/${form._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/sheds', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      setShowModal(false);
      fetchSheds();
    } catch (error) {
      alert('Failed to save shed.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (shed) => {
    setForm(shed);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shed?')) {
      try {
        await axios.delete(`http://localhost:5000/api/sheds/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchSheds();
      } catch (error) {
        alert('Delete failed.');
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/icons/shed.png" alt="Shed" className="w-20 h-20 object-contain" />
          <h2 className="text-3xl font-bold">Shed Manager</h2>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Shed
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading sheds...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {sheds.map((shed) => (
            <div
              key={shed._id}
              className="p-4 bg-white shadow rounded hover:shadow-lg transform hover:scale-105 transition-all relative"
            >
              <h3 className="font-semibold text-green-800">{shed.name}</h3>
              <p className="text-sm text-gray-700">Animal: {shed.animal}</p>
              <p className="text-sm text-gray-700">Capacity: {shed.capacity}</p>

              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(shed)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(shed._id)}
                  className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4">
            <h3 className="text-xl font-bold">{isEditing ? 'Edit' : 'Add'} Shed</h3>

            <input
              className="w-full border p-2 rounded"
              placeholder="Shed Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded"
              value={form.animal}
              onChange={(e) => setForm({ ...form, animal: e.target.value })}
            >
              {['Cow', 'Pig', 'Hen', 'Buffalo', 'Sheep'].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <input
              className="w-full border p-2 rounded"
              placeholder="Capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${
                  saving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {saving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
