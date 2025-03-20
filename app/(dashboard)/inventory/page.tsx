"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  ShoppingCart,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: "Small" | "Medium" | "Large";
  sku: string;
  quantity: number;
  reorderPoint: number;
  price: number;
  supplier: string;
  lastOrdered: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  location: string;
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

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const inventoryData: InventoryItem[] = [
    {
      id: "1",
      name: "Compression Gloves",
      category: "Small",
      sku: "GLV-CMP-S-001",
      quantity: 1272,
      reorderPoint: 500,
      price: 15,
      supplier: "MedSupply Co.",
      lastOrdered: "2025-02-15",
      status: "In Stock",
      location: "Warehouse A, Shelf 3",
    },
    {
      id: "2",
      name: "Flush Syringes",
      category: "Small",
      sku: "SYR-FL-S-002",
      quantity: 352,
      reorderPoint: 400,
      price: 42,
      supplier: "MedEquip Inc.",
      lastOrdered: "2025-02-28",
      status: "Low Stock",
      location: "Warehouse A, Shelf 5",
    },
    {
      id: "3",
      name: "Surgical Masks",
      category: "Small",
      sku: "MSK-SRG-S-003",
      quantity: 0,
      reorderPoint: 1000,
      price: 8,
      supplier: "SafetyFirst Ltd.",
      lastOrdered: "2025-01-10",
      status: "Out of Stock",
      location: "Warehouse B, Shelf 1",
    },
    {
      id: "4",
      name: "Examination Table",
      category: "Large",
      sku: "TBL-EXM-L-001",
      quantity: 12,
      reorderPoint: 5,
      price: 850,
      supplier: "MedFurniture Co.",
      lastOrdered: "2024-11-20",
      status: "In Stock",
      location: "Warehouse C, Zone 2",
    },
    {
      id: "5",
      name: "Blood Pressure Monitors",
      category: "Medium",
      sku: "MON-BP-M-001",
      quantity: 8,
      reorderPoint: 10,
      price: 120,
      supplier: "MedTech Solutions",
      lastOrdered: "2025-01-05",
      status: "Low Stock",
      location: "Warehouse B, Shelf 8",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInventory = inventoryData.filter((item) => {
    // Apply search term filter
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply category filter
    const matchesCategory =
      filterCategory === "" || item.category === filterCategory;

    // Apply status filter
    const matchesStatus = filterStatus === "" || item.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Inventory Management
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Total Items
            </h3>
            <div className="text-2xl font-bold text-gray-900">1,644</div>
            <div className="text-sm text-gray-500 mt-1">
              Across 5 categories
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Low Stock
            </h3>
            <div className="text-2xl font-bold text-yellow-500">32</div>
            <div className="text-sm text-gray-500 mt-1">
              Items below reorder point
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Out of Stock
            </h3>
            <div className="text-2xl font-bold text-red-500">8</div>
            <div className="text-sm text-gray-500 mt-1">Items to reorder</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Inventory Value
            </h3>
            <div className="text-2xl font-bold text-gray-900">$128,750</div>
            <div className="text-sm text-gray-500 mt-1">
              Total current value
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Inventory Items
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Categories</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <button className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                <PlusCircle className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      <div className="flex items-center">
                        Product Name
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      <div className="flex items-center">SKU</div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      <div className="flex items-center">
                        Quantity
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Reorder Point
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      <div className="flex items-center">
                        Price
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Supplier
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.sku}</td>
                      <td className="py-3 px-4">
                        {item.status === "Out of Stock" ? (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {item.quantity}
                          </div>
                        ) : item.quantity <= item.reorderPoint ? (
                          <div className="flex items-center text-yellow-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {item.quantity}
                          </div>
                        ) : (
                          <div className="text-gray-900">{item.quantity}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.reorderPoint}
                      </td>
                      <td className="py-3 px-4 text-gray-900">${item.price}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.supplier}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            Edit
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            Reorder
                          </button>
                          <button>
                            <MoreHorizontal className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination currentPage={1} totalPages={82} />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Inventory Activity
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 bg-blue-100 p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        Order received
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Today, 10:32 AM
                      </span>
                    </div>
                    <p className="text-gray-600">
                      100 units of Compression Gloves added to inventory
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-red-100 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        Low stock alert
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Today, 9:15 AM
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Blood Pressure Monitors below reorder point
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-green-100 p-2 rounded-lg">
                    <PlusCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        New item added
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Yesterday, 3:45 PM
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Digital Thermometers added to inventory catalog
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-blue-100 p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        Order placed
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Yesterday, 2:20 PM
                      </span>
                    </div>
                    <p className="text-gray-600">
                      1,000 units of Surgical Masks ordered from SafetyFirst
                      Ltd.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
