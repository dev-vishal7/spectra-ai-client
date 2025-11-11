import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  FileSpreadsheet,
  Globe,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import SourceFormDrawer from "../components/SourceFormDrawer";
import axios from "axios";

const SourcesPage = () => {
  const [sources, setSources] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggeringPoll, setTriggeringPoll] = useState(null);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/sources/get-sources");
      setSources(res.data);
    } catch (err) {
      toast.error("Failed to load sources.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = (source = null) => {
    setEditingSource(source);
    setDrawerOpen(true);
  };

  const handleSaveSource = async (sourceData, file = null) => {
    try {
      const toastId = toast.loading(
        sourceData._id ? "Updating source..." : "Creating source..."
      );

      if (sourceData._id) {
        // Update existing source (no file upload on update)
        await axios.patch(`/sources/update/${sourceData._id}`, sourceData);
        toast.success("Source updated successfully!", { id: toastId });
      } else {
        // Create new source
        if (sourceData.protocol === "Excel Upload") {
          // Use FormData for file upload
          const formData = new FormData();
          formData.append("file", file);
          formData.append("name", sourceData.name);
          formData.append("location", sourceData.config.location || "");
          formData.append("equipment", sourceData.config.equipment || "");
          formData.append("description", sourceData.config.description || "");
          formData.append("tags", JSON.stringify(sourceData.config.tags || []));

          await axios.post("/sources/upload-excel", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Excel file uploaded and processed!", { id: toastId });
        } else {
          // Regular source creation (including API)
          await axios.post("/sources/create", sourceData);
          toast.success("Source created successfully!", { id: toastId });
        }
      }

      await fetchSources();
      setDrawerOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save source.");
      console.error(err);
    }
  };

  const handleDelete = async (source) => {
    if (!window.confirm(`Delete source "${source.name}"?`)) return;

    try {
      const toastId = toast.loading("Deleting...");
      await axios.delete(`/sources/${source._id}`);
      await fetchSources();
      toast.success("Source deleted.", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete source.");
      console.error(err);
    }
  };

  const handleTriggerPoll = async (source) => {
    try {
      setTriggeringPoll(source._id);
      const toastId = toast.loading("Triggering API poll...");

      await axios.post(`/sources/trigger-poll/${source._id}`);

      toast.success("API poll triggered successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to trigger poll.");
      console.error(err);
    } finally {
      setTriggeringPoll(null);
    }
  };

  const getProtocolIcon = (protocol) => {
    if (protocol === "Excel Upload") {
      return <FileSpreadsheet size={20} className="text-green-400" />;
    } else if (protocol === "API") {
      return <Globe size={20} className="text-purple-400" />;
    }
    return null;
  };

  const getProtocolBadge = (protocol) => {
    const colors = {
      MQTT: "bg-blue-500/20 text-blue-400",
      "Modbus TCP": "bg-purple-500/20 text-purple-400",
      RS485: "bg-orange-500/20 text-orange-400",
      "Excel Upload": "bg-green-500/20 text-green-400",
      API: "bg-indigo-500/20 text-indigo-400",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          colors[protocol] || "bg-gray-500/20 text-gray-400"
        }`}
      >
        {protocol}
      </span>
    );
  };

  const formatTimeAgo = (date) => {
    if (!date) return "Never";

    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatNextPoll = (date) => {
    if (!date) return null;

    const now = new Date();
    const diff = new Date(date) - now;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 0) return "Now";
    if (seconds < 60) return `in ${seconds}s`;
    return `in ${minutes}m`;
  };

  return (
    <div className="bg-[#0F172A] text-white p-6 min-h-screen">
      <SourceFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveSource}
        initialData={editingSource}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sources</h1>
        <button
          onClick={() => handleOpenDrawer()}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition"
        >
          <Plus size={18} />
          Add Source
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-400">Loading sources...</p>
      ) : sources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">No sources configured yet</p>
          <button
            onClick={() => handleOpenDrawer()}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Create your first source
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <div
              key={source._id}
              className="bg-[#1E293B] rounded-lg p-4 shadow-md hover:shadow-lg transition-all border border-zinc-800"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getProtocolIcon(source.protocol)}
                  <h2 className="text-lg font-semibold">{source.name}</h2>
                </div>
                <div className="flex gap-2">
                  {source.protocol === "API" && (
                    <button
                      onClick={() => handleTriggerPoll(source)}
                      disabled={triggeringPoll === source._id}
                      className="text-zinc-400 cursor-pointer hover:text-purple-500 transition disabled:opacity-50"
                      title="Trigger Poll Now"
                    >
                      <RefreshCw
                        size={18}
                        className={
                          triggeringPoll === source._id ? "animate-spin" : ""
                        }
                      />
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenDrawer(source)}
                    className="text-zinc-400 cursor-pointer hover:text-blue-500 transition"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(source)}
                    className="text-zinc-400 cursor-pointer hover:text-red-500 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {getProtocolBadge(source.protocol)}

                {source.protocol === "Excel Upload" && source.fileInfo && (
                  <div className="mt-2 text-xs text-zinc-400">
                    <p>📄 {source.fileInfo.originalName}</p>
                    <p>
                      📊 {source.fileInfo.rowCount} rows ×{" "}
                      {source.fileInfo.columnCount} cols
                    </p>
                    <p className="text-zinc-500">
                      Uploaded:{" "}
                      {new Date(
                        source.fileInfo.uploadedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {source.protocol === "API" && source.apiConfig && (
                  <div className="mt-2 text-xs space-y-1">
                    <p
                      className="text-zinc-400 truncate"
                      title={source.apiConfig.url}
                    >
                      🔗 {source.apiConfig.url}
                    </p>
                    <p className="text-zinc-400">
                      ⏱️ Poll every {source.apiConfig.pollingInterval / 1000}s
                    </p>
                    {source.apiConfig.lastPollAt && (
                      <p className="text-zinc-500">
                        Last poll: {formatTimeAgo(source.apiConfig.lastPollAt)}
                      </p>
                    )}
                    {source.apiConfig.nextPollAt && (
                      <p className="text-blue-400">
                        Next poll: {formatNextPoll(source.apiConfig.nextPollAt)}
                      </p>
                    )}
                    {source.apiConfig.pollCount > 0 && (
                      <p className="text-zinc-500">
                        Total polls: {source.apiConfig.pollCount}
                      </p>
                    )}
                  </div>
                )}

                {source.config?.location && (
                  <p className="text-sm text-zinc-400">
                    📍 {source.config.location}
                  </p>
                )}

                {source.config?.equipment && (
                  <p className="text-sm text-zinc-400">
                    🔧 {source.config.equipment}
                  </p>
                )}

                {source.config?.tags && source.config.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {source.config.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 bg-zinc-700 rounded-full text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {source.config.tags.length > 3 && (
                      <span className="text-xs text-zinc-500">
                        +{source.config.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-700">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`flex items-center gap-1 ${
                      source.connectionStatus?.connected
                        ? "text-green-400"
                        : source.status === "idle"
                        ? "text-yellow-400"
                        : source.status === "polling"
                        ? "text-blue-400"
                        : source.status === "error"
                        ? "text-red-400"
                        : "text-zinc-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        source.connectionStatus?.connected
                          ? "bg-green-400 animate-pulse"
                          : source.status === "idle"
                          ? "bg-yellow-400"
                          : source.status === "polling"
                          ? "bg-blue-400 animate-pulse"
                          : source.status === "error"
                          ? "bg-red-400"
                          : "bg-zinc-500"
                      }`}
                    ></span>
                    {source.connectionStatus?.connected
                      ? "Connected"
                      : source.status === "idle"
                      ? "Ready"
                      : source.status === "polling"
                      ? "Polling"
                      : source.status === "error"
                      ? "Error"
                      : "Disconnected"}
                  </span>
                  <span className="text-zinc-500 capitalize">
                    {source.status}
                  </span>
                </div>

                {source.lastError && (
                  <p
                    className="text-xs text-red-400 mt-1 truncate"
                    title={source.lastError}
                  >
                    ⚠️ {source.lastError}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourcesPage;
