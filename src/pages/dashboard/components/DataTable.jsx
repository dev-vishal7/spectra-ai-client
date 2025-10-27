import { Wifi, WifiOff } from "lucide-react";

const DataTable = ({ data }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
    <div className="p-6 border-b border-slate-700">
      <h3 className="text-white font-semibold text-lg">
        Recent Sensor Readings
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Source
            </th>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Protocol
            </th>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Value
            </th>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Status
            </th>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Last Update
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-700/30 transition-colors">
              <td className="p-4 text-white font-medium">{row.source}</td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    row.protocol === "MQTT"
                      ? "bg-green-500/10 text-green-400"
                      : row.protocol === "Modbus TCP"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-orange-500/10 text-orange-400"
                  }`}
                >
                  {row.protocol}
                </span>
              </td>
              <td className="p-4 text-white font-mono">{row.value}</td>
              <td className="p-4">
                {row.status === "online" ? (
                  <span className="flex items-center gap-1.5 text-green-400 text-sm">
                    <Wifi size={14} /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-400 text-sm">
                    <WifiOff size={14} /> Offline
                  </span>
                )}
              </td>
              <td className="p-4 text-slate-400 text-sm">{row.lastUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
