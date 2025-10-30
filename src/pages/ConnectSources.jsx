import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const ConnectSources = () => {
  const navigate = useNavigate();
  const [layoutItems, setLayoutItems] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load factory layout from Step 1
      const savedLayout = localStorage.getItem("factoryLayout");
      if (!savedLayout) {
        toast.error("No factory layout found. Please complete Step 1 first.");
        navigate("/dashboard-builder/factory-setup");
        return;
      }

      const layout = JSON.parse(savedLayout);
      setLayoutItems(layout.items || []);

      // Fetch available data sources from backend
      const response = await axios.get("/sources/get-sources");
      setAvailableSources(response.data || []);

      // Load existing mappings
      const savedMappings = localStorage.getItem("sourceMappings");
      if (savedMappings) {
        setMappings(JSON.parse(savedMappings));
      }
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSource = (item) => {
    setSelectedItem(item);
    setShowConnectionModal(true);
  };

  const handleSaveMapping = (mapping) => {
    const newMappings = mappings.filter((m) => m.itemId !== mapping.itemId);
    newMappings.push(mapping);
    setMappings(newMappings);

    // Save to localStorage
    localStorage.setItem("sourceMappings", JSON.stringify(newMappings));

    setShowConnectionModal(false);
    setSelectedItem(null);
    toast.success("Connection saved!");
  };

  const handleRemoveMapping = (itemId) => {
    const newMappings = mappings.filter((m) => m.itemId !== itemId);
    setMappings(newMappings);
    localStorage.setItem("sourceMappings", JSON.stringify(newMappings));
    toast.success("Connection removed");
  };

  const getMappingForItem = (itemId) => {
    return mappings.find((m) => m.itemId === itemId);
  };

  const getSourceById = (sourceId) => {
    return availableSources.find((s) => s._id === sourceId);
  };

  const handleContinue = () => {
    if (mappings.length === 0) {
      toast.error("Please connect at least one data source");
      return;
    }

    // Save progress
    const builderState = {
      layout: JSON.parse(localStorage.getItem("factoryLayout")),
      mappings: mappings,
    };
    localStorage.setItem("dashboardBuilderState", JSON.stringify(builderState));

    navigate("/dashboard-builder/choose-template");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Connect Data Sources
            </h1>
            <p className="text-slate-400">
              Step 2: Link your items to real-time data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard-builder/factory-setup")}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={mappings.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 flex items-center gap-2">
          <div className="flex-1 h-2 bg-green-600 rounded"></div>
          <div className="flex-1 h-2 bg-blue-600 rounded"></div>
          <div className="flex-1 h-2 bg-slate-700 rounded"></div>
          <div className="flex-1 h-2 bg-slate-700 rounded"></div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-green-400 font-medium">✓ Factory Setup</span>
          <span className="text-blue-400 font-medium">Connect Sources</span>
          <span className="text-slate-500">Choose Template</span>
          <span className="text-slate-500">Configure</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Total Items</div>
            <div className="text-3xl font-bold text-white">
              {layoutItems.length}
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Connected</div>
            <div className="text-3xl font-bold text-green-400">
              {mappings.length}
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Available Sources</div>
            <div className="text-3xl font-bold text-blue-400">
              {availableSources.length}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              Your Factory Items
            </h2>
          </div>

          <div className="divide-y divide-slate-700">
            {layoutItems.map((item) => {
              const mapping = getMappingForItem(item.id);
              const source = mapping ? getSourceById(mapping.sourceId) : null;
              const isConnected = !!mapping;

              return (
                <div
                  key={item.id}
                  className="p-6 hover:bg-slate-700/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">
                          {item.name}
                        </h3>
                        {isConnected ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                            <CheckCircle size={14} />
                            Connected
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-sm">
                            <AlertCircle size={14} />
                            Not Connected
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm capitalize">
                        {item.category} • {item.type}
                      </p>
                      {item.description && (
                        <p className="text-slate-500 text-sm mt-1">
                          {item.description}
                        </p>
                      )}

                      {/* Connection Details */}
                      {isConnected && source && (
                        <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <LinkIcon size={14} className="text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">
                              Connected to:
                            </span>
                          </div>
                          <div className="text-white font-medium">
                            {source.name}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-slate-400">
                              Protocol:{" "}
                              <span className="text-white">
                                {source.protocol}
                              </span>
                            </span>
                            <span
                              className={`flex items-center gap-1 ${
                                source.connectionStatus?.connected
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  source.connectionStatus?.connected
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              {source.connectionStatus?.connected
                                ? "Online"
                                : "Offline"}
                            </span>
                          </div>
                          {mapping.dataFields &&
                            mapping.dataFields.length > 0 && (
                              <div className="mt-2">
                                <div className="text-slate-400 text-xs mb-1">
                                  Data Fields:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {mapping.dataFields.map((field, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs"
                                    >
                                      {field}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <>
                          <button
                            onClick={() => handleConnectSource(item)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => handleRemoveMapping(item.id)}
                            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnectSource(item)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                        >
                          <LinkIcon size={18} />
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        {mappings.length === 0 && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              💡 Tip: Connect your factory items to data sources to enable
              real-time monitoring in your dashboard.
            </p>
          </div>
        )}
      </div>

      {/* Connection Modal */}
      {showConnectionModal && selectedItem && (
        <ConnectionModal
          item={selectedItem}
          availableSources={availableSources}
          existingMapping={getMappingForItem(selectedItem.id)}
          onClose={() => {
            setShowConnectionModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveMapping}
        />
      )}
    </div>
  );
};

// Connection Modal Component
const ConnectionModal = ({
  item,
  availableSources,
  existingMapping,
  onClose,
  onSave,
}) => {
  const [selectedSource, setSelectedSource] = useState(
    existingMapping?.sourceId || ""
  );
  const [dataFields, setDataFields] = useState(
    existingMapping?.dataFields || []
  );
  const [newField, setNewField] = useState("");

  const source = availableSources.find((s) => s._id === selectedSource);

  const handleAddField = () => {
    if (newField.trim() && !dataFields.includes(newField.trim())) {
      setDataFields([...dataFields, newField.trim()]);
      setNewField("");
    }
  };

  const handleRemoveField = (field) => {
    setDataFields(dataFields.filter((f) => f !== field));
  };

  const handleSave = () => {
    if (!selectedSource) {
      toast.error("Please select a data source");
      return;
    }

    const mapping = {
      itemId: item.id,
      itemName: item.name,
      sourceId: selectedSource,
      dataFields: dataFields,
      createdAt: new Date().toISOString(),
    };

    onSave(mapping);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-xl max-w-2xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
            <h3 className="text-xl font-semibold text-white">
              Connect Data Source
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Link "{item.name}" to a data source
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Select Source */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Select Data Source <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a source...</option>
                {availableSources.map((src) => (
                  <option key={src._id} value={src._id}>
                    {src.name} ({src.protocol})
                  </option>
                ))}
              </select>
            </div>

            {/* Source Details */}
            {source && (
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">Source Details</h4>
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      source.connectionStatus?.connected
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        source.connectionStatus?.connected
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    ></div>
                    {source.connectionStatus?.connected ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Protocol:</span>
                    <span className="text-white">{source.protocol}</span>
                  </div>
                  {source.protocol === "MQTT" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Broker:</span>
                        <span className="text-white">
                          {source.config?.brokerUrl}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Topics:</span>
                        <span className="text-white">
                          {Array.isArray(source.config?.topic)
                            ? source.config.topic.join(", ")
                            : source.config?.topic}
                        </span>
                      </div>
                    </>
                  )}
                  {(source.protocol === "Modbus TCP" ||
                    source.protocol === "RS485") && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registers:</span>
                      <span className="text-white">
                        {source.config?.startRegister} -{" "}
                        {(source.config?.startRegister || 0) +
                          (source.config?.registerCount || 0) -
                          1}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Fields Mapping */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Data Fields (Optional)
              </label>
              <p className="text-slate-500 text-xs mb-3">
                Specify which data fields from this source you want to use
                (e.g., temperature, humidity, status)
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddField())
                  }
                  placeholder="e.g., temperature, pressure"
                  className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddField}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Add
                </button>
              </div>

              {dataFields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dataFields.map((field, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm"
                    >
                      {field}
                      <button
                        onClick={() => handleRemoveField(field)}
                        className="hover:text-blue-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-slate-700 flex justify-end gap-3 sticky bottom-0 bg-slate-800">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedSource}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition"
            >
              Save Connection
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectSources;
