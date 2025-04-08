"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ShoppingCart,
  Menu,
  Copy,
  Send,
  ThumbsUp,
  ThumbsDown,
  RefreshCcw,
} from "lucide-react";
import DefibrillatorComparison from "@/components/DefibrillatorComparison";
// Main Chat Component
export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<
    { type: string; content: string; timestamp: string; sources?: string[] }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  // Set the initial time and generate session ID
  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    // Generate a random session ID
    setSessionId(`session-${Math.random().toString(36).substring(2, 15)}`);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    const userMessage = {
      type: "user",
      content: inputText,
      timestamp: new Date().toLocaleString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // POST to the local /api route with the correct format
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: inputText, // Update this to match what the API expects
        }),
      });

      const data = await response.json();

      console.log("API Response:", data);
      const aiMessage = {
        type: "ai",
        content: data?.response ?? "",
        timestamp: new Date().toLocaleString(),
        sources: data?.response?.sources ?? [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        type: "error",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              className="mr-4 md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">AMS AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                </button>
                <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* If no messages yet, show an initial AI prompt */}
          {messages.length === 0 && currentTime && (
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-medium">AMS AI</span>
                  <span className="text-gray-400 text-sm">{currentTime}</span>
                </div>
                <p className="mt-2 text-gray-700">
                  I'm here to assist you with any medical supply needs you may
                  have.
                </p>
                <p className="mt-2 text-gray-600">
                  Is there a particular type of medical equipment you're
                  interested in today?
                </p>
              </div>
            </div>
          )}

          {/* Render conversation messages */}
          {messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-4 mb-6">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
                  ${message.type === "ai" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                <span className="text-white text-sm">
                  {message.type === "ai" ? "AI" : "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-medium">
                    {message.type === "ai" ? "AMS AI" : "You"}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {message.timestamp}
                  </span>
                </div>

                {message.type === "ai" ? (
                  <>
                    <p className={`mt-2 text-gray-700`}>{message.content}</p>

                    {/* Defibrillator Component */}
                    <DefibrillatorComparison responseText={message.content} />
                  </>
                ) : (
                  <p
                    className={`mt-2 ${
                      message.type === "error"
                        ? "text-red-500"
                        : "text-gray-700"
                    }`}
                  >
                    {message.content}
                  </p>
                )}

                {message.type === "ai" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => handleCopyText(message.content)}
                    >
                      <Copy className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ThumbsUp className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ThumbsDown className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <RefreshCcw className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask about medical supplies"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-4 pr-32 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {/* Copy button for user input (optional) */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => handleCopyText(inputText)}
              >
                <Copy className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <span className="hidden sm:inline">Send</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
