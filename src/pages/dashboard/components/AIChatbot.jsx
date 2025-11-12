import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Minimize2,
  Loader2,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5008/api";

const AIChatbot = ({ isOpen, onClose, onMinimize, isMinimized }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your IoT AI assistant. I can help you analyze sensor data, monitor dashboards, and answer questions in any language (English, Hindi, Hinglish, etc.). What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message immediately
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    setStreamingMessage("");

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem("Authorization");

      if (!token) {
        throw new Error("Please login first");
      }

      // Build conversation history (last 10 messages for context)
      const conversationHistory = newMessages
        .slice(-10)
        .filter((msg) => msg.role !== "assistant" || msg.content)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.slice(0, -1), // Exclude current message
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();

            if (data === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                throw new Error(parsed.error);
              }

              if (parsed.content) {
                assistantMessage += parsed.content;
                setStreamingMessage(assistantMessage);
              }
            } catch (e) {
              if (e.message !== "Unexpected end of JSON input") {
                console.error("Parse error:", e);
              }
            }
          }
        }
      }

      // Add complete assistant message
      if (assistantMessage) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
      }
      setStreamingMessage("");
    } catch (error) {
      console.error("Chat error:", error);

      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (error.name === "AbortError") {
        errorMessage = "Request cancelled.";
      } else if (error.message === "Please login first") {
        errorMessage = "Please login to use the AI assistant.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Cannot connect to server. Please check if the backend is running.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
      setStreamingMessage("");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs">
                {isLoading ? "Thinking..." : "Online"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-white/20 rounded transition"
            title="Minimize"
          >
            <Minimize2 size={18} className="text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition"
            title="Close"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl shadow-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-700 text-white rounded-bl-none border border-slate-600"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingMessage && (
          <div className="flex justify-start animate-fadeIn">
            <div className="max-w-[85%] p-3 rounded-2xl bg-slate-700 text-white rounded-bl-none border border-slate-600 shadow-lg">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {streamingMessage}
              </p>
              <span className="inline-block w-1.5 h-4 bg-blue-400 animate-pulse ml-1 rounded"></span>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !streamingMessage && (
          <div className="flex justify-start">
            <div className="bg-slate-700 p-3 rounded-2xl rounded-bl-none border border-slate-600 shadow-lg">
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="text-blue-400 animate-spin" />
                <span className="text-slate-300 text-sm">Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything in any language..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none max-h-32 scrollbar-thin scrollbar-thumb-slate-600"
            style={{ minHeight: "42px" }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[42px]"
            title="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* Quick tips */}
        <div className="mt-2 flex flex-wrap gap-2">
          {!isLoading && messages.length === 1 && (
            <>
              <button
                onClick={() => setInput("What's the current temperature?")}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-full transition"
              >
                🌡️ Temperature
              </button>
              <button
                onClick={() => setInput("Show me my dashboards")}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-full transition"
              >
                📊 Dashboards
              </button>
              <button
                onClick={() => setInput("Are all sensors online?")}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-full transition"
              >
                🔌 Status
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
