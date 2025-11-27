import React from "react";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import ConnectButton from "./ConnectButton";

const AppCard = ({ app, onConnect, onViewStatus }) => {
  const { id, name, description, logo, status, connected } = app;

  return (
    <div className="group relative bg-[#1E293B] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-800/50 p-2 flex items-center justify-center border border-gray-700/50">
          <img src={logo} alt={name} className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
              connected
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-gray-700/30 text-gray-400 border-gray-700"
            }`}
          >
            {connected ? (
              <CheckCircle2 size={12} className="mr-1.5" />
            ) : (
              <XCircle size={12} className="mr-1.5" />
            )}
            {connected ? "Active" : "Not Connected"}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {name}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 h-10 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        {connected ? (
          <button
            onClick={() => onViewStatus(id)}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-all group-hover:border-gray-600 border border-transparent"
          >
            View Details
            <ArrowRight size={16} className="ml-2 opacity-70" />
          </button>
        ) : (
          <ConnectButton
            onClick={() => onConnect(id)}
            connected={connected}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
};

export default AppCard;
