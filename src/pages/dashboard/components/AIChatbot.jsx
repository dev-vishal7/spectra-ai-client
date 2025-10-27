import { useState } from "react";
import { MessageSquare, X, Send, Minimize2 } from "lucide-react";

const AIChatbot = ({ isOpen, onClose, onMinimize, isMinimized }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your IoT AI assistant. I can help you analyze data, create dashboards, and monitor your sensors. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    setTimeout(() => {
      const responses = [
        "Based on your temperature data from the last 24 hours, the average is 24.5°C with a peak of 29.3°C at 2:00 PM.",
        "I've detected that your Factory Floor dashboard has been viewed 234 times. Would you like me to create a detailed report?",
        "Your MQTT sources are all connected and reporting data normally. The humidity levels in Zone A have increased by 12% in the last hour.",
        "Power consumption is up 15% compared to last month. Should I create an energy optimization dashboard for you?",
        "I can create a new dashboard for you! What metrics would you like to monitor? (Temperature, Humidity, Power, etc.)",
        "All 24 data sources are connected and online. 9 MQTT, 8 Modbus TCP, and 7 RS485 devices are reporting normally.",
      ];
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
        },
      ]);
    }, 1000);
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-6 py-3 shadow-2xl cursor-pointer hover:scale-105 transition-all z-50"
        onClick={onMinimize}
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-white" />
          <span className="text-white font-medium">AI Assistant</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50"
      style={{ animation: "slideIn 0.3s ease-out" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs">Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-white/20 rounded transition"
          >
            <Minimize2 size={18} className="text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-700 text-white rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
