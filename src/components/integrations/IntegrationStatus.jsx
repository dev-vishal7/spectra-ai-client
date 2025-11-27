import React from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  ShieldCheck,
  History,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const IntegrationStatus = ({
  app,
  statusData,
  onResync,
  onDisconnect,
  syncing,
}) => {
    const navigate = useNavigate()
  const { name, logo, id } = app;
  const { status, lastSyncedAt, syncLogs = [], error } = statusData || {};

  const isConnected = status === "active" || status === "connected";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-800/50 p-4 border border-gray-700/50 shadow-inner">
              <img
                src={logo}
                alt={name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{name}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    isConnected
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {isConnected ? (
                    <CheckCircle2 size={14} className="mr-1.5" />
                  ) : (
                    <AlertCircle size={14} className="mr-1.5" />
                  )}
                  {isConnected ? "Connected & Syncing" : "Connection Issue"}
                </span>
                {lastSyncedAt && (
                  <span className="flex items-center text-gray-400 text-sm">
                    <Clock size={14} className="mr-1.5" />
                    Last synced: {new Date(lastSyncedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onResync}
              disabled={syncing}
              className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-wait"
            >
              <RefreshCw
                size={16}
                className={`mr-2 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? "Syncing..." : "Sync Now"}
            </button>
            {isConnected && (
              <button
                onClick={() => navigate(`/apps/${app.id || 'odoo'}/configure`)} // Using href for simplicity or pass handler
                className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-all border border-gray-600"
              >
                Configure
              </button>
            )}
            <button
              onClick={onDisconnect}
              className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium transition-all"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-gray-400">
            <Activity size={18} />
            <span className="text-sm font-medium">Sync Health</span>
          </div>
          <p className="text-2xl font-bold text-white">100%</p>
          <p className="text-xs text-green-400 mt-1">All systems operational</p>
        </div>
        <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-gray-400">
            <ShieldCheck size={18} />
            <span className="text-sm font-medium">Security</span>
          </div>
          <p className="text-2xl font-bold text-white">Encrypted</p>
          <p className="text-xs text-gray-500 mt-1">OAuth 2.0 Standard</p>
        </div>
        <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-gray-400">
            <History size={18} />
            <span className="text-sm font-medium">Total Syncs</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {syncLogs.length || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Lifetime operations</p>
        </div>
      </div>

      {/* Sync Logs */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent Sync Logs</h3>
          <span className="text-xs text-gray-500">Last 5 operations</span>
        </div>
        <div className="divide-y divide-gray-800">
          {syncLogs.length > 0 ? (
            syncLogs.slice(0, 5).map((log, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.status === "success" ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {log.status === "success"
                        ? "Data synchronization completed"
                        : "Sync failed"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-500">
                  {log.duration || "2s"}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              No sync history available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationStatus;
