"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true); // Start loading

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { role: "assistant", content: data.response };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error talking to bot:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false); // Done loading
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 bg-black">
      <div className="border h-[36rem] w-[36rem] overflow-y-auto bg-base-200 rounded p-4 space-y-4 ">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header text-sm text-gray-500">
              {msg.role === "user" ? "You" : "Support Bot"}
            </div>
            <div
              className={`chat-bubble border bg-white  ${
                msg.role === "user"
                  ? "text-base-content border-primary rounded-xl"
                  : "text-base-content border-base-300 rounded-xl"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* ✅ Loading bubble goes *inside* the scrollable box */}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-header text-sm text-gray-500">Support Bot</div>
            <div className="chat-bubble bg-base-300 text-base-content border border-base-300 flex items-center gap-2">
              <span className="loading loading-dots loading-sm"></span>
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 p-2 rounded bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the issue..."
        />
        <button
          className="bg-blue-500 text-white px-4 cursor-pointer hover:bg-blue-600 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
