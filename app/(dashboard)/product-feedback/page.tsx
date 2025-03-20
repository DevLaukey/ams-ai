// // // app/product-feedback/page.tsx
// // "use client";

// // import React, { useState } from "react";
// // import { Search, ChevronDown, Calendar } from "lucide-react";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   ResponsiveContainer,
// // } from "recharts";

// // // Mock data for charts
// // const chartData = [
// //   { name: "Jan", value: 5 },
// //   { name: "Feb", value: 4 },
// //   { name: "Mar", value: 7 },
// //   { name: "Apr", value: 6 },
// //   { name: "May", value: 5 },
// // ];

// // interface ProductRating {
// //   id: string;
// //   image: string;
// //   name: string;
// //   averageRating: number;
// //   numberOfRatings: number;
// //   priorityRanking: number;
// //   opportunity: "High Opportunity" | "Mid Opportunity" | "Low Opportunity";
// // }

// // const products: ProductRating[] = [
// //   {
// //     id: "1",
// //     image: "/gloves1.jpg",
// //     name: "Compression Gloves",
// //     averageRating: 1.6,
// //     numberOfRatings: 1272,
// //     priorityRanking: 62,
// //     opportunity: "High Opportunity",
// //   },
// //   {
// //     id: "2",
// //     image: "/gloves1.jpg",
// //     name: "Exam Gloves",
// //     averageRating: 2.1,
// //     numberOfRatings: 2152,
// //     priorityRanking: 50,
// //     opportunity: "High Opportunity",
// //   },
// // ];

// // const StatCard = ({
// //   title,
// //   value,
// //   status,
// //   data,
// // }: {
// //   title: string;
// //   value: string;
// //   status: string;
// //   data: any[];
// // }) => (
// //   <div className="bg-white rounded-lg p-6 shadow-sm">
// //     <h3 className="text-lg font-medium text-gray-900">{title}</h3>
// //     <div className="mt-2 flex items-baseline">
// //       <p className="text-4xl font-semibold text-gray-900">{value}</p>
// //       {title.includes("Score") && (
// //         <span className="text-2xl text-gray-500 ml-1">/10</span>
// //       )}
// //       {title.includes("rate") && (
// //         <span className="text-2xl text-gray-500 ml-1">%</span>
// //       )}
// //     </div>
// //     <span
// //       className={`
// //       inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
// //       ${status === "Excellent" ? "bg-green-100 text-green-800" : ""}
// //       ${status === "Low" ? "bg-red-100 text-red-800" : ""}
// //       ${status === "High" ? "bg-green-100 text-green-800" : ""}
// //     `}
// //     >
// //       {status}
// //     </span>
// //     <div className="h-32 mt-4">
// //       <ResponsiveContainer width="100%" height="100%">
// //         <LineChart data={data}>
// //           <Line
// //             type="monotone"
// //             dataKey="value"
// //             stroke="#6366f1"
// //             strokeWidth={2}
// //             dot={false}
// //           />
// //           <XAxis dataKey="name" hide />
// //           <YAxis hide />
// //         </LineChart>
// //       </ResponsiveContainer>
// //     </div>
// //   </div>
// // );

// // const SelectInput = ({
// //   value,
// //   placeholder,
// // }: {
// //   value: string;
// //   placeholder: string;
// // }) => (
// //   <div className="relative">
// //     <select
// //       className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //       defaultValue={value}
// //     >
// //       <option value={value}>{value}</option>
// //     </select>
// //     <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
// //   </div>
// // );

// // export default function ProductFeedback() {
// //   const [activeTab, setActiveTab] = useState("products");

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-semibold text-gray-900">
// //           Products Feedback Analytics
// //         </h1>

// //         {/* Filters */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Products Category
// //             </label>
// //             <SelectInput value="Gloves" placeholder="Select category" />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Product
// //             </label>
// //             <SelectInput
// //               value="Exam Glove McKesson Confiderm® 3.0"
// //               placeholder="Select product"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Filters
// //             </label>
// //             <SelectInput value="Not Selected" placeholder="Select filters" />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Date Range
// //             </label>
// //             <div className="relative">
// //               <input
// //                 type="text"
// //                 className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                 value="All time"
// //                 readOnly
// //               />
// //               <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Stats Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //         <StatCard
// //           title="Average Products Score"
// //           value="9"
// //           status="Excellent"
// //           data={chartData}
// //         />
// //         <StatCard
// //           title="Number of Feedback Entries"
// //           value="67"
// //           status="Low"
// //           data={chartData}
// //         />
// //         <StatCard
// //           title="Overall Response rate"
// //           value="80"
// //           status="High"
// //           data={chartData}
// //         />
// //       </div>

// //       {/* Top Opportunities Section */}
// //       <div className="bg-white rounded-lg shadow-sm p-6">
// //         <div className="flex justify-between items-center mb-6">
// //           <h2 className="text-xl font-semibold text-gray-900">
// //             Top opportunities
// //           </h2>
// //           <div className="flex items-center space-x-4">
// //             <div className="relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
// //               <input
// //                 type="text"
// //                 placeholder="Search Product"
// //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //               />
// //             </div>
// //             <SelectInput value="All Time" placeholder="Select time range" />
// //           </div>
// //         </div>

// //         {/* Tabs */}
// //         <div className="border-b border-gray-200 mb-6">
// //           <div className="flex space-x-8">
// //             <button
// //               className={`pb-4 text-sm font-medium ${
// //                 activeTab === "products"
// //                   ? "border-b-2 border-blue-600 text-blue-600"
// //                   : "text-gray-500 hover:text-gray-700"
// //               }`}
// //               onClick={() => setActiveTab("products")}
// //             >
// //               Lowest Rated Products
// //             </button>
// //             <button
// //               className={`pb-4 text-sm font-medium ${
// //                 activeTab === "categories"
// //                   ? "border-b-2 border-blue-600 text-blue-600"
// //                   : "text-gray-500 hover:text-gray-700"
// //               }`}
// //               onClick={() => setActiveTab("categories")}
// //             >
// //               Lowest Rated Product Categories
// //             </button>
// //           </div>
// //         </div>

// //         {/* Table */}
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead>
// //               <tr className="border-b border-gray-200">
// //                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
// //                   PRODUCTS NAME
// //                 </th>
// //                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
// //                   AVERAGE RATING ▼
// //                 </th>
// //                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
// //                   NUMBER OF RATINGS
// //                 </th>
// //                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
// //                   PRIORITY RANKING ▼
// //                 </th>
// //                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
// //                   -
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {products.map((product) => (
// //                 <tr
// //                   key={product.id}
// //                   className="border-b border-gray-200 hover:bg-gray-50"
// //                 >
// //                   <td className="py-4 px-4">
// //                     <div className="flex items-center">
// //                       <div className="h-10 w-10 flex-shrink-0">
// //                         <img
// //                           className="h-10 w-10 rounded-lg"
// //                           src={product.image}
// //                           alt=""
// //                         />
// //                       </div>
// //                       <div className="ml-4">
// //                         <div className="font-medium text-gray-900">
// //                           {product.name}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="py-4 px-4">{product.averageRating}</td>
// //                   <td className="py-4 px-4">{product.numberOfRatings}</td>
// //                   <td className="py-4 px-4">
// //                     <div className="flex items-center">
// //                       <span className="mr-2">{product.priorityRanking}</span>
// //                       <span
// //                         className={`
// //                         inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
// //                         ${
// //                           product.opportunity === "High Opportunity"
// //                             ? "bg-green-100 text-green-800"
// //                             : ""
// //                         }
// //                         ${
// //                           product.opportunity === "Mid Opportunity"
// //                             ? "bg-yellow-100 text-yellow-800"
// //                             : ""
// //                         }
// //                         ${
// //                           product.opportunity === "Low Opportunity"
// //                             ? "bg-gray-100 text-gray-800"
// //                             : ""
// //                         }
// //                       `}
// //                       >
// //                         {product.opportunity}
// //                       </span>
// //                     </div>
// //                   </td>
// //                   <td className="py-4 px-4">
// //                     <button className="text-gray-400 hover:text-gray-500">
// //                       <ChevronDown className="h-5 w-5" />
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>

// //           {/* Pagination */}
// //           <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
// //             <div className="flex items-center text-sm text-gray-500">
// //               1-5 of 1,250
// //             </div>
// //             <div className="flex items-center space-x-2">
// //               <button className="p-1 hover:bg-gray-100 rounded">«</button>
// //               <button className="p-1 hover:bg-gray-100 rounded">‹</button>
// //               <button className="p-1 hover:bg-gray-100 rounded">›</button>
// //               <button className="p-1 hover:bg-gray-100 rounded">»</button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import React, { useState } from "react";
// import { Search, ChevronDown, Calendar } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
// } from "recharts";
// import Image from "next/image";

// // Mock data for charts
// const chartData = [
//   { name: "Jan", value: 5 },
//   { name: "Feb", value: 4 },
//   { name: "Mar", value: 7 },
//   { name: "Apr", value: 6 },
//   { name: "May", value: 5 },
// ];

// interface ChartDatum {
//   name: string;
//   value: number;
// }

// interface ProductRating {
//   id: string;
//   image: string;
//   name: string;
//   averageRating: number;
//   numberOfRatings: number;
//   priorityRanking: number;
//   opportunity: "High Opportunity" | "Mid Opportunity" | "Low Opportunity";
// }

// const products: ProductRating[] = [
//   {
//     id: "1",
//     image: "/gloves1.jpg",
//     name: "Compression Gloves",
//     averageRating: 1.6,
//     numberOfRatings: 1272,
//     priorityRanking: 62,
//     opportunity: "High Opportunity",
//   },
//   {
//     id: "2",
//     image: "/gloves1.jpg",
//     name: "Exam Gloves",
//     averageRating: 2.1,
//     numberOfRatings: 2152,
//     priorityRanking: 50,
//     opportunity: "High Opportunity",
//   },
// ];

// const StatCard = ({
//   title,
//   value,
//   status,
//   data,
// }: {
//   title: string;
//   value: string;
//   status: string;
//   data: ChartDatum[];
// }) => (
//   <div className="bg-white rounded-lg p-6 shadow-sm">
//     <h3 className="text-lg font-medium text-gray-900">{title}</h3>
//     <div className="mt-2 flex items-baseline">
//       <p className="text-4xl font-semibold text-gray-900">{value}</p>
//       {title.includes("Score") && (
//         <span className="text-2xl text-gray-500 ml-1">/10</span>
//       )}
//       {title.includes("rate") && (
//         <span className="text-2xl text-gray-500 ml-1">%</span>
//       )}
//     </div>
//     <span
//       className={`
//       inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
//       ${status === "Excellent" ? "bg-green-100 text-green-800" : ""}
//       ${status === "Low" ? "bg-red-100 text-red-800" : ""}
//       ${status === "High" ? "bg-green-100 text-green-800" : ""}
//     `}
//     >
//       {status}
//     </span>
//     <div className="h-32 mt-4">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={data}>
//           <Line
//             type="monotone"
//             dataKey="value"
//             stroke="#6366f1"
//             strokeWidth={2}
//             dot={false}
//           />
//           <XAxis dataKey="name" hide />
//           <YAxis hide />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// const SelectInput = ({
//   value,
//   placeholder,
// }: {
//   value: string;
//   placeholder: string;
// }) => (
//   <div className="relative">
//     <select
//       className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       defaultValue={value}
//     >
//       <option value={value}>{value}</option>
//     </select>
//     <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//   </div>
// );

// export default function ProductFeedback() {
//   const [activeTab, setActiveTab] = useState("products");

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">
//           Products Feedback Analytics
//         </h1>

//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Products Category
//             </label>
//             <SelectInput value="Gloves" placeholder="Select category" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Product
//             </label>
//             <SelectInput
//               value="Exam Glove McKesson Confiderm® 3.0"
//               placeholder="Select product"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Filters
//             </label>
//             <SelectInput value="Not Selected" placeholder="Select filters" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Date Range
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value="All time"
//                 readOnly
//               />
//               <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <StatCard
//           title="Average Products Score"
//           value="9"
//           status="Excellent"
//           data={chartData}
//         />
//         <StatCard
//           title="Number of Feedback Entries"
//           value="67"
//           status="Low"
//           data={chartData}
//         />
//         <StatCard
//           title="Overall Response rate"
//           value="80"
//           status="High"
//           data={chartData}
//         />
//       </div>

//       {/* Top Opportunities Section */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-900">
//             Top opportunities
//           </h2>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search Product"
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//             <SelectInput value="All Time" placeholder="Select time range" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-gray-200 mb-6">
//           <div className="flex space-x-8">
//             <button
//               className={`pb-4 text-sm font-medium ${
//                 activeTab === "products"
//                   ? "border-b-2 border-blue-600 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//               onClick={() => setActiveTab("products")}
//             >
//               Lowest Rated Products
//             </button>
//             <button
//               className={`pb-4 text-sm font-medium ${
//                 activeTab === "categories"
//                   ? "border-b-2 border-blue-600 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//               onClick={() => setActiveTab("categories")}
//             >
//               Lowest Rated Product Categories
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
//                   PRODUCTS NAME
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
//                   AVERAGE RATING ▼
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
//                   NUMBER OF RATINGS
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
//                   PRIORITY RANKING ▼
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
//                   -
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => (
//                 <tr
//                   key={product.id}
//                   className="border-b border-gray-200 hover:bg-gray-50"
//                 >
//                   <td className="py-4 px-4">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0 relative">
//                         <Image
//                           src={product.image}
//                           alt={product.name}
//                           width={40}
//                           height={40}
//                           className="rounded-lg"
//                           unoptimized
//                         />
//                       </div>
//                       <div className="ml-4">
//                         <div className="font-medium text-gray-900">
//                           {product.name}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">{product.averageRating}</td>
//                   <td className="py-4 px-4">{product.numberOfRatings}</td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center">
//                       <span className="mr-2">{product.priorityRanking}</span>
//                       <span
//                         className={`
//                         inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                         ${
//                           product.opportunity === "High Opportunity"
//                             ? "bg-green-100 text-green-800"
//                             : ""
//                         }
//                         ${
//                           product.opportunity === "Mid Opportunity"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : ""
//                         }
//                         ${
//                           product.opportunity === "Low Opportunity"
//                             ? "bg-gray-100 text-gray-800"
//                             : ""
//                         }
//                       `}
//                       >
//                         {product.opportunity}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <button className="text-gray-400 hover:text-gray-500">
//                       <ChevronDown className="h-5 w-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
//             <div className="flex items-center text-sm text-gray-500">
//               1-5 of 1,250
//             </div>
//             <div className="flex items-center space-x-2">
//               <button className="p-1 hover:bg-gray-100 rounded">«</button>
//               <button className="p-1 hover:bg-gray-100 rounded">‹</button>
//               <button className="p-1 hover:bg-gray-100 rounded">›</button>
//               <button className="p-1 hover:bg-gray-100 rounded">»</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

// Mock data for charts
const chartData = [
  { name: "Jan", value: 5 },
  { name: "Feb", value: 4 },
  { name: "Mar", value: 7 },
  { name: "Apr", value: 6 },
  { name: "May", value: 5 },
];

interface ChartDatum {
  name: string;
  value: number;
}

interface ProductRating {
  id: string;
  image: string;
  name: string;
  averageRating: number;
  numberOfRatings: number;
  priorityRanking: number;
  opportunity: "High Opportunity" | "Mid Opportunity" | "Low Opportunity";
}

const products: ProductRating[] = [
  {
    id: "1",
    image: "/gloves1.jpg",
    name: "Compression Gloves",
    averageRating: 1.6,
    numberOfRatings: 1272,
    priorityRanking: 62,
    opportunity: "High Opportunity",
  },
  {
    id: "2",
    image: "/gloves1.jpg",
    name: "Exam Gloves",
    averageRating: 2.1,
    numberOfRatings: 2152,
    priorityRanking: 50,
    opportunity: "High Opportunity",
  },
];

const StatCard = ({
  title,
  value,
  status,
  data,
}: {
  title: string;
  value: string;
  status: string;
  data: ChartDatum[];
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    <div className="mt-2 flex items-baseline">
      <p className="text-4xl font-semibold text-gray-900">{value}</p>
      {title.includes("Score") && (
        <span className="text-2xl text-gray-500 ml-1">/10</span>
      )}
      {title.includes("rate") && (
        <span className="text-2xl text-gray-500 ml-1">%</span>
      )}
    </div>
    <span
      className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
      ${status === "Excellent" ? "bg-green-100 text-green-800" : ""}
      ${status === "Low" ? "bg-red-100 text-red-800" : ""}
      ${status === "High" ? "bg-green-100 text-green-800" : ""}
    `}
    >
      {status}
    </span>
    <div className="h-32 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
          <XAxis dataKey="name" hide />
          <YAxis hide />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// Updated: Removed the `placeholder` prop
const SelectInput = ({ value }: { value: string }) => (
  <div className="relative">
    <select
      className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      defaultValue={value}
    >
      <option value={value}>{value}</option>
    </select>
    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
  </div>
);

export default function ProductFeedback() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Products Feedback Analytics
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Products Category
            </label>
            <SelectInput value="Gloves" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <SelectInput value="Exam Glove McKesson Confiderm® 3.0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filters
            </label>
            <SelectInput value="Not Selected" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="relative">
              <input
                type="text"
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value="All time"
                readOnly
              />
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Average Products Score"
          value="9"
          status="Excellent"
          data={chartData}
        />
        <StatCard
          title="Number of Feedback Entries"
          value="67"
          status="Low"
          data={chartData}
        />
        <StatCard
          title="Overall Response rate"
          value="80"
          status="High"
          data={chartData}
        />
      </div>

      {/* Top Opportunities Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Top opportunities
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search Product"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <SelectInput value="All Time" />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              className={`pb-4 text-sm font-medium ${
                activeTab === "products"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("products")}
            >
              Lowest Rated Products
            </button>
            <button
              className={`pb-4 text-sm font-medium ${
                activeTab === "categories"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              Lowest Rated Product Categories
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  PRODUCTS NAME
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  AVERAGE RATING ▼
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  NUMBER OF RATINGS
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  PRIORITY RANKING ▼
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  -
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                          unoptimized
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{product.averageRating}</td>
                  <td className="py-4 px-4">{product.numberOfRatings}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">{product.priorityRanking}</span>
                      <span
                        className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            product.opportunity === "High Opportunity"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                          ${
                            product.opportunity === "Mid Opportunity"
                              ? "bg-yellow-100 text-yellow-800"
                              : ""
                          }
                          ${
                            product.opportunity === "Low Opportunity"
                              ? "bg-gray-100 text-gray-800"
                              : ""
                          }
                        `}
                      >
                        {product.opportunity}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-gray-400 hover:text-gray-500">
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              1-5 of 1,250
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded">«</button>
              <button className="p-1 hover:bg-gray-100 rounded">‹</button>
              <button className="p-1 hover:bg-gray-100 rounded">›</button>
              <button className="p-1 hover:bg-gray-100 rounded">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
