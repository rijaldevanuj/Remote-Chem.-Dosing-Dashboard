import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const lineData = [
  { time: "Jan", gallons: 9000 },
  { time: "Feb", gallons: 8800 },
  { time: "Mar", gallons: 8600 },
  { time: "Apr", gallons: 8500 },
  { time: "May", gallons: 8300 },
  { time: "Jun", gallons: 8100 },
];

const realtimeLevel = 7200; // current gallons level
const tankCapacity = 12000;

const TankCard = ({ title, lineData, currentGallons }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="gallons" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-24 flex flex-col justify-center items-center">
        <h3 className="text-sm mb-1">Real-Time</h3>
        <div className="h-48 w-6 bg-gray-200 rounded-full relative">
          <div
            className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-full"
            style={{ height: `${(currentGallons / tankCapacity) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs mt-2">{currentGallons} gal</p>
      </div>
    </div>
  );
};

export default function TankDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <TankCard title="Tank Level" lineData={lineData} currentGallons={7200} />
      <TankCard title="Flow Rate" lineData={lineData} currentGallons={5200} />
      <TankCard title="Dosing Volume" lineData={lineData} currentGallons={6400} />
    </div>
  );
}
``


