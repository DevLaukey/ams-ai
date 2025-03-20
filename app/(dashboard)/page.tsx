"use client";

import React from "react";
import { Search, Bell, ShoppingCart, MoreHorizontal } from "lucide-react";

interface ProductBase {
  id: string;
  name: string;
  description: string;
  category: "Small" | "Medium" | "Large";
  price: number;
  image: string;
}

interface SavingsProduct extends ProductBase {
  alternativePrice: string;
  potentialSavings: string;
  potentialSavingsPercentage: number;
}

interface StockProduct extends ProductBase {
  required: number;
  couldSave: string;
}

const TablePagination = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => (
  <div className="flex items-center justify-between px-2 py-3 text-sm text-gray-500">
    <div>{`${currentPage}-5 of ${totalPages}`}</div>
    <div className="flex gap-1">
      <button className="p-1 hover:bg-gray-100 rounded" title="First page">
        «
      </button>
      <button className="p-1 hover:bg-gray-100 rounded" title="Previous page">
        ‹
      </button>
      <button className="p-1 hover:bg-gray-100 rounded" title="Next page">
        ›
      </button>
      <button className="p-1 hover:bg-gray-100 rounded" title="Last page">
        »
      </button>
    </div>
  </div>
);

export default function Dashboard() {
  const savingsData: SavingsProduct[] = [
    {
      id: "1",
      name: "Vacutaries",
      category: "Small",
      description: "Powder Free, Beaded cuff, Compression gloves",
      price: 20,
      alternativePrice: "$15 - $19",
      potentialSavings: "$1,243 - $1,989",
      potentialSavingsPercentage: 20,
      image: "gloves1.jpg",
    },
    {
      id: "2",
      name: "Compression Gloves",
      category: "Small",
      description: "Powder Free, Beaded cuff, Compression gloves",
      price: 45,
      alternativePrice: "$42 - $44",
      potentialSavings: "$10,243 - $12,200",
      potentialSavingsPercentage: 10,
      image: "gloves1.jpg",
    },
    // Add more items as needed
  ];

  const stockData: StockProduct[] = [
    {
      id: "1",
      name: "Compression Gloves",
      category: "Small",
      description: "Powder Free, Beaded cuff, Compression gloves",
      price: 15,
      required: 1272,
      couldSave: "20%",
      image: "/gloves1.jpg",
    },
    {
      id: "2",
      name: "Flush Syringes",
      category: "Small",
      description: "Powder Free, Beaded cuff, Compression gloves",
      price: 42,
      required: 2152,
      couldSave: "10%",
      image: "/gloves1.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
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
      <div className="p-6">
        {/* Top Savings Opportunities */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Savings Opportunities
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Products Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Alternative Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Potential Savings ($)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Potential Savings (%)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {savingsData.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-gray-600 truncate">
                            {product.description}
                          </span>
                          <button className="ml-1 text-blue-600 hover:text-blue-800">
                            More
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">${product.price}</td>
                      <td className="py-3 px-4">{product.alternativePrice}</td>
                      <td className="py-3 px-4">{product.potentialSavings}</td>
                      <td className="py-3 px-4">
                        {product.potentialSavingsPercentage}%
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          Get Better Offer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination currentPage={1} totalPages={40} />
          </div>
        </div>

        {/* Out of Stock Alerts */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Out of Stock Alerts
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Products Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Required
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Could save
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      -
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-gray-600 truncate">
                            {product.description}
                          </span>
                          <button className="ml-1 text-blue-600 hover:text-blue-800">
                            More
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.required}</td>
                      <td className="py-3 px-4">${product.price}</td>
                      <td className="py-3 px-4">{product.couldSave}</td>
                      <td className="py-3 px-4 text-center">
                        <button>
                          <MoreHorizontal className="h-5 w-5 text-gray-400" />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          Get Better Offer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination currentPage={1} totalPages={113} />
          </div>
        </div>
      </div>
    </div>
  );
}
