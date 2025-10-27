import { ArrowLeft, Download, Share2, Settings } from "lucide-react";
import MiniChart from "./MiniChart";
import DataTable from "./DataTable";

const DashboardView = ({ dashboard, onBack }) => {
  // Generate dynamic data based on dashboard type
  const generateChartData = () => {
    if (dashboard.name.includes("Temperature")) {
      return {
        temp: Array.from({ length: 24 }, () => 20 + Math.random() * 10),
        humidity: Array.from({ length: 24 }, () => 40 + Math.random() * 30),
      };
    } else if (dashboard.name.includes("Power")) {
      return {
        power: Array.from({ length: 24 }, () => 150 + Math.random() * 100),
        voltage: Array.from({ length: 24 }, () => 220 + Math.random() * 10),
      };
    } else {
      return {
        metric1: Array.from({ length: 24 }, () => 50 + Math.random() * 50),
        metric2: Array.from({ length: 24 }, () => 30 + Math.random() * 40),
      };
    }
  };

  const chartData = generateChartData();

  const sensorData = [
    {
      source: "Temperature Sensor A",
      protocol: "MQTT",
      value: "24.5°C",
      status: "online",
      lastUpdate: "2s ago",
    },
    {
      source: "Humidity Monitor",
      protocol: "MQTT",
      value: "65%",
      status: "online",
      lastUpdate: "5s ago",
    },
    {
      source: "Factory PLC",
      protocol: "Modbus TCP",
      value: "1234",
      status: "online",
      lastUpdate: "10s ago",
    },
    {
      source: "Power Meter",
      protocol: "RS485",
      value: "250W",
      status: "online",
      lastUpdate: "15s ago",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <ArrowLeft className="text-white" size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {dashboard.name}
                </h1>
                <p className="text-slate-400 text-sm">{dashboard.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition flex items-center gap-2">
                <Settings size={18} /> Settings
              </button>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition flex items-center gap-2">
                <Share2 size={18} /> Share
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2">
                <Download size={18} /> Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Current Value</p>
            <h3 className="text-3xl font-bold text-white">
              {dashboard.name.includes("Temperature")
                ? "24.5°C"
                : dashboard.name.includes("Power")
                ? "245W"
                : "1,234"}
            </h3>
            <p className="text-green-400 text-sm mt-2">↑ 2.5% from yesterday</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Average (24h)</p>
            <h3 className="text-3xl font-bold text-white">
              {dashboard.name.includes("Temperature")
                ? "23.8°C"
                : dashboard.name.includes("Power")
                ? "238W"
                : "1,189"}
            </h3>
            <p className="text-slate-400 text-sm mt-2">Within normal range</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Peak Value</p>
            <h3 className="text-3xl font-bold text-white">
              {dashboard.name.includes("Temperature")
                ? "29.3°C"
                : dashboard.name.includes("Power")
                ? "298W"
                : "1,456"}
            </h3>
            <p className="text-slate-400 text-sm mt-2">Today at 2:00 PM</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Data Points</p>
            <h3 className="text-3xl font-bold text-white">1,247</h3>
            <p className="text-blue-400 text-sm mt-2">Last update: 2s ago</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MiniChart
            title={
              dashboard.name.includes("Temperature")
                ? "Temperature"
                : dashboard.name.includes("Power")
                ? "Power Consumption"
                : "Primary Metric"
            }
            data={Object.values(chartData)[0]}
            color="blue"
            currentValue={Object.values(chartData)[0][23].toFixed(1)}
            unit={
              dashboard.name.includes("Temperature")
                ? "°C"
                : dashboard.name.includes("Power")
                ? "W"
                : "units"
            }
          />

          <MiniChart
            title={
              dashboard.name.includes("Temperature")
                ? "Humidity"
                : dashboard.name.includes("Power")
                ? "Voltage"
                : "Secondary Metric"
            }
            data={Object.values(chartData)[1]}
            color="green"
            currentValue={Object.values(chartData)[1][23].toFixed(1)}
            unit={
              dashboard.name.includes("Temperature")
                ? "%"
                : dashboard.name.includes("Power")
                ? "V"
                : "units"
            }
          />
        </div>

        {/* Large Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">
              24-Hour Trend Analysis
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                24H
              </button>
              <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition">
                7D
              </button>
              <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition">
                30D
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-1">
            {Object.values(chartData)[0].map((value, i) => {
              const max = Math.max(...Object.values(chartData)[0]);
              const min = Math.min(...Object.values(chartData)[0]);
              const range = max - min || 1;
              const height = ((value - min) / range) * 100;

              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:opacity-80 transition-all cursor-pointer"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${i}:00 - ${value.toFixed(1)}`}
                />
              );
            })}
          </div>

          <div className="flex justify-between mt-4 text-sm text-slate-400">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Data Table */}
        <DataTable data={sensorData} />
      </div>
    </div>
  );
};

export default DashboardView;
