import { Eye, Edit, Trash2, Clock } from "lucide-react";

const DashboardCard = ({ dashboard, onView, onEdit, onDelete }) => (
  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="text-white font-semibold text-lg mb-1">
          {dashboard.name}
        </h4>
        <p className="text-slate-400 text-sm">{dashboard.type}</p>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          dashboard.status === "active"
            ? "bg-green-500/10 text-green-400"
            : "bg-slate-700 text-slate-400"
        }`}
      >
        {dashboard.status}
      </div>
    </div>

    <div className="flex items-center gap-4 mb-5 text-sm text-slate-400">
      <span className="flex items-center gap-1">
        <Eye size={14} /> {dashboard.views}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={14} /> {dashboard.lastUpdated}
      </span>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => onView(dashboard)}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
      >
        <Eye size={16} /> View
      </button>
      <button
        onClick={() => onEdit(dashboard)}
        className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={() => onDelete(dashboard.id)}
        className="px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

export default DashboardCard;
