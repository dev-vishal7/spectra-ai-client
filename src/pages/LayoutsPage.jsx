import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Factory,
  Cpu,
  Server,
  FileText,
  Layout,
  Calendar,
  Grid,
  Trash2,
  Edit,
  Eye,
  ChevronRight,
  Search,
  Loader2,
  Box,
  LayoutDashboard,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const CATEGORY_ICONS = {
  machine: Factory,
  appliance: Cpu,
  software: Server,
  file: FileText,
};

const CATEGORY_COLORS = {
  machine: "blue",
  appliance: "green",
  software: "purple",
  file: "orange",
};

const LayoutsPage = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/dashboard/layout/list");
      setLayouts(response.data?.layouts || []);
    } catch (error) {
      console.error("Load layouts error:", error);
      toast.error("Failed to load layouts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate("/builder/factory-layout");
  };

  const handleCreateDashboard = (layout) => {
    localStorage.setItem("currentLayoutId", layout._id);
    navigate("/builder/choose-template");
  };

  const handleEdit = (layout) => {
    // Navigate to edit page with layout data
    navigate(`/builder/factory-layout/${layout._id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLayout) return;

    try {
      await axios.delete(`/dashboard/layout/${selectedLayout._id}`);
      toast.success("Layout deleted successfully");
      setLayouts(layouts.filter((l) => l._id !== selectedLayout._id));
      setShowDeleteModal(false);
      setSelectedLayout(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete layout");
    }
  };

  const handleDelete = (layout) => {
    setSelectedLayout(layout);
    setShowDeleteModal(true);
  };

  const filteredLayouts = layouts.filter((layout) =>
    layout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryStats = (items) => {
    const stats = {};
    items.forEach((item) => {
      stats[item.category] = (stats[item.category] || 0) + 1;
    });
    return stats;
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Layout className="text-blue-400" size={32} />
              Factory Layouts
            </h1>
            <p className="text-slate-400">
              Manage your factory layouts and create dashboards
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Create New Layout
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search layouts..."
            className="w-full bg-slate-800 text-white pl-12 pr-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-400" size={48} />
          </div>
        ) : filteredLayouts.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-full mb-4">
                <Layout className="text-slate-500" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery ? "No layouts found" : "No layouts yet"}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first factory layout to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  <Plus size={20} />
                  Create Layout
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLayouts.map((layout) => {
              const categoryStats = getCategoryStats(layout.items);
              const totalItems = layout.items.length;

              return (
                <div
                  key={layout._id}
                  className="bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all hover:shadow-xl overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition">
                          {layout.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar size={12} />
                          {new Date(layout.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(layout)}
                          className="p-2 cursor-pointer hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-blue-400"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(layout)}
                          className="p-2 cursor-pointer hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Box className="text-blue-400" size={16} />
                        <span className="text-white font-medium">
                          {totalItems}
                        </span>
                        <span className="text-slate-400">items</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="p-5 bg-slate-900/30">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(categoryStats).map(
                        ([category, count]) => {
                          const Icon = CATEGORY_ICONS[category] || Factory;
                          const color = CATEGORY_COLORS[category] || "blue";

                          return (
                            <div
                              key={category}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-${color}-500/10 rounded-lg border border-${color}-500/20`}
                            >
                              <Icon className={`text-${color}-400`} size={14} />
                              <span
                                className={`text-${color}-400 text-xs font-medium`}
                              >
                                {count}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleCreateDashboard(layout)}
                      className="w-full cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-lg group-hover:shadow-xl"
                    >
                      <LayoutDashboard size={18} />
                      Create Dashboard
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedLayout && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedLayout(null);
            }}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 shadow-2xl">
              <div className="p-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-red-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Delete Layout?
                </h3>
                <p className="text-slate-400 mb-1">
                  Are you sure you want to delete "{selectedLayout.name}"?
                </p>
                <p className="text-slate-500 text-sm">
                  This action cannot be undone. All associated dashboards will
                  also be affected.
                </p>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedLayout(null);
                  }}
                  className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Delete Layout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LayoutsPage;
