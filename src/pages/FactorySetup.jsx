import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Rnd } from "react-rnd";
import {
  Plus,
  Factory,
  Cpu,
  Server,
  FileText,
  Save,
  Settings,
  Trash2,
  Link as LinkIcon,
  Check,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const ITEM_CATEGORIES = [
  { id: "machine", label: "Machines", icon: Factory, color: "blue" },
  { id: "appliance", label: "Appliances", icon: Cpu, color: "green" },
  { id: "software", label: "Software", icon: Server, color: "purple" },
  { id: "file", label: "Files", icon: FileText, color: "orange" },
];

const FactoryLayout = () => {
  const navigate = useNavigate();
  const [layoutName, setLayoutName] = useState("");
  const [items, setItems] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailableSources();
  }, []);

  const loadAvailableSources = async () => {
    try {
      const response = await axios.get("/sources/get-sources");
      setAvailableSources(response.data || []);
    } catch (error) {
      console.error("Load sources error:", error);
      toast.error("Failed to load data sources");
    }
  };

  const handleAddItem = (itemData) => {
    const newItem = {
      id: `item_${Date.now()}`,
      ...itemData,
      category: selectedCategory,
      position: { x: 50, y: 50 },
      sourceConfig: null, // Will be configured later
      createdAt: new Date(),
    };
    setItems([...items, newItem]);
    setShowAddModal(false);
    setSelectedCategory(null);
    toast.success(`${itemData.name} added!`);
  };

  const handleRemoveItem = (itemId) => {
    if (confirm("Remove this item?")) {
      setItems(items.filter((item) => item.id !== itemId));
      toast.success("Item removed");
    }
  };

  const handleConfigureSource = (item) => {
    setSelectedItem(item);
    setShowSourceModal(true);
  };

  const handleSaveSourceConfig = (config) => {
    setItems(
      items.map((item) =>
        item.id === selectedItem.id ? { ...item, sourceConfig: config } : item
      )
    );
    setShowSourceModal(false);
    setSelectedItem(null);
    toast.success("Source configured!");
  };

  const handleSaveLayout = async () => {
    if (!layoutName.trim()) {
      toast.error("Please enter a layout name");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    try {
      setSaving(true);

      const layoutData = {
        name: layoutName,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          category: item.category,
          description: item.description,
          position: item.position,
          sourceConfig: item.sourceConfig,
        })),
      };

      const response = await axios.post("/dashboard/layout/create", layoutData);

      // Save layout ID for next steps
      localStorage.setItem("currentLayoutId", response.data.layout._id);

      toast.success("Layout saved successfully!");
      navigate("/dashboard-builder/choose-template");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save layout");
    } finally {
      setSaving(false);
      navigate("/dashboard-builder/choose-template");
    }
  };

  const getCategoryIcon = (category) => {
    const cat = ITEM_CATEGORIES.find((c) => c.id === category);
    return cat ? cat.icon : Factory;
  };

  const getCategoryColor = (category) => {
    const cat = ITEM_CATEGORIES.find((c) => c.id === category);
    return cat ? cat.color : "blue";
  };

  const getSourceById = (sourceId) => {
    return availableSources.find((s) => s._id === sourceId);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Factory Layout Designer
            </h1>
            <p className="text-slate-400">
              Design your factory layout and configure data sources
            </p>
          </div>
          <button
            onClick={handleSaveLayout}
            disabled={items.length === 0 || saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save & Continue
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Tools & Items */}
        <div className="lg:col-span-1 space-y-6">
          {/* Layout Name */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <label className="block text-white font-medium mb-2 text-sm">
              Layout Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="e.g., Factory Floor A"
              className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Add Items */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3 text-sm">Add Items</h3>
            <div className="space-y-2">
              {ITEM_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowAddModal(true);
                  }}
                  className={`w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-${category.color}-500 rounded-lg transition group`}
                >
                  <div
                    className={`p-2 bg-${category.color}-500/10 rounded-lg group-hover:bg-${category.color}-500/20`}
                  >
                    <category.icon
                      className={`text-${category.color}-400`}
                      size={18}
                    />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3 text-sm flex items-center justify-between">
              <span>Items ({items.length})</span>
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-4">
                  No items added yet
                </p>
              ) : (
                items.map((item) => {
                  const Icon = getCategoryIcon(item.category);
                  const color = getCategoryColor(item.category);
                  const source = item.sourceConfig
                    ? getSourceById(item.sourceConfig.sourceId)
                    : null;

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`text-${color}-400`} size={16} />
                        <span className="text-white text-sm font-medium flex-1 truncate">
                          {item.name}
                        </span>
                      </div>
                      {source ? (
                        <div className="flex items-center gap-1 text-xs text-green-400 mb-2">
                          <Check size={12} />
                          <span>{source.name}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 mb-2">
                          Not configured
                        </div>
                      )}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleConfigureSource(item)}
                          className="flex-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs transition flex items-center justify-center gap-1"
                        >
                          <Settings size={12} />
                          Config
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right - Drag-Drop Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Canvas</h3>
              <div className="text-slate-400 text-sm">
                Drag items to position them
              </div>
            </div>

            {/* Canvas */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl h-[600px] relative overflow-hidden">
              {/* Grid Background */}
              <div
                className="absolute inset-0 bg-slate-900/20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #334155 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* Drop hint */}
              {items.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Factory
                      className="mx-auto text-slate-600 mb-2"
                      size={48}
                    />
                    <p className="text-slate-500">
                      Add items and drag them here
                    </p>
                  </div>
                </div>
              )}

              {/* Draggable Items */}
              {items.map((item) => {
                const Icon = getCategoryIcon(item.category);
                const color = getCategoryColor(item.category);
                const source = item.sourceConfig
                  ? getSourceById(item.sourceConfig.sourceId)
                  : null;

                return (
                  <Rnd
                    key={item.id}
                    bounds="parent"
                    default={{
                      x: item.position.x,
                      y: item.position.y,
                      width: 180,
                      height: 100,
                    }}
                    onDragStop={(e, d) => {
                      setItems((prev) =>
                        prev.map((it) =>
                          it.id === item.id
                            ? { ...it, position: { x: d.x, y: d.y } }
                            : it
                        )
                      );
                    }}
                    enableResizing={false}
                  >
                    <div
                      className={`w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 ${
                        source
                          ? `border-${color}-400/60 shadow-lg shadow-${color}-500/20`
                          : `border-slate-600`
                      } rounded-lg p-3 cursor-move flex flex-col justify-between hover:shadow-xl transition-all`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 bg-${color}-500/10 rounded`}>
                              <Icon className={`text-${color}-400`} size={16} />
                            </div>
                            <h3 className="text-white font-medium text-sm">
                              {item.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        {item.description && (
                          <p className="text-slate-400 text-xs mb-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {source ? (
                          <>
                            <div className="flex-1 flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded text-xs">
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  source.connectionStatus?.connected
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              <span className="text-green-400 truncate">
                                {source.name}
                              </span>
                            </div>
                            <button
                              onClick={() => handleConfigureSource(item)}
                              className="p-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded"
                            >
                              <Settings size={12} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleConfigureSource(item)}
                            className="flex-1 px-2 py-1 bg-slate-600/50 hover:bg-slate-600 text-slate-300 rounded text-xs transition flex items-center justify-center gap-1"
                          >
                            <LinkIcon size={12} />
                            Configure Source
                          </button>
                        )}
                      </div>
                    </div>
                  </Rnd>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          category={selectedCategory}
          onClose={() => {
            setShowAddModal(false);
            setSelectedCategory(null);
          }}
          onAdd={handleAddItem}
        />
      )}

      {/* Configure Source Modal */}
      {showSourceModal && selectedItem && (
        <ConfigureSourceModal
          item={selectedItem}
          availableSources={availableSources}
          onClose={() => {
            setShowSourceModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveSourceConfig}
        />
      )}
    </div>
  );
};

// Add Item Modal
const AddItemModal = ({ category, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    onAdd({
      name: name.trim(),
      type: type.trim() || category,
      description: description.trim(),
    });
  };

  const categoryLabel =
    ITEM_CATEGORIES.find((c) => c.id === category)?.label || category;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 shadow-2xl">
          <div className="p-5 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">
              Add {categoryLabel}
            </h3>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Motor 1, Sensor A"
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Type
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g., Conveyor Belt, PLC"
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={3}
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-5 border-t border-slate-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Configure Source Modal
const ConfigureSourceModal = ({ item, availableSources, onClose, onSave }) => {
  const [selectedSource, setSelectedSource] = useState(
    item.sourceConfig?.sourceId || ""
  );
  const [dataFields, setDataFields] = useState(
    item.sourceConfig?.dataFields || []
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

    onSave({
      sourceId: selectedSource,
      sourceName: source?.name,
      dataFields: dataFields,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-xl max-w-2xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-5 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
            <h3 className="text-lg font-semibold text-white">
              Configure Data Source
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Link "{item.name}" to a data source
            </p>
          </div>

          <div className="p-5 space-y-5">
            {/* Select Source */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Select Data Source <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full bg-slate-900 text-white px-3 py-2.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a source...</option>
                {availableSources.map((src) => (
                  <option key={src._id} value={src._id}>
                    {src.name} ({src.protocol}){" "}
                    {src.connectionStatus?.connected ? "🟢" : "🔴"}
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
                    className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                      source.connectionStatus?.connected
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
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
                  {source.protocol === "MQTT" && source.config?.topic && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Topics:</span>
                      <span className="text-white text-right">
                        {Array.isArray(source.config.topic)
                          ? source.config.topic.join(", ")
                          : source.config.topic}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Fields */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Data Fields
              </label>
              <p className="text-slate-500 text-xs mb-3">
                Specify which fields to monitor (e.g., temperature, humidity,
                status)
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
                  className="flex-1 bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddField}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <Plus size={18} />
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
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-5 border-t border-slate-700 flex justify-end gap-3 sticky bottom-0 bg-slate-800">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedSource}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FactoryLayout;
