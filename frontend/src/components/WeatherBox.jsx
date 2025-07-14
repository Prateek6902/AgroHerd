// WeatherBox.jsx placeholder
// src/components/WeatherBox.jsx
import React from 'react';
import { useEffect, useState } from 'react';

export default function WeatherBox() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const API_KEY = '22d5beb5f9dc23dcab4ad4f119dba512'; // Replace with OpenWeatherMap key
  const CITY = 'indore';

  useEffect(() => {
    // Fetch current weather + sunrise/sunset
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCurrent({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
        });
      });

    // Fetch 3-day forecast
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const dailyForecast = [];

        for (let i = 0; i < data.list.length; i += 8) {
          const entry = data.list[i];
          dailyForecast.push({
            date: new Date(entry.dt * 1000).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            }),
            temp: Math.round(entry.main.temp),
            condition: entry.weather[0].main,
            icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`
          });
        }

        setForecast(dailyForecast.slice(0, 3));
      });
  }, []);

  return (
    <div className="bg-orange-100 p-4 rounded-lg shadow hover:shadow-lg transition space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Weather</h3>
        {current && <img src={current.icon} alt="Weather icon" className="w-8 h-8" />}
      </div>

      {current ? (
        <div className="text-center">
          <div className="text-3xl font-bold">{current.temp}°C</div>
          <div className="text-sm text-gray-700 capitalize">{current.condition}</div>
          <div className="mt-2 text-xs text-gray-600">
            🌅 Sunrise: {current.sunrise} <br />
            🌇 Sunset: {current.sunset}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Loading current weather...</p>
      )}

      <div className="border-t pt-2">
        <h4 className="text-sm font-semibold mb-2">3-Day Forecast</h4>
        <div className="grid grid-cols-3 gap-2">
          {forecast.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded p-2 text-center hover:scale-105 transition"
            >
              <p className="text-xs font-semibold">{f.date}</p>
              <img src={f.icon} alt={f.condition} className="w-6 h-6 mx-auto" />
              <p className="text-xs">{f.temp}°C</p>
              <p className="text-[10px] text-gray-500">{f.condition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
