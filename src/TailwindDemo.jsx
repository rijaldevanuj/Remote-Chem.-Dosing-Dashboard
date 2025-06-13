import React, { useRef, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const alertsSectionRef = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToAlerts = () => {
    alertsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHero = () => {
    heroSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const flowData = [
    { time: "10:00", value: 7.0 },
    { time: "10:10", value: 7.5 },
    { time: "10:20", value: 8.0 },
    { time: "10:30", value: 8.3 },
    { time: "10:40", value: 8.5 },
    { time: "10:50", value: 8.8 },
    { time: "11:00", value: 9.0 },
  ];

  const volumeData = [
    { time: "10:00", value: 75 },
    { time: "10:10", value: 90 },
    { time: "10:20", value: 100 },
    { time: "10:30", value: 115 },
    { time: "10:40", value: 125 },
    { time: "10:50", value: 130 },
  ];

  // Add new data for reports
  const reportMetrics = [
    { title: "Total Flow Volume", value: "2,547.3 L", change: "+12.5%" },
    { title: "Average Flow Rate", value: "8.2 L/min", change: "-2.1%" },
    { title: "Chemical Usage", value: "156.8 mL", change: "+5.3%" },
    { title: "System Uptime", value: "99.7%", change: "+0.2%" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0d0f1c] text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#082032]">
        <div className="text-xl font-bold">Dashboard</div>
        <button onClick={toggleMobileMenu} className="text-2xl">
          {isMobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        ${isMobileMenuOpen ? "flex" : "hidden"} 
        md:flex flex-col w-full md:w-60 bg-[#082032] p-6 space-y-8 
        md:sticky md:top-0 md:h-screen
        absolute top-16 z-50
      `}
      >
        <div className="text-xl font-bold">Dashboard</div>
        <nav className="space-y-4">
          <div
            onClick={scrollToHero}
            className="hover:bg-white/10 hover:border hover:border-white/30 py-2 px-3 rounded-lg cursor-pointer transition-all"
          >
            Analytics
          </div>
          <div
            onClick={scrollToAlerts}
            className="hover:bg-white/10 hover:border hover:border-white/30 py-2 px-3 rounded-lg cursor-pointer transition-all"
          >
            Reports
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Time Display */}
        <div className="text-right text-xs md:text-sm text-gray-400 font-mono">
          6/13/2025 | {currentTime}
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
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  72%
                  <br />
                  <br />
                  <span className="text-xs font-normal">Capacity</span>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-300">
                Min Level: 15% | Max Level: 95%
              </div>
            </div>
          </div>

          {/* Flow Rate */}
          <div className="bg-[#112240] p-6 rounded-xl shadow-md h-[400px]">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-blue-300">Flow Rate</div>
              <span className="bg-yellow-600 text-sm px-2 py-1 rounded-full">
                Warning
              </span>
            </div>
            <div className="text-4xl font-bold">
              8.5 <span className="text-sm">L/min</span>
            </div>
            <div className="text-sm text-yellow-300">
              +1.2 L/min from average
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={flowData}
                margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#facc15"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Dosing Volume */}
          <div className="bg-[#112240] p-6 rounded-xl shadow-md h-[400px]">
            <div className="font-semibold text-blue-300 mb-2">Dosing Volume</div>
            <div className="text-4xl font-bold">
              125 <span className="text-sm">mL</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={volumeData}
                margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
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
      </main>
    </div>
  );
}



