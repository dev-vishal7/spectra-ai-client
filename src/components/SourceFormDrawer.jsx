import { useEffect, useState } from "react";
import { X, Plus, Trash2, Tag } from "lucide-react";

const SOURCE_TYPES = ["MQTT", "Modbus TCP", "RS485"];

const SourceFormDrawer = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [source, setSource] = useState({
    name: "",
    protocol: "MQTT",
    config: {},
  });

  const [topics, setTopics] = useState([""]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (initialData) {
      setSource(initialData);
      // Handle topics
      if (initialData.config.topic) {
        const topicArray = Array.isArray(initialData.config.topic)
          ? initialData.config.topic
          : [initialData.config.topic];
        setTopics(topicArray);
      }
      // Handle tags
      if (initialData.config.tags) {
        setTags(initialData.config.tags);
      }
    } else {
      setSource({ name: "", protocol: "MQTT", config: {} });
      setTopics([""]);
      setTags([]);
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setSource((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigChange = (key, value) => {
    setSource((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const addTopic = () => {
    setTopics([...topics, ""]);
  };

  const removeTopic = (index) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const renderProtocolFields = () => {
    switch (source.protocol) {
      case "MQTT":
        return (
          <>
            <Input
              label="Broker URL"
              placeholder="broker.hivemq.com or 192.168.1.100"
              value={source.config.brokerUrl || ""}
              onChange={(e) => handleConfigChange("brokerUrl", e.target.value)}
            />

            <Input
              label="Port"
              type="number"
              placeholder="1883 (default)"
              value={source.config.port || ""}
              onChange={(e) => handleConfigChange("port", e.target.value)}
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-400">
                  Topics
                </label>
                <button
                  type="button"
                  onClick={addTopic}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Topic
                </button>
              </div>

              {topics.map((topic, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="sensors/temperature"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1 bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="px-3 py-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Username (optional)"
                value={source.config.username || ""}
                onChange={(e) => handleConfigChange("username", e.target.value)}
              />

              <Input
                label="Password (optional)"
                type="password"
                value={source.config.password || ""}
                onChange={(e) => handleConfigChange("password", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  QoS
                </label>
                <select
                  value={source.config.qos || 0}
                  onChange={(e) =>
                    handleConfigChange("qos", parseInt(e.target.value))
                  }
                  className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>0 - At most once</option>
                  <option value={1}>1 - At least once</option>
                  <option value={2}>2 - Exactly once</option>
                </select>
              </div>

              <Input
                label="Client ID (optional)"
                placeholder="Auto-generated"
                value={source.config.clientId || ""}
                onChange={(e) => handleConfigChange("clientId", e.target.value)}
              />
            </div>
          </>
        );

      case "Modbus TCP":
        return (
          <>
            <Input
              label="IP Address"
              placeholder="192.168.1.100"
              value={source.config.ip || ""}
              onChange={(e) => handleConfigChange("ip", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Port"
                type="number"
                placeholder="502 (default)"
                value={source.config.port || "502"}
                onChange={(e) => handleConfigChange("port", e.target.value)}
              />

              <Input
                label="Unit ID"
                type="number"
                placeholder="1"
                value={source.config.unitId || ""}
                onChange={(e) => handleConfigChange("unitId", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Register"
                type="number"
                placeholder="0"
                value={source.config.startRegister || ""}
                onChange={(e) =>
                  handleConfigChange("startRegister", e.target.value)
                }
              />

              <Input
                label="Register Count"
                type="number"
                placeholder="10"
                value={source.config.registerCount || ""}
                onChange={(e) =>
                  handleConfigChange("registerCount", e.target.value)
                }
              />
            </div>

            <Input
              label="Polling Interval (ms)"
              type="number"
              placeholder="1000"
              value={source.config.pollingInterval || "1000"}
              onChange={(e) =>
                handleConfigChange("pollingInterval", e.target.value)
              }
            />
          </>
        );

      case "RS485":
        return (
          <>
            <Input
              label="Serial Port"
              placeholder="/dev/ttyUSB0 or COM3"
              value={source.config.serialPort || ""}
              onChange={(e) => handleConfigChange("serialPort", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Baud Rate"
                type="number"
                placeholder="9600"
                value={source.config.baudRate || "9600"}
                onChange={(e) => handleConfigChange("baudRate", e.target.value)}
              />

              <Input
                label="Data Bits"
                type="number"
                placeholder="8"
                value={source.config.dataBits || "8"}
                onChange={(e) => handleConfigChange("dataBits", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Parity
                </label>
                <select
                  value={source.config.parity || "none"}
                  onChange={(e) => handleConfigChange("parity", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="even">Even</option>
                  <option value="odd">Odd</option>
                </select>
              </div>

              <Input
                label="Stop Bits"
                type="number"
                placeholder="1"
                value={source.config.stopBits || "1"}
                onChange={(e) => handleConfigChange("stopBits", e.target.value)}
              />
            </div>

            <Input
              label="Unit ID"
              type="number"
              placeholder="1"
              value={source.config.unitId || ""}
              onChange={(e) => handleConfigChange("unitId", e.target.value)}
            />
          </>
        );

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    if (!source.name || !source.protocol) {
      alert("Please fill in all required fields");
      return;
    }

    // For MQTT, save topics array
    if (source.protocol === "MQTT") {
      const validTopics = topics.filter((t) => t.trim() !== "");
      if (validTopics.length === 0) {
        alert("Please add at least one topic");
        return;
      }
      source.config.topic = validTopics;
    }

    // Save tags for AI
    if (tags.length > 0) {
      source.config.tags = tags;
    }

    onSave(source);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[550px] bg-[#1E293B] text-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {initialData ? "Edit" : "Create"} Source
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition p-1"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <Input
              label="Source Name"
              placeholder="e.g., Factory Temperature Sensors"
              value={source.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Protocol <span className="text-red-400">*</span>
              </label>
              <select
                value={source.protocol}
                onChange={(e) => {
                  handleChange("protocol", e.target.value);
                  setSource((prev) => ({ ...prev, config: {} }));
                  setTopics([""]);
                }}
                className="w-full bg-gray-800 border border-gray-600 px-3 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {SOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-700 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                {source.protocol} Configuration
              </h3>
              {renderProtocolFields()}
            </div>

            {/* AI Metadata Section */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Tag size={16} />
                Metadata (For AI Context)
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Help AI understand your data better by adding context
              </p>

              <Input
                label="Location"
                placeholder="e.g., Factory Floor A, Room 101"
                value={source.config.location || ""}
                onChange={(e) => handleConfigChange("location", e.target.value)}
              />

              <Input
                label="Equipment"
                placeholder="e.g., Motor 1, Pump A"
                value={source.config.equipment || ""}
                onChange={(e) =>
                  handleConfigChange("equipment", e.target.value)
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe what this source monitors..."
                  value={source.config.description || ""}
                  onChange={(e) =>
                    handleConfigChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a tag (e.g., temperature, critical)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-300"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-md bg-zinc-700 hover:bg-zinc-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 transition font-medium shadow-lg"
            >
              {initialData ? "Update" : "Create"} Source
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Input = ({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  required,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-500"
    />
  </div>
);

export default SourceFormDrawer;
