// // app/compare-quotes/page.tsx
// "use client";

// import React, { useState } from "react";
// import { Search, Bell, ShoppingCart, Upload, Mic } from "lucide-react";

// const CompareQuotes = () => {
//   const [isDragging, setIsDragging] = useState(false);

//   // Get current time of day
//   const getTimeOfDay = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Morning";
//     if (hour < 17) return "Afternoon";
//     return "Evening";
//   };

//   // Handle drag events
//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setIsDragging(true);
//     } else if (e.type === "dragleave") {
//       setIsDragging(false);
//     }
//   };

//   // Handle drop event
//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//     const files = Array.from(e.dataTransfer.files);
//     // Handle the files here
//     console.log("Dropped files:", files);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="px-4 py-3 flex items-center justify-between">
//           <h1 className="text-xl font-semibold text-gray-900">
//             Compare Quotes
//           </h1>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
//       </div>

//       {/* Main Content */}
//       <div className="max-w-5xl mx-auto py-12 px-4">
//         {/* Welcome Message */}
//         <div className="flex justify-center mb-12">
//           <div className="text-center">
//             <div className="mb-8">
//               <img
//                 src="/chat-illustration.jpg"
//                 alt="Chat illustration"
//                 className="w-64 h-64 mx-auto"
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   target.style.display = "none";
//                 }}
//               />
//             </div>
//             <h2 className="text-5xl font-bold text-gray-900 mb-4">
//               Good {getTimeOfDay()}, Roy
//             </h2>
//           </div>
//         </div>

//         {/* Upload Section */}
//         <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//           <div className="p-6">
//             <p className="text-lg text-gray-700 mb-4">
//               Please upload all quotes received
//             </p>

//             {/* Upload Area */}
//             <div
//               className={`
//                 border-2 border-dashed rounded-xl p-8
//                 ${
//                   isDragging
//                     ? "border-indigo-500 bg-indigo-50"
//                     : "border-gray-300 hover:border-indigo-500"
//                 }
//                 transition-colors duration-200 ease-in-out
//               `}
//               onDragEnter={handleDrag}
//               onDragOver={handleDrag}
//               onDragLeave={handleDrag}
//               onDrop={handleDrop}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <div className="text-sm text-gray-600">
//                     Collaborate with AMS AI using document and more..
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <button className="flex items-center text-indigo-600 hover:text-indigo-700">
//                     <Upload className="h-5 w-5 mr-2" />
//                     Attach file
//                   </button>
//                   <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//                     <Mic className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompareQuotes;



"use client";

import React, { useState } from "react";
import { Search, Bell, ShoppingCart, Upload, Mic } from "lucide-react";
import Image from "next/image";

const CompareQuotes = () => {
  const [isDragging, setIsDragging] = useState(false);

  // Get current time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    // Handle the files here
    console.log("Dropped files:", files);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Compare Quotes
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* Welcome Message */}
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <div className="mb-8">
              <Image
                src="/chat-illustration.jpg"
                alt="Chat illustration"
                width={256}
                height={256}
                className="mx-auto"
                unoptimized
              />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Good {getTimeOfDay()}, Roy
            </h2>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6">
            <p className="text-lg text-gray-700 mb-4">
              Please upload all quotes received
            </p>

            {/* Upload Area */}
            <div
              className={`
                border-2 border-dashed rounded-xl p-8
                ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-500"
                }
                transition-colors duration-200 ease-in-out
              `}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-600">
                    Collaborate with AMS AI using document and more..
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center text-indigo-600 hover:text-indigo-700">
                    <Upload className="h-5 w-5 mr-2" />
                    Attach file
                  </button>
                  <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Mic className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareQuotes;
