import React, { useEffect, useState } from 'react';
import {
  Line,
  Bar,
  Pie
} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [milkData, setMilkData] = useState(null);
  const [eggData, setEggData] = useState(null);
  const [animalData, setAnimalData] = useState(null);
  const [ageData, setAgeData] = useState(null);
  const [productData, setProductData] = useState(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/analytics/milk', { headers }),
      fetch('http://localhost:5000/api/analytics/eggs', { headers }),
      fetch('http://localhost:5000/api/analytics/animals', { headers }),
      fetch('http://localhost:5000/api/analytics/animals/age', { headers }),
      fetch('http://localhost:5000/api/analytics/products/detailed', { headers }),
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(([milk, eggs, animals, ages, products]) => {
        setMilkData({
          labels: milk.map((d) => new Date(d.date).toLocaleDateString()),
          datasets: [{
            label: 'Milk (L)',
            data: milk.map((d) => d.quantity),
            borderColor: 'green',
            fill: false,
          }],
        });

        setEggData({
          labels: eggs.map((d) => new Date(d.date).toLocaleDateString()),
          datasets: [{
            label: 'Eggs',
            data: eggs.map((d) => d.quantity),
            backgroundColor: 'orange',
          }],
        });

        setAnimalData({
          labels: animals.map((a) => a.type),
          datasets: [{
            label: 'Animal Count',
            data: animals.map((a) => a.count),
            backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#e91e63', '#9c27b0'],
          }],
        });

        setAgeData({
          labels: ages.map((a) => a.ageGroup),
          datasets: [{
            label: 'Age Group Count',
            data: ages.map((a) => a.count),
            backgroundColor: 'teal',
          }],
        });

        setProductData({
          labels: products.map((p) => `${p.type} (${p.source || 'Unknown'})`),
          datasets: [{
            label: 'Total',
            data: products.map((p) => p.total),
            backgroundColor: 'purple',
          }],
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Milk (Last 7 days)</h3>
          {milkData ? <Line data={milkData} /> : <p>Loading...</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Eggs (Last 7 days)</h3>
          {eggData ? <Bar data={eggData} /> : <p>Loading...</p>}
        </div>

        <div className="bg-white p-4 rounded shadow col-span-2">
          <h3 className="font-semibold">Animal Distribution</h3>
          {animalData ? <Pie data={animalData} /> : <p>Loading...</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Animal Age Groups</h3>
          {ageData ? <Bar data={ageData} /> : <p>Loading...</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">All Product Totals (by source)</h3>
          {productData ? <Bar data={productData} /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}
