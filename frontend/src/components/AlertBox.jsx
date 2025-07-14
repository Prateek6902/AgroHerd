// AlertBox.jsx placeholder
// src/components/AlertBox.jsx
import React from 'react';
const alertStyles = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800'
};

const alertIcons = {
  info: 'ℹ️',
  warning: '⚠️',
  danger: '🚨'
};

export default function AlertBox({
  alerts = [
    { message: 'Low feed for cows', time: '2 hrs ago', level: 'warning' },
    { message: 'Upcoming vaccination', time: '1 day ago', level: 'info' },
    { message: 'Sheep in heat', time: '30 min ago', level: 'danger' }
  ]
}) {
  return (
    <div className="bg-orange-300 p-4 rounded-lg shadow-md transition hover:shadow-lg hover:scale-[1.01]">
      <h3 className="text-md font-bold mb-3">📢 Latest Alerts</h3>
      <ul className="space-y-3">
        {alerts.map((alert, i) => (
          <li
            key={i}
            className={`flex items-start gap-3 p-2 rounded-md ${alertStyles[alert.level]}`}
          >
            <span className="text-xl">{alertIcons[alert.level]}</span>
            <div>
              <p className="font-medium">{alert.message}</p>
              <span className="text-xs text-gray-600">{alert.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
