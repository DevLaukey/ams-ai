"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Search,
  MessageSquare,
  ChevronRight,
  Filter,
} from "lucide-react";

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  isUnread?: boolean;
  isStarred?: boolean;
}

export default function ChatHistory() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const mockChatHistory: ChatHistoryItem[] = [
    {
      id: "chat-123",
      title: "Request for Quote: Compression Gloves",
      timestamp: "2025-03-15T14:49:23",
      preview: "For which products would you like to obtain quotes?",
      isUnread: false,
      isStarred: true,
    },
    {
      id: "chat-124",
      title: "Bulk Order Inquiry",
      timestamp: "2025-03-14T10:23:15",
      preview: "I'd like to place a bulk order for surgical masks and gloves.",
      isUnread: false,
      isStarred: false,
    },
    {
      id: "chat-125",
      title: "Price Comparison Request",
      timestamp: "2025-03-12T16:05:47",
      preview: "Can you compare prices for the following items?",
      isUnread: true,
      isStarred: false,
    },
    {
      id: "chat-126",
      title: "Stock Availability Check",
      timestamp: "2025-03-10T09:12:33",
      preview: "I need to check if these items are in stock.",
      isUnread: false,
      isStarred: true,
    },
    {
      id: "chat-127",
      title: "Special Discount Inquiry",
      timestamp: "2025-03-08T13:45:21",
      preview: "Are there any discounts available for bulk purchases?",
      isUnread: false,
      isStarred: false,
    },
    {
      id: "chat-128",
      title: "Product Specifications Request",
      timestamp: "2025-03-05T11:30:17",
      preview: "Can you provide detailed specifications for these products?",
      isUnread: false,
      isStarred: false,
    },
    {
      id: "chat-129",
      title: "Delivery Timeframe Question",
      timestamp: "2025-03-01T15:20:42",
      preview: "What's the estimated delivery time for these items?",
      isUnread: false,
      isStarred: false,
    },
    {
      id: "chat-130",
      title: "Custom Order Request",
      timestamp: "2025-02-25T10:15:38",
      preview:
        "I'd like to place a custom order with the following requirements.",
      isUnread: false,
      isStarred: false,
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch chat history
    setTimeout(() => {
      setChatHistory(mockChatHistory);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter chat history based on search term and date filter
  const filteredChatHistory = chatHistory.filter((chat) => {
    const matchesSearch =
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchTerm.toLowerCase());

    if (dateFilter === "all") return matchesSearch;

    const chatDate = new Date(chat.timestamp);
    const today = new Date();

    switch (dateFilter) {
      case "today":
        return (
          matchesSearch &&
          chatDate.getDate() === today.getDate() &&
          chatDate.getMonth() === today.getMonth() &&
          chatDate.getFullYear() === today.getFullYear()
        );
      case "week":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        return matchesSearch && chatDate >= oneWeekAgo;
      case "month":
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return matchesSearch && chatDate >= oneMonthAgo;
      default:
        return matchesSearch;
    }
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();

    // Check if the date is today
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Check if the date is yesterday
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // For older dates
    return (
      date.toLocaleDateString([], { month: "short", day: "numeric" }) +
      `, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    );
  };

  const handleChatSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="h-full   flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Chat History</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b  border-gray-200 px-6 py-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            Filter by:
          </span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-sm border-0 focus:ring-0 text-gray-600 bg-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        ) : filteredChatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare className="h-12 w-12 mb-2 text-gray-400" />
            <p className="text-lg font-medium">No conversations found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredChatHistory.map((chat) => (
              <div
                key={chat.id}
                className="px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleChatSelect(chat.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center space-x-2">
                      <h3
                        className={`font-medium ${
                          chat.isUnread ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {chat.title}
                      </h3>
                      {chat.isUnread && (
                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                      )}
                      {chat.isStarred && (
                        <span className="text-yellow-500 text-sm">★</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                      {chat.preview}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(chat.timestamp)}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="bg-white border-t border-gray-200 p-4">
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center"
          onClick={() => router.push("/chat/new")}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Start New Chat
        </button>
      </div>
    </div>
  );
}
