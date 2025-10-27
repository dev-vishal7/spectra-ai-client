// components/SourceCard.jsx
import { Pencil, Trash2 } from "lucide-react";

const SourceCard = ({ source, onEdit, onDelete }) => {
  return (
    <div className="bg-zinc-900 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition w-full sm:w-[300px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold capitalize">{source.name}</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Protocol: {source.protocol}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(source)}
            className="text-zinc-400 hover:text-blue-400 transition"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(source)}
            className="text-zinc-400 hover:text-red-400 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceCard;
