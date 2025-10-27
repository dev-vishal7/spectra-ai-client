import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color,
  subtitle,
}) => (
  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-500/10`}>
        <Icon className={`text-${color}-400`} size={24} />
      </div>
      {trend !== null && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
            trend > 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <p className="text-slate-400 text-sm mb-1">{title}</p>
    <div className="flex items-baseline gap-2 mb-1">
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      {unit && <span className="text-slate-400 text-sm">{unit}</span>}
    </div>
    {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
  </div>
);

export default StatCard;
