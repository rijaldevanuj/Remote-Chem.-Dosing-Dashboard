import React, { useEffect, useRef, useState } from "react";
import { Droplet, TrendingUp, TrendingDown } from "lucide-react";
import { Syringe, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

export default function TailwindDemo() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({});
  const alertsSectionRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [flowData, setFlowData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [reportMetrics, setReportMetrics] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

 useEffect(() => {
  const fetchApiKeys = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/latest");
      const data = await response.json(); // ✅ FIXED HERE

      if (data) {
        setApiKeys(data); // keep this if used elsewhere

        // ✅ Update chart data states from API
        if (data.flow) setFlowData(data.flow);
        if (data.volume) setVolumeData(data.volume);
        if (data.report) setReportMetrics(data.report);
      }

      console.log("Fetched API keys:", data);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  fetchApiKeys(); // initial fetch
  const interval = setInterval(fetchApiKeys, 1000); // fetch every second

  return () => clearInterval(interval); // cleanup on unmount
}, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  //Calculate flow rate and threshold 
  // Assuming apiKeys.FlowRate_L_per_min is a string that can be parsed to a float
  // and apiKeys.TankLevel_cm is a string that can be parsed to an integer
  // Adjust the parsing logic based on your actual API response structure
  const flowRate = parseFloat(apiKeys.FlowRate_L_per_min) || 0;
  const threshold = 50;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0d0f1c] text-white">
      {/* Mobile Header */}
      <div className="flex justify-between items-center p-4 bg-[#112240] rounded-b-lg md:hidden">
        <div className="text-lg font-bold">Dashboard</div>
        <button
          onClick={toggleMobileMenu}
          className="text-gray-400 hover:text-white"
        >
          {isMobileMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Desktop Sidebar */}
                  
      <div className="hidden md:flex md:flex-col md:w-64 bg-[#112240] p-4 rounded-r-lg sidebar sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-6">
          {/*
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">D</span>
          </div> 
          */}
          <h2 className="text-xl font-bold text-white">Dashboard</h2>
        </div>

        <nav className="flex flex-col gap-4">
          <Link
            to="/"
            className="px-4 py-2 rounded hover:bg-[#88bae03d] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-4 py-2 rounded hover:bg-[#88bae03d] transition-colors"
          >
            About
          </Link>
          {/* Add more links as needed */}
        </nav>
            {/* Bottom Button */}
    <div className="mt-auto pt-6">
      <button className="w-full px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-200 font-semibold">
        Launch
  
      </button>
      </div>
      
      </div> 

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Time Display */}
        <div className="text-right text-xs md:text-sm text-gray-400 font-mono">
          6/23/2025 | {currentTime}
        </div>

        {/* Hero Section */}
        <div
          ref={heroSectionRef}
          className="relative h-32 md:h-44 my-2 md:my-4 rounded-lg overflow-hidden"
        >
          <img
            src="https://i.pinimg.com/736x/37/62/49/376249692f7c4ac432727d3d637bafc8.jpg"
            alt="Plant"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-center">
              Flow State & Level Dashboard
            </h1>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Tank Level */}
          <div className="bg-[#112240] p-6 rounded-xl shadow-md relative h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-blue-300">Tank Level</div>
              <span className="bg-green-600 text-sm px-2 py-1 rounded-full">
                Safe
              </span>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-60 h-60">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <path
                    className="text-gray-700"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M24 4
                      a 20 20 0 0 1 0 40
                      a 20 20 0 0 1 0 -40"
                  />
                  <path
                    className="text-blue-500"
                    strokeWidth="3"
                    strokeDasharray="72, 100"
                    stroke="currentColor"
                    fill="none"
                    d="M24 4
                      a 20 20 0 0 1 0 40
                      a 20 20 0 0 1 0 -40"
                  />
                </svg>

               {(() => {
  const level = parseInt(apiKeys.TankLevel_cm) || 0;
  const threshold = 150;


  let warningMessage = '';

  if (level > threshold) {
    warningMessage = `⚠️ Warning: Tank level is high (${level} cm)`;
    console.warn(warningMessage);
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-2xl font-bold text-white">
      {level}
      <br />
      <span className="text-xs font-normal">Capacity</span>
      {warningMessage && (
        <div className="mt-4 text-yellow-400 text-sm font-medium animate-pulse">
          {warningMessage}
        </div>
      )}
    </div>
  );
})()}

              </div>
            </div>
          </div>


          {/* Flow Rate */}
  <div className="bg-[#112240] p-6 rounded-xl shadow-md h-[400px] flex flex-col">
    {/* Top Section: Title and Warning */}
    <div className="flex items-center justify-between w-full mb-4">
      <div className="flex items-center gap-2 text-blue-300 text-lg font-semibold">
        <Droplet className="w-5 h-5 text-blue-400" />
        Flow Rate
      </div>
      <span className="bg-yellow-600 text-sm px-2 py-1 rounded-full">Warning</span>
    </div>

    {/* Centered Flow Value */}
    <div className="flex flex-col flex-1 justify-center items-center gap-2">
      <TrendingUp className="w-8 h-8 text-green-400 mb-1" />
      <div className="text-6xl font-extrabold text-white">
        {flowRate}
        <span className="text-xl font-semibold ml-1">L/min</span>
      </div>
      <TrendingDown className="w-5 h-5 text-red-400 mt-1" />
      <div className="text-lg text-yellow-300 font-medium">
        {flowRate}
      </div>

      {/* Conditional Warning */}
      {flowRate > threshold && (
        <div className="mt-3 text-red-500 font-medium text-sm animate-pulse">
          ⚠️ Warning: Flow rate is high!
        </div>
      )}
    </div>
  </div>



          {/* Dosing Volume */}

  <div className="bg-[#112240] p-6 rounded-xl shadow-md h-[400px] flex flex-col">
    {/* Title */}
    <div className="flex items-center justify-between w-full mb-4">
      <div className="flex items-center gap-2 text-blue-300 text-lg font-semibold">
        <Syringe className="w-5 h-5 text-blue-400" />
        Dosing Volume
      </div>
      <span className="bg-yellow-600 text-sm px-2 py-1 rounded-full">Monitoring</span>
    </div>

    {/* Centered Volume Value */}
    <div className="flex flex-col flex-1 justify-center items-center gap-2">
      <div className="text-6xl font-extrabold text-white">
        {(apiKeys.TotalVolume_L) || 0}
        <span className="text-xl font-semibold ml-1">L</span>
      </div>
      <div className="text-lg text-yellow-300 font-medium">
        {(apiKeys.TotalVolume_L) || 0} mL
      </div>

      {/* Conditional Warning */}
      {(apiKeys.TotalVolume_L) > threshold && (
        <div className="mt-3 flex items-center gap-2 text-red-500 font-medium text-sm animate-pulse">
          <AlertCircle className="w-4 h-4" />
          ⚠️ Warning: Dosing volume too high!
        </div>
      )}
    </div>
  </div>

        </div> 






        {/* Alerts Section */}
        <div
          ref={alertsSectionRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6"
        >
          {/* Recent Alerts Panel */}
          <div className="md:col-span-2 bg-[#112240] p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⚠</span>
                <h2 className="text-lg font-semibold">Recent Alerts</h2>
              </div>
              <button className="text-blue-400 text-sm hover:text-blue-300">
                View All
              </button>
            </div>

            {/* Alert Items */}
            <div className="space-y-4">
              <div className="flex items-start justify-between bg-[#1B2C4F] p-4 rounded-lg">
                <div className="flex gap-3">
                  <span className="text-red-500 mt-1">⊗</span>
                  <div>
                    <h3 className="font-medium">
                      Dosing Volume Exceeds Threshold
                    </h3>
                    <p className="text-sm text-gray-400">
                      Chemical dosing volume reached 125mL, exceeding the safe
                      threshold of 90mL.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">10:30 AM</span>
                  <button className="block text-sm text-blue-400 hover:text-blue-300 mt-1">
                    Acknowledge
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between bg-[#1B2C4F] p-4 rounded-lg">
                <div className="flex gap-3">
                  <span className="text-yellow-500 mt-1">⚠</span>
                  <div>
                    <h3 className="font-medium">
                      Flow Rate Approaching Upper Limit
                    </h3>
                    <p className="text-sm text-gray-400">
                      Flow rate increased to 8.5 L/min, approaching the maximum
                      recommended rate of 10 L/min.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">09:45 AM</span>
                  <button className="block text-sm text-blue-400 hover:text-blue-300 mt-1">
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-[#112240] p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                <span>⬇</span> Download Report
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                <span>⟲</span> Switch to Simulation
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                <span>🔕</span> Mute Alerts (30m)
              </button>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                <span>⚠</span> Emergency Stop
              </button>
            </div>

            {/* System Health */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span>System Health</span>
                <span className="text-green-400">Good</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "95%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Next maintenance scheduled in 12 days
              </p>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
          <div className="md:col-span-3 bg-[#112240] p-4 md:p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-3 md:space-y-0">
              <h2 className="text-lg md:text-xl font-semibold">
                Reports Dashboard
              </h2>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <select className="bg-[#1B2C4F] text-sm px-3 py-1.5 rounded-lg border border-gray-700 w-full md:w-auto">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Custom Range</option>
                </select>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 w-full md:w-auto">
                  <span>📊</span> Generate Report
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {reportMetrics.map((metric, index) => (
                <div key={index} className="bg-[#1B2C4F] p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm">{metric.title}</h3>
                  <div className="text-2xl font-bold mt-1">{metric.value}</div>
                  <div
                    className={`text-sm mt-1 ${
                      metric.change.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {metric.change} from last period
                  </div>
                </div>
              ))}
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#1B2C4F] p-4 rounded-lg hover:bg-[#243860] transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Performance Analysis</h3>
                  <span>📈</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Detailed system performance metrics and trends
                </p>
              </div>

              <div className="bg-[#1B2C4F] p-4 rounded-lg hover:bg-[#243860] transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Maintenance Log</h3>
                  <span>🔧</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Service history and upcoming maintenance schedule
                </p>
              </div>

              <div className="bg-[#1B2C4F] p-4 rounded-lg hover:bg-[#243860] transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Compliance Report</h3>
                  <span>📋</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Safety and regulatory compliance documentation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Section */}
        {/* <div className="mt-8 bg-[#112240] p-6 rounded-xl shadow-md">
          <h2 className
="text-lg font-semibold mb-4">Logs</h2>
          {/* Logs content will be rendered here if needed */}
        {/* </div> */}
      </main>
    </div>
  );
}




