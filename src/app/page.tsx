/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
  image?: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;
    const userMessage: Message = {
      sender: "user",
      text: input,
      image: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", input);
      if (selectedImage) formData.append("image", selectedImage);

      const res = await fetch("/api/gemini", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const aiMessage: Message = {
        sender: "ai",
        text: data.answer || data.error || "No response",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.log(err);

      const errorMessage: Message = {
        sender: "ai",
        text: "Error contacting API",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white">
      {/* <header className="p-4 text-2xl font-bold border-b border-gray-700">
        AI Girlfriend 💕
      </header> */}
      <header className="p-4 text-2xl font-bold border-b border-gray-700">
        AI Ta Ma Ki 💕
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-xl break-words ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-800 text-white rounded-bl-none"
              }`}
            >
              {msg.text}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="uploaded"
                  className="mt-2 rounded-lg border border-gray-600 max-h-60 object-contain"
                />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white px-4 py-2 rounded-xl rounded-bl-none animate-pulse">
              <div className="flex space-x-1">
                <span className="dot w-2 h-2 bg-white rounded-full animate-bounce delay-0"></span>
                <span className="dot w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
                <span className="dot w-2 h-2 bg-white rounded-full animate-bounce delay-400"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 flex gap-2 items-center">
        {/* <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
          className="text-sm text-gray-300"
        /> */}
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
        >
          Send
        </button>
      </div>

      <style jsx>{`
        .dot {
          display: inline-block;
          animation: bounce 1s infinite;
        }
        .dot.delay-0 {
          animation-delay: 0s;
        }
        .dot.delay-200 {
          animation-delay: 0.2s;
        }
        .dot.delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
