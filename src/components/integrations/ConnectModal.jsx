import React, { useState } from "react";
import { X, Loader2, Lock, Globe, User, Key } from "lucide-react";

const ConnectModal = ({ isOpen, onClose, app, onConnect, loading }) => {
  const [formData, setFormData] = useState({
    subdomain: "",
    username: "",
    password: "",
    dataCenter: "com", // Default for Zoho
    brokerUrl: "",
    topic: "",
    machineIp: "",
    protocol: "opcua",
    port: "",
  });

  if (!isOpen || !app) return null;

  const isOdoo = app.id === "odoo";
  const isZoho = app.id === "zoho";
  const isMqtt = app.id === "mqtt";
  const isMachine = app.id === "machine";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOdoo) {
      onConnect(app.id, {
        ...formData,
        credentials: {
          username: formData.username,
          password: formData.password,
          subdomain: formData.subdomain,
        },
        authType: "credentials",
      });
    } else if (isZoho) {
      onConnect(app.id, {
        authType: "oauth",
        dataCenter: formData.dataCenter,
      });
    } else if (isMqtt) {
      onConnect(app.id, {
        authType: "credentials",
        credentials: {
          brokerUrl: formData.brokerUrl,
          topic: formData.topic,
          username: formData.username,
          password: formData.password,
        },
      });
    } else if (isMachine) {
      onConnect(app.id, {
        authType: "credentials",
        credentials: {
          machineIp: formData.machineIp,
          protocol: formData.protocol,
          port: formData.port,
        },
      });
    } else {
      onConnect(app.id, {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1E293B] border border-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Connect {app.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-white p-2 shadow-lg">
              <img
                src={app.logo}
                alt={app.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <p className="text-gray-400 text-sm text-center mb-6">
            {isOdoo
              ? "Enter your Odoo credentials to establish a secure connection."
              : isZoho
              ? "Select your Zoho Data Center region to initiate authorization."
              : isMqtt
              ? "Enter your MQTT Broker details."
              : isMachine
              ? "Enter your Machine connection details."
              : "You will be redirected to authorize the connection securely."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isOdoo && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Odoo Subdomain / URL
                  </label>
                  <div className="relative">
                    <Globe
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="https://yourcompany.odoo.com"
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                      value={formData.subdomain}
                      onChange={(e) =>
                        setFormData({ ...formData, subdomain: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Username / Email
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="admin@example.com"
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Password / API Key
                  </label>
                  <div className="relative">
                    <Key
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {isZoho && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  Data Center Region
                </label>
                <div className="relative">
                  <Globe
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <select
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    value={formData.dataCenter}
                    onChange={(e) =>
                      setFormData({ ...formData, dataCenter: e.target.value })
                    }
                  >
                    <option value="com">zoho.com (US)</option>
                    <option value="eu">zoho.eu (Europe)</option>
                    <option value="in">zoho.in (India)</option>
                    <option value="com.au">zoho.com.au (Australia)</option>
                    <option value="jp">zoho.jp (Japan)</option>
                    <option value="com.cn">zoho.com.cn (China)</option>
                  </select>
                </div>
              </div>
            )}

            {isMqtt && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Broker URL</label>
                  <input
                    type="text"
                    required
                    placeholder="mqtt://broker.hivemq.com"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={formData.brokerUrl}
                    onChange={(e) => setFormData({ ...formData, brokerUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="sensors/temp"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Username (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Password (Optional)</label>
                  <input
                    type="password"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </>
            )}

            {isMachine && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Machine IP</label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.1.100"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={formData.machineIp}
                    onChange={(e) => setFormData({ ...formData, machineIp: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Protocol</label>
                  <select
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={formData.protocol}
                    onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                  >
                    <option value="opcua">OPC UA</option>
                    <option value="modbus">Modbus TCP</option>
                    <option value="ethernetip">EtherNet/IP</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">Port</label>
                  <input
                    type="text"
                    placeholder="4840"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  {isOdoo ? <Lock size={18} /> : <Globe size={18} />}
                  {isOdoo
                    ? "Connect Securely"
                    : isZoho
                    ? "Authorize with Zoho"
                    : isMqtt || isMachine
                    ? "Connect Device"
                    : "Connect via OAuth"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;
