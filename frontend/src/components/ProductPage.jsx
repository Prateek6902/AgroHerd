import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', quantity: '', icon: '', _id: null });
  const [formError, setFormError] = useState('');

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setError('');
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const validateForm = () => {
    if (!form.name || !form.quantity || !form.icon) {
      setFormError('All fields are required');
      return false;
    }
    if (isNaN(form.quantity) || Number(form.quantity) <= 0) {
      setFormError('Quantity must be a positive number');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      type: form.name,
      quantity: Number(form.quantity),
      icon: form.icon,
      unit: 'unit',
      source: 'manual',
    };

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/products/${form._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      setForm({ name: '', quantity: '', icon: '', _id: null });
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.type,
      quantity: product.quantity,
      icon: product.icon,
      _id: product._id,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/icons/products.png" alt="Product Icon" className="w-20 h-20 object-contain" />
          <h2 className="text-3xl font-bold">Farm Products Overview</h2>
          </div>
          <button
          onClick={() => {
            setIsEditing(false);
            setForm({ name: '', quantity: '', icon: '', _id: null });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative"
            >
              <img
                src={p.icon}
                alt={p.type}
                className="w-12 h-12 mx-auto mb-2 object-contain"
                onError={(e) => {
                  if (e.target.src !== '/icons/fallback.png') {
                    e.target.src = '/icons/fallback.png';
                  }
                }}
              />
              <h3 className="font-semibold text-green-800">{p.type}</h3>
              <p className="text-sm text-gray-600">
                {p.quantity} {p.unit || ''}
              </p>

              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
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
            <h3 className="text-xl font-bold">
              {isEditing ? 'Edit' : 'Add'} Product
            </h3>

            <input
              className="w-full border p-2 rounded"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Icon Path"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${
                  saving
                    ? 'bg-green-400'
                    : 'bg-green-600 hover:bg-green-700'
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
