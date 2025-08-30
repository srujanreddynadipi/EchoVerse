import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the correct API version
const genAI = new GoogleGenerativeAI({
  apiKey: 'AIzaSyDsBm2vke2no92wrWMftT4I8W-nrLXsV1w',
  apiVersion: 'v1beta'  // Ensure we're using the correct API version
});

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your EchoVerse assistant. How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [open, messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userInput = input.trim();
    setInput("");
    
    // Add user message to chat
    const userMsg = { role: "user", text: userInput };
    setMessages(prev => [...prev, userMsg]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get the Gemini model (using the standard model for free tier)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Generate response with error handling for rate limits
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userInput }] }],
      });
      const response = await result.response;
      const text = response.text();
      
      // Add bot response to chat
      const botMsg = { role: "bot", text };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error getting response from Gemini:", error);
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      
      if (error.message.includes('429')) {
        errorMessage = "I'm getting rate limited. Please wait a moment before sending another message.";
      } else if (error.message.includes('quota')) {
        errorMessage = "The free tier quota has been exceeded. Please try again later or check your Google Cloud Console for quota limits.";
      }
      
      const errorMsg = { role: "bot", text: errorMessage };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
            {isLoading && (
              <div className="px-3 py-2 rounded-lg text-sm max-w-[85%] bg-white border border-blue-200 text-blue-900">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={sendMessage}
            className="p-3 flex gap-2 border-t border-blue-100 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-blue-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send'}
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
