import React from 'react';

export default function Settings() {
  const settingsGroups = [
    {
      title: "System Configuration",
      settings: [
        { name: "Flow Rate Limits", value: "5.0 - 10.0 L/min", type: "range" },
        { name: "Tank Level Alerts", value: "15% - 95%", type: "range" },
        { name: "Chemical Dosing Rate", value: "2.5 mL/min", type: "number" }
      ]
    },
    {
      title: "Notifications",
      settings: [
        { name: "Email Alerts", value: true, type: "toggle" },
        { name: "SMS Notifications", value: false, type: "toggle" },
        { name: "Alert Sound", value: true, type: "toggle" }
      ]
    },
    {
      title: "Maintenance",
      settings: [
        { name: "Scheduled Checks", value: "Weekly", type: "select" },
        { name: "Backup Frequency", value: "Daily", type: "select" },
        { name: "Data Retention", value: "90 days", type: "select" }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      {settingsGroups.map((group, idx) => (
        <div key={idx} className="bg-[#112240] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">{group.title}</h2>
          <div className="space-y-4">
            {group.settings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <h3 className="font-medium">{setting.name}</h3>
                  <p className="text-sm text-gray-400">Current: {setting.value.toString()}</p>
                </div>
                {setting.type === 'toggle' && (
                  <button className={`w-12 h-6 rounded-full p-1 ${setting.value ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${setting.value ? 'translate-x-6' : ''}`} />
                  </button>
                )}
                {setting.type === 'range' && (
                  <button className="text-blue-400 hover:text-blue-300">Configure</button>
                )}
                {setting.type === 'select' && (
                  <select className="bg-[#1B2C4F] text-sm px-3 py-1.5 rounded-lg border border-gray-700">
                    <option>{setting.value}</option>
                  </select>
                )}
                {setting.type === 'number' && (
                  <input 
                    type="number" 
                    className="bg-[#1B2C4F] text-sm px-3 py-1.5 rounded-lg border border-gray-700 w-24"
                    value={setting.value.split(' ')[0]}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
