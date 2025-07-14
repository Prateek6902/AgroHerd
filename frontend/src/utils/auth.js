// src/utils/auth.js

export const getRole = () => localStorage.getItem('role');

export const getName = () => localStorage.getItem('name');

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};
