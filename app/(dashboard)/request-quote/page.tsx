// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Bell,
//   ShoppingCart,
//   Menu,
//   Copy,
//   Send,
//   ThumbsUp,
//   ThumbsDown,
//   RefreshCcw,
// } from "lucide-react";

// export default function HomeComponent() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [messages, setMessages] = useState<
//     { type: string; content: string; timestamp: string; sources?: string[] }[]
//   >([]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [currentTime, setCurrentTime] = useState<string>("");

//   // Set the initial time after component mounts (client-side only)
//   useEffect(() => {
//     setCurrentTime(new Date().toLocaleString());
//   }, []);

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;

//     setIsLoading(true);
//     const userMessage = {
//       type: "user",
//       content: inputText,
//       timestamp: new Date().toLocaleString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const response = await fetch(
//         "https://ams-api-534297186371.us-central1.run.app/query/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             question: inputText,
//           }),
//         }
//       );

//       const data = await response.json();

//       const aiMessage = {
//         type: "ai",
//         content: data.response.response,
//         timestamp: new Date().toLocaleString(),
//         sources: data.response.sources,
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//     } catch (error) {
//       const errorMessage = {
//         type: "error",
//         content: "Sorry, there was an error processing your request.",
//         timestamp: new Date().toLocaleString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     }

//     setIsLoading(false);
//     setInputText("");
//   };

//   interface Message {
//     type: string;
//     content: string;
//     timestamp: string;
//     sources?: string[];
//   }

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleCopyText = (text: string): void => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       <div className="flex-1 flex flex-col min-w-0">
//         <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
//           <div className="flex items-center">
//             <button
//               className="mr-4 md:hidden"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu className="h-6 w-6" />
//             </button>
//             <h1 className="text-xl font-semibold text-gray-800">
//               Request for Quote
//             </h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative hidden md:block">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <button className="p-2 hover:bg-gray-100 rounded-lg">
//                 <Bell className="h-5 w-5 text-gray-600" />
//               </button>
//               <div className="relative">
//                 <button className="p-2 hover:bg-gray-100 rounded-lg">
//                   <ShoppingCart className="h-5 w-5 text-gray-600" />
//                 </button>
//                 <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                   2
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//           {messages.length === 0 && currentTime && (
//             <div className="flex items-start space-x-4 mb-6">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <span className="text-white text-sm">AI</span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center flex-wrap gap-2">
//                   <span className="font-medium">AMS AI</span>
//                   <span className="text-gray-400 text-sm">{currentTime}</span>
//                 </div>
//                 <p className="mt-2 text-gray-700">
//                   For which products would you like to obtain quotes?
//                 </p>
//                 <p className="mt-2 text-gray-600">
//                   Select product via search or type in product name
//                 </p>
//               </div>
//             </div>
//           )}

//           {messages.map((message, index) => (
//             <div key={index} className="flex items-start space-x-4 mb-6">
//               <div
//                 className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
//                 ${message.type === "ai" ? "bg-blue-600" : "bg-gray-600"}`}
//               >
//                 <span className="text-white text-sm">
//                   {message.type === "ai" ? "AI" : "U"}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center flex-wrap gap-2">
//                   <span className="font-medium">
//                     {message.type === "ai" ? "AMS AI" : "You"}
//                   </span>
//                   <span className="text-gray-400 text-sm">
//                     {message.timestamp}
//                   </span>
//                 </div>
//                 <p
//                   className={`mt-2 ${
//                     message.type === "error" ? "text-red-500" : "text-gray-700"
//                   }`}
//                 >
//                   {message.content}
//                 </p>
//                 {message.type === "ai" && (
//                   <div className="mt-4 flex flex-wrap gap-2">
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       onClick={() => handleCopyText(message.content)}
//                     >
//                       <Copy className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <ThumbsUp className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <ThumbsDown className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <RefreshCcw className="h-5 w-5 text-gray-600" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {isLoading && (
//             <div className="flex items-center justify-center space-x-2">
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "0ms" }}
//               ></div>
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "150ms" }}
//               ></div>
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "300ms" }}
//               ></div>
//             </div>
//           )}
//         </div>

//         <div className="border-t border-gray-200 p-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Ask anything"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full p-4 pr-32 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 onClick={() => handleCopyText(inputText)}
//               >
//                 <Copy className="h-5 w-5 text-gray-600" />
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
//                 onClick={handleSendMessage}
//                 disabled={isLoading}
//               >
//                 <span className="hidden sm:inline">Send</span>
//                 <Send className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Bell,
//   ShoppingCart,
//   Menu,
//   Copy,
//   Send,
//   ThumbsUp,
//   ThumbsDown,
//   RefreshCcw,
// } from "lucide-react";

// export default function HomeComponent() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [messages, setMessages] = useState<
//     { type: string; content: string; timestamp: string; sources?: string[] }[]
//   >([]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [currentTime, setCurrentTime] = useState<string>("");

//   // Set the initial time after component mounts (client-side only)
//   useEffect(() => {
//     setCurrentTime(new Date().toLocaleString());
//   }, []);

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;

//     setIsLoading(true);

//     // Add user message to the conversation
//     const userMessage = {
//       type: "user",
//       content: inputText,
//       timestamp: new Date().toLocaleString(),
//     };
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       // Use our internal Next.js route (POST to /api)
//       const response = await fetch("/api", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ question: inputText }),
//       });

//       const data = await response.json();
//       const aiMessage = {
//         type: "ai",
//         content: data.response.response,
//         timestamp: new Date().toLocaleString(),
//         sources: data.response.sources,
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//     } catch (error) {
//       const errorMessage = {
//         type: "error",
//         content: "Sorry, there was an error processing your request.",
//         timestamp: new Date().toLocaleString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     }

//     setIsLoading(false);
//     setInputText("");
//   };

//   // Interface for clarity (optional)
//   interface Message {
//     type: string;
//     content: string;
//     timestamp: string;
//     sources?: string[];
//   }

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleCopyText = (text: string): void => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/** Overlay for mobile sidebar **/}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
//           <div className="flex items-center">
//             <button
//               className="mr-4 md:hidden"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu className="h-6 w-6" />
//             </button>
//             <h1 className="text-xl font-semibold text-gray-800">
//               Request for Quote
//             </h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             {/* Search Box (Desktop) */}
//             <div className="relative hidden md:block">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <button className="p-2 hover:bg-gray-100 rounded-lg">
//                 <Bell className="h-5 w-5 text-gray-600" />
//               </button>
//               <div className="relative">
//                 <button className="p-2 hover:bg-gray-100 rounded-lg">
//                   <ShoppingCart className="h-5 w-5 text-gray-600" />
//                 </button>
//                 <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                   2
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Chat area */}
//         <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//           {/* Initial message if no conversation yet */}
//           {messages.length === 0 && currentTime && (
//             <div className="flex items-start space-x-4 mb-6">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <span className="text-white text-sm">AI</span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center flex-wrap gap-2">
//                   <span className="font-medium">AMS AI</span>
//                   <span className="text-gray-400 text-sm">{currentTime}</span>
//                 </div>
//                 <p className="mt-2 text-gray-700">
//                   For which products would you like to obtain quotes?
//                 </p>
//                 <p className="mt-2 text-gray-600">
//                   Select product via search or type in product name
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Display conversation messages */}
//           {messages.map((message, index) => (
//             <div key={index} className="flex items-start space-x-4 mb-6">
//               <div
//                 className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
//                 ${message.type === "ai" ? "bg-blue-600" : "bg-gray-600"}`}
//               >
//                 <span className="text-white text-sm">
//                   {message.type === "ai" ? "AI" : "U"}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center flex-wrap gap-2">
//                   <span className="font-medium">
//                     {message.type === "ai" ? "AMS AI" : "You"}
//                   </span>
//                   <span className="text-gray-400 text-sm">
//                     {message.timestamp}
//                   </span>
//                 </div>
//                 <p
//                   className={`mt-2 ${
//                     message.type === "error" ? "text-red-500" : "text-gray-700"
//                   }`}
//                 >
//                   {message.content}
//                 </p>

//                 {/* If it's an AI message, show copy/feedback buttons */}
//                 {message.type === "ai" && (
//                   <div className="mt-4 flex flex-wrap gap-2">
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       onClick={() => handleCopyText(message.content)}
//                     >
//                       <Copy className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <ThumbsUp className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <ThumbsDown className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <RefreshCcw className="h-5 w-5 text-gray-600" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Loading animation */}
//           {isLoading && (
//             <div className="flex items-center justify-center space-x-2">
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "0ms" }}
//               />
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "150ms" }}
//               />
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "300ms" }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Input area */}
//         <div className="border-t border-gray-200 p-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Ask anything"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full p-4 pr-32 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
//               {/* Copy button for user input (optional) */}
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 onClick={() => handleCopyText(inputText)}
//               >
//                 <Copy className="h-5 w-5 text-gray-600" />
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
//                 onClick={handleSendMessage}
//                 disabled={isLoading}
//               >
//                 <span className="hidden sm:inline">Send</span>
//                 <Send className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Bell,
//   ShoppingCart,
//   Menu,
//   Copy,
//   Send,
//   ThumbsUp,
//   ThumbsDown,
//   RefreshCcw,
// } from "lucide-react";

// export default function ChatPage() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [messages, setMessages] = useState<
//     { type: string; content: string; timestamp: string; sources?: string[] }[]
//   >([]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [currentTime, setCurrentTime] = useState<string>("");

//   // Set the initial time after component mounts (client-side only)
//   useEffect(() => {
//     setCurrentTime(new Date().toLocaleString());
//   }, []);

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;

//     setIsLoading(true);
//     const userMessage = {
//       type: "user",
//       content: inputText,
//       timestamp: new Date().toLocaleString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       // POST to the local /api route
//       const response = await fetch("/api", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           question: inputText,
//         }),
//       });

//       const data = await response.json();

//       const aiMessage = {
//         type: "ai",
//         content: data?.response?.response ?? "",
//         timestamp: new Date().toLocaleString(),
//         sources: data?.response?.sources ?? [],
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//     } catch (error) {
//       const errorMessage = {
//         type: "error",
//         content: "Sorry, there was an error processing your request.",
//         timestamp: new Date().toLocaleString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     }

//     setIsLoading(false);
//     setInputText("");
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleCopyText = (text: string): void => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
//           <div className="flex items-center">
//             <button
//               className="mr-4 md:hidden"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu className="h-6 w-6" />
//             </button>
//             <h1 className="text-xl font-semibold text-gray-800">
//               Request for Quote
//             </h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative hidden md:block">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <button className="p-2 hover:bg-gray-100 rounded-lg">
//                 <Bell className="h-5 w-5 text-gray-600" />
//               </button>
//               <div className="relative">
//                 <button className="p-2 hover:bg-gray-100 rounded-lg">
//                   <ShoppingCart className="h-5 w-5 text-gray-600" />
//                 </button>
//                 <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                   2
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//           {/* If no messages yet, show an initial AI prompt */}
//           {messages.length === 0 && currentTime && (
//             <div className="flex items-start space-x-4 mb-6">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <span className="text-white text-sm">AI</span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center flex-wrap gap-2">
//                   <span className="font-medium">AMS AI</span>
//                   <span className="text-gray-400 text-sm">{currentTime}</span>
//                 </div>
//                 <p className="mt-2 text-gray-700">
//                   For which products would you like to obtain quotes?
//                 </p>
//                 <p className="mt-2 text-gray-600">
//                   Select product via search or type in product name
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Render conversation messages */}
//           {messages.map((message, index) => (
//             <div key={index} className="flex items-start space-x-4 mb-6">
//               <div
//                 className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
//                   ${message.type === "ai" ? "bg-blue-600" : "bg-gray-600"}`}
//               >
//                 <span className="text-white text-sm">
//                   {message.type === "ai" ? "AI" : "U"}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center flex-wrap gap-2">
//                   <span className="font-medium">
//                     {message.type === "ai" ? "AMS AI" : "You"}
//                   </span>
//                   <span className="text-gray-400 text-sm">
//                     {message.timestamp}
//                   </span>
//                 </div>
//                 <p
//                   className={`mt-2 ${
//                     message.type === "error" ? "text-red-500" : "text-gray-700"
//                   }`}
//                 >
//                   {message.content}
//                 </p>

//                 {message.type === "ai" && (
//                   <div className="mt-4 flex flex-wrap gap-2">
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       onClick={() => handleCopyText(message.content)}
//                     >
//                       <Copy className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <ThumbsUp className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <ThumbsDown className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <RefreshCcw className="h-5 w-5 text-gray-600" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Loading dots */}
//           {isLoading && (
//             <div className="flex items-center justify-center space-x-2">
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "0ms" }}
//               />
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "150ms" }}
//               />
//               <div
//                 className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
//                 style={{ animationDelay: "300ms" }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Input area */}
//         <div className="border-t border-gray-200 p-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Ask anything"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full p-4 pr-32 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
//               {/* Copy button for user input (optional) */}
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 onClick={() => handleCopyText(inputText)}
//               >
//                 <Copy className="h-5 w-5 text-gray-600" />
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
//                 onClick={handleSendMessage}
//                 disabled={isLoading}
//               >
//                 <span className="hidden sm:inline">Send</span>
//                 <Send className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<
    { type: string; content: string; timestamp: string; sources?: string[] }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");

  // Set the initial time after component mounts (client-side only)
  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
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
      // POST to the local /api route or your external API
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: inputText,
        }),
      });

      const data = await response.json();

      const aiMessage = {
        type: "ai",
        content: data?.response?.response ?? "",
        timestamp: new Date().toLocaleString(),
        sources: data?.response?.sources ?? [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error); // <-- Use the caught error so it's not "unused".
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
            <h1 className="text-xl font-semibold text-gray-800">
              Request for Quote
            </h1>
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
                  For which products would you like to obtain quotes?
                </p>
                <p className="mt-2 text-gray-600">
                  Select product via search or type in product name
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
                <p
                  className={`mt-2 ${
                    message.type === "error" ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {message.content}
                </p>

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
              placeholder="Ask anything"
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
