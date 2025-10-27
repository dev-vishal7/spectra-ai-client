const MiniChart = ({ title, data, color, currentValue, unit }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-slate-300 text-sm font-medium">{title}</h4>
        <div className="text-white text-xl font-bold">
          {currentValue}
          <span className="text-slate-400 text-xs ml-1">{unit}</span>
        </div>
      </div>

      <div className="flex items-end justify-between h-20 gap-0.5">
        {data.map((value, i) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all hover:opacity-80 cursor-pointer bg-gradient-to-t from-${color}-600 to-${color}-400`}
              style={{ height: `${Math.max(height, 5)}%` }}
              title={`${value.toFixed(1)} ${unit}`}
            />
          );
        })}
      </div>

      <div className="flex justify-between mt-3 text-xs text-slate-500">
        <span>{data[0].toFixed(1)}</span>
        <span className="text-slate-400">Last 24h</span>
        <span>{data[data.length - 1].toFixed(1)}</span>
      </div>
    </div>
  );
};

export default MiniChart;
