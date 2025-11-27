import React from "react";
import { Loader2 } from "lucide-react";

const ConnectButton = ({ onClick, loading, connected, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || connected}
      className={`
        relative flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
        ${
          connected
            ? "bg-green-500/10 text-green-400 cursor-default border border-green-500/20"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95"
        }
        ${loading ? "opacity-80 cursor-wait" : ""}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin mr-2" />
          Connecting...
        </>
      ) : connected ? (
        "Connected"
      ) : (
        "Connect"
      )}
    </button>
  );
};

export default ConnectButton;
