// src/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const isRender = window.location.hostname.includes('onrender.com');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user.name);
        localStorage.setItem('role', 'farmer');
        localStorage.removeItem('guest'); // clear guest flag if present
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  const handleGuestAccess = () => {
    localStorage.setItem('guest', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-3"
        >
          Login
        </button>

        <p className="text-sm text-center mb-3">
          Don’t have an account?{' '}
          <a href="/register" className="text-green-600 hover:underline">
            Register
          </a>
        </p>

        {isRender && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Want to explore without logging in?</p>
            <button
              onClick={handleGuestAccess}
              className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-500 transition"
            >
              👀 Continue as Guest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
