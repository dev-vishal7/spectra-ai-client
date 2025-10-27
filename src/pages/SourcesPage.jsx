import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import SourceFormDrawer from "../components/SourceFormDrawer";
import axios from "axios";

const SourcesPage = () => {
  const [sources, setSources] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleSaveSource = async (sourceData) => {
    try {
      const toastId = toast.loading(
        sourceData._id ? "Updating source..." : "Creating source..."
      );

      if (sourceData._id) {
        await axios.patch(`/sources/update/${sourceData._id}`, sourceData);
        toast.success("Source updated successfully!", { id: toastId });
      } else {
        await axios.post("/sources/create", sourceData);
        toast.success("Source created successfully!", { id: toastId });
      }

      await fetchSources();
      setDrawerOpen(false);
    } catch (err) {
      toast.error("Failed to save source.");
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

  return (
    <div className="bg-[#0F172A] text-white p-6 ">
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <div
              key={source._id}
              className="bg-[#1E293B] rounded-lg p-4 shadow-md hover:shadow-lg transition-all border border-zinc-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{source.name}</h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    {source.protocol}
                  </p>
                </div>
                <div className="flex gap-2">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourcesPage;
