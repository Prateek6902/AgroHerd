// TaskList.jsx placeholder
// src/components/TaskList.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'; // Optional for custom styling

export default function TaskList() {
  const initialTasks = [
    { label: 'Check water supply', done: false },
    { label: 'Clean hen house', done: false },
    { label: 'Inspect buffalo shed', done: false },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [date, setDate] = useState(new Date());

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  return (
    <div className="bg-orange-100 p-4 rounded-lg shadow space-y-4">
      <h3 className="font-bold text-lg">Today’s Tasks</h3>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(index)}
              className="mr-2"
            />
            <span className={task.done ? 'line-through text-gray-500' : ''}>
              {task.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <h4 className="font-semibold text-md mb-1">📅 Calendar View</h4>
        <Calendar
          onChange={setDate}
          value={date}
          className="rounded-md w-full"
        />
      </div>
    </div>
  );
}
