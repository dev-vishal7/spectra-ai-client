import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Clock,
  CheckCircle,
} from "lucide-react";

const AnalyticsTab = ({ dashboards }) => {
  // Generate realistic data
  const protocolStats = {
    mqtt: { count: 9, percentage: 37.5, trend: 12, dataPoints: 45678 },
    modbus: { count: 8, percentage: 33.3, trend: 5, dataPoints: 32145 },
    rs485: { count: 7, percentage: 29.2, trend: -3, dataPoints: 28934 },
  };

  const performanceMetrics = [
    { name: "Avg Response Time", value: "45ms", trend: -12, status: "good" },
    { name: "Data Success Rate", value: "99.7%", trend: 2.3, status: "good" },
    { name: "Uptime", value: "99.9%", trend: 0.1, status: "excellent" },
    { name: "Failed Requests", value: "23", trend: -45, status: "good" },
  ];

  const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    messages: 150 + Math.random() * 200,
  }));

  const topDashboards = dashboards
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-semibold mb-1">
            Advanced Analytics
          </h2>
          <p className="text-slate-400 text-sm">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm">
            Last 7 Days
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, i) => (
          <div
            key={i}
            className="bg-slate-800 rounded-xl p-5 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">{metric.name}</span>
              <div
                className={`flex items-center gap-1 text-xs ${
                  metric.trend > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {metric.trend > 0 ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span>{Math.abs(metric.trend)}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {metric.value}
            </div>
            <div
              className={`inline-block px-2 py-0.5 rounded text-xs ${
                metric.status === "excellent"
                  ? "bg-green-500/10 text-green-400"
                  : metric.status === "good"
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-orange-500/10 text-orange-400"
              }`}
            >
              {metric.status === "excellent"
                ? "Excellent"
                : metric.status === "good"
                ? "Good"
                : "Fair"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Protocol Distribution with Details */}
        <div className="lg:col-span-1 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Activity size={18} />
            Protocol Distribution
          </h3>
          <div className="space-y-4">
            {/* MQTT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300 font-medium">MQTT</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {protocolStats.mqtt.count}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {protocolStats.mqtt.percentage}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${protocolStats.mqtt.percentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {protocolStats.mqtt.dataPoints.toLocaleString()} data points
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    protocolStats.mqtt.trend > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {protocolStats.mqtt.trend > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(protocolStats.mqtt.trend)}%
                </span>
              </div>
            </div>

            {/* Modbus TCP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300 font-medium">Modbus TCP</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {protocolStats.modbus.count}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {protocolStats.modbus.percentage}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${protocolStats.modbus.percentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {protocolStats.modbus.dataPoints.toLocaleString()} data points
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    protocolStats.modbus.trend > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {protocolStats.modbus.trend > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(protocolStats.modbus.trend)}%
                </span>
              </div>
            </div>

            {/* RS485 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-300 font-medium">RS485</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {protocolStats.rs485.count}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {protocolStats.rs485.percentage}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${protocolStats.rs485.percentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {protocolStats.rs485.dataPoints.toLocaleString()} data points
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    protocolStats.rs485.trend > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {protocolStats.rs485.trend > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(protocolStats.rs485.trend)}%
                </span>
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                Total Messages Today
              </span>
              <span className="text-white font-bold text-lg">106,757</span>
            </div>
          </div>
        </div>

        {/* 24-Hour Activity Chart */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Zap size={18} />
              24-Hour Activity
            </h3>
            <div className="text-slate-400 text-sm">Messages per hour</div>
          </div>

          <div className="h-48 flex items-end justify-between gap-1">
            {hourlyActivity.map((item, i) => {
              const max = Math.max(...hourlyActivity.map((h) => h.messages));
              const height = (item.messages / max) * 100;
              const isCurrentHour = new Date().getHours() === item.hour;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div
                    className={`w-full rounded-t transition-all cursor-pointer ${
                      isCurrentHour
                        ? "bg-gradient-to-t from-blue-600 to-blue-400"
                        : "bg-gradient-to-t from-slate-600 to-slate-500 hover:from-blue-600/50 hover:to-blue-400/50"
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${item.hour}:00 - ${Math.round(
                      item.messages
                    )} messages`}
                  ></div>
                  {i % 3 === 0 && (
                    <span className="text-xs text-slate-500 mt-2">
                      {item.hour}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <div className="text-slate-400 text-xs mb-1">Peak Hour</div>
              <div className="text-white font-semibold">14:00</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-xs mb-1">Avg/Hour</div>
              <div className="text-white font-semibold">234</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-xs mb-1">Lowest Hour</div>
              <div className="text-white font-semibold">03:00</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Dashboards */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <TrendingUp size={18} />
            Top Performing Dashboards
          </h3>
          <div className="space-y-4">
            {topDashboards.map((d, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    i === 0
                      ? "bg-yellow-500/20 text-yellow-400"
                      : i === 1
                      ? "bg-slate-600/50 text-slate-300"
                      : i === 2
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {d.name}
                  </div>
                  <div className="text-slate-400 text-xs">{d.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{d.views}</div>
                  <div className="text-slate-500 text-xs">views</div>
                </div>
                <div className="w-24 bg-slate-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{
                      width: `${(d.views / topDashboards[0].views) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <CheckCircle size={18} />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Data Sources Online</span>
              </div>
              <span className="text-white font-bold">24/24</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Active Connections</span>
              </div>
              <span className="text-white font-bold">156</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-slate-300">Avg Latency</span>
              </div>
              <span className="text-white font-bold">45ms</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-slate-300">Error Rate</span>
              </div>
              <span className="text-white font-bold">0.3%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">System Uptime</span>
              </div>
              <span className="text-white font-bold">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
