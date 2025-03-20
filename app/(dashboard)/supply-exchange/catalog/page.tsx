// // app/supply-exchange/page.tsx
// "use client";

// import React from "react";
// import { Search, Bell, ShoppingCart } from "lucide-react";

// interface CategoryCard {
//   id: string;
//   title: string;
//   image: string;
//   startingPrice: number;
//   offersCount: number;
// }

// const categories: CategoryCard[] = [
//   {
//     id: "1",
//     title: "Clinical Laboratory",
//     image: "/clinical-lab.jpg",
//     startingPrice: 10,
//     offersCount: 21,
//   },
//   {
//     id: "2",
//     title: "Instruments",
//     image: "/clinical-lab.jpg",
//     startingPrice: 10,
//     offersCount: 21,
//   },
//   {
//     id: "3",
//     title: "Furnishings",
//     image: "/clinical-lab.jpg",
//     startingPrice: 10,
//     offersCount: 21,
//   },
//   {
//     id: "4",
//     title: "Diagnostic Instruments",
//     image: "/clinical-lab.jpg",
//     startingPrice: 10,
//     offersCount: 21,
//   },
//   {
//     id: "5",
//     title: "Respiratory",
//     image: "/clinical-lab.jpg",
//     startingPrice: 10,
//     offersCount: 21,
//   },
//   {
//     id: "6",
//     title: "Apparel",
//     image: "/clinical-lab.jpg",
//     startingPrice: 10,
//     offersCount: 21,
//   },
//   {
//     id: "7",
//     title: "Gloves",
//     image: "/clinical-lab.jpg",
//     startingPrice: 10,
//     offersCount: 21,
//   },
//   {
//     id: "8",
//     title: "Housekeeping",
//     image: "/clinical-lab.jpg",
//     startingPrice: 10,
//     offersCount: 21,
//   },
// ];

// const CategoryCard: React.FC<CategoryCard> = ({
//   title,
//   image,
//   startingPrice,
//   offersCount,
// }) => (
//   <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
//     <div className="p-4">
//       <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
//         <img
//           src={image}
//           alt={title}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             const target = e.target as HTMLImageElement;
//             target.src = "/placeholder.jpg";
//           }}
//         />
//       </div>
//       <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
//       <p className="text-gray-600 mb-4">from {startingPrice}$</p>
//       <button className="w-full bg-navy-900 text-white py-2 px-4 rounded-lg hover:bg-navy-800 transition-colors">
//         Show {offersCount} Offers
//       </button>
//     </div>
//   </div>
// );

// export default function SupplyExchange() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <h1 className="text-xl font-semibold text-gray-900">
//                 Supply Exchange
//               </h1>
//               <span className="text-gray-400">/</span>
//               <h2 className="text-xl text-gray-900">Top Categories Catalog</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="relative hidden md:block">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button className="p-2 hover:bg-gray-100 rounded-lg">
//                   <Bell className="h-5 w-5 text-gray-600" />
//                 </button>
//                 <div className="relative">
//                   <button className="p-2 hover:bg-gray-100 rounded-lg">
//                     <ShoppingCart className="h-5 w-5 text-gray-600" />
//                   </button>
//                   <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                     2
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filter Tabs */}
//           <div className="flex space-x-4 mt-4">
//             <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium">
//               All
//             </button>
//             <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
//               Trending
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="px-4 sm:px-6 lg:px-8 py-6">
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold text-gray-900">
//             Top Categories Catalog
//           </h2>
//           <p className="text-gray-600 mt-1">
//             Shop Medical Supplies & Equipment
//           </p>
//         </div>

//         {/* Categories Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {categories.map((category) => (
//             <CategoryCard key={category.id} {...category} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React from "react";
import { Search, Bell, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface CategoryCardProps {
  id: string;
  title: string;
  image: string;
  startingPrice: number;
  offersCount: number;
}

const categories: CategoryCardProps[] = [
  {
    id: "1",
    title: "Clinical Laboratory",
    image: "/clinical-lab.jpg",
    startingPrice: 10,
    offersCount: 21,
  },
  {
    id: "2",
    title: "Instruments",
    image: "/clinical-lab.jpg",
    startingPrice: 10,
    offersCount: 21,
  },
  {
    id: "3",
    title: "Furnishings",
    image: "/clinical-lab.jpg",
    startingPrice: 10,
    offersCount: 21,
  },
  {
    id: "4",
    title: "Diagnostic Instruments",
    image: "/clinical-lab.jpg",
    startingPrice: 10,
    offersCount: 21,
  },
  {
    id: "5",
    title: "Respiratory",
    image: "/clinical-lab.jpg",
    startingPrice: 10,
    offersCount: 21,
  },
  {
    id: "6",
    title: "Apparel",
    image: "/clinical-lab.jpg",
    startingPrice: 10,
    offersCount: 21,
  },
  {
    id: "7",
    title: "Gloves",
    image: "/clinical-lab.jpg",
    startingPrice: 10,
    offersCount: 21,
  },
  {
    id: "8",
    title: "Housekeeping",
    image: "/clinical-lab.jpg",
    startingPrice: 10,
    offersCount: 21,
  },
];

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  image,
  startingPrice,
  offersCount,
}) => (
  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
    <div className="p-4">
      <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">from {startingPrice}$</p>
      <button className="w-full bg-navy-900 text-white py-2 px-4 rounded-lg hover:bg-navy-800 transition-colors">
        Show {offersCount} Offers
      </button>
    </div>
  </div>
);

export default function SupplyExchange() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Supply Exchange
              </h1>
              <span className="text-gray-400">/</span>
              <h2 className="text-xl text-gray-900">Top Categories Catalog</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
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

          {/* Filter Tabs */}
          <div className="flex space-x-4 mt-4">
            <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium">
              All
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
              Trending
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Top Categories Catalog
          </h2>
          <p className="text-gray-600 mt-1">
            Shop Medical Supplies & Equipment
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
}

