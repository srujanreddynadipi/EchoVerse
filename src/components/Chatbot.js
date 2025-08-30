import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I help you today?" },
  ]);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [open, messages]);

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    const botMsg = { role: "bot", text: "Thanks! This is a demo response." };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-80 h-96 bg-white/95 backdrop-blur-xl border border-blue-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold">
            Chatbot
          </div>
          <div
            ref={panelRef}
            className="flex-1 overflow-auto p-3 space-y-2 bg-blue-50"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${
                  m.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white border border-blue-200 text-blue-900"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={sendMessage}
            className="p-3 flex gap-2 border-t border-blue-100 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-xl flex items-center justify-center hover:scale-105 transition"
        aria-label="Open chatbot"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
