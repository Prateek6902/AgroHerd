// src/utils/auth.js

export const isGuest = () => localStorage.getItem('guest') === 'true';

export const getRole = () => {
  if (isGuest()) return 'guest';
  return localStorage.getItem('role');
};

export const getName = () => {
  if (isGuest()) return 'Guest';
  return localStorage.getItem('name');
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};
