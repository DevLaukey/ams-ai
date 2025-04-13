"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ShoppingCart,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  PlusCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import supabase from "@/lib/supabase";


interface InventoryItem {
  id: string;
  name: string;
  category: "Small" | "Medium" | "Large";
  sku: string;
  quantity: number;
  reorder_point: number; // Changed from reorderPoint to match typical DB naming convention
  price: number;
  supplier: string;
  last_ordered: string; // Changed from lastOrdered to match typical DB naming convention
  status: "In Stock" | "Low Stock" | "Out of Stock";
  location: string;
}

interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  categoryCount: number;
}

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex items-center justify-between px-2 py-3 text-sm text-gray-500">
    <div>{`${currentPage}-5 of ${totalPages}`}</div>
    <div className="flex gap-1">
      <button
        className="p-1 hover:bg-gray-100 rounded"
        title="First page"
        onClick={() => onPageChange(1)}
      >
        «
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded"
        title="Previous page"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        ‹
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded"
        title="Next page"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        ›
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded"
        title="Last page"
        onClick={() => onPageChange(totalPages)}
      >
        »
      </button>
    </div>
  </div>
);

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    categoryCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const itemsPerPage = 5; // Number of items to display per page

  // Fetch inventory data from Supabase
  useEffect(() => {
    const fetchInventoryData = async () => {
      setIsLoading(true);
      try {
        // Calculate the range for pagination
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // Build the query with filters
        let query = supabase.from("inventory").select("*", { count: "exact" });

        // Apply search filter if provided
        if (searchTerm) {
          query = query.or(
            `name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`
          );
        }

        // Apply category filter if provided
        if (filterCategory) {
          query = query.eq("category", filterCategory);
        }

        // Apply status filter if provided
        if (filterStatus) {
          query = query.eq("status", filterStatus);
        }

        // Execute the query with pagination
        const { data, error, count } = await query
          .range(from, to)
          .order("name", { ascending: true });

        if (error) {
          throw error;
        }

        // Update data and total pages
        setInventoryData(data || []);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));

        // After setting inventory data, fetch stats
        fetchInventoryStats();
        // Fetch recent activity
        fetchRecentActivity();
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, [searchTerm, filterCategory, filterStatus, currentPage]);

  // Fetch inventory statistics
  const fetchInventoryStats = async () => {
    try {
      // Get total items
      const { count: totalItems } = await supabase
        .from("inventory")
        .select("*", { count: "exact", head: true });

      // Get low stock items
      const { count: lowStockItems } = await supabase
        .from("inventory")
        .select("*", { count: "exact", head: true })
        .eq("status", "Low Stock");

      // Get out of stock items
      const { count: outOfStockItems } = await supabase
        .from("inventory")
        .select("*", { count: "exact", head: true })
        .eq("status", "Out of Stock");

      // Get total value
      const { data: valueData } = await supabase
        .from("inventory")
        .select("quantity, price");

      const totalValue =
        valueData?.reduce((acc, item) => acc + item.quantity * item.price, 0) ||
        0;

      // Get unique categories
      const { data: categories } = await supabase
        .from("inventory")
        .select("category")
        .limit(1000);

      const uniqueCategories = new Set(
        categories?.map((item) => item.category)
      );

      setStats({
        totalItems: totalItems || 0,
        lowStockItems: lowStockItems || 0,
        outOfStockItems: outOfStockItems || 0,
        totalValue,
        categoryCount: uniqueCategories.size,
      });
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
    }
  };

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory_activity")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(4);

      if (error) throw error;
      setRecentActivity(data || []);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  // Handle adding a new item (placeholder - to be implemented)
  const handleAddItem = () => {
    // Here you would typically open a modal or navigate to a new page
    console.log("Add item clicked");
  };

  // Handle reordering an item
  const handleReorder = async (item: InventoryItem) => {
    try {
      // Create a reorder activity record
      const { error } = await supabase.from("inventory_activity").insert({
        type: "Order placed",
        description: `${item.quantity} units of ${item.name} ordered from ${item.supplier}`,
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;

      // Refresh the activity feed
      fetchRecentActivity();
    } catch (error) {
      console.error("Error reordering item:", error);
    }
  };

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Order received":
      case "Order placed":
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case "Low stock alert":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "New item added":
        return <PlusCircle className="h-5 w-5 text-green-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "Order received":
      case "Order placed":
        return "bg-blue-100";
      case "Low stock alert":
        return "bg-red-100";
      case "New item added":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset page when search changes
                }}
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
                  {stats.outOfStockItems}
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
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalItems.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Across {stats.categoryCount} categories
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Low Stock
            </h3>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.lowStockItems}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Items below reorder point
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Out of Stock
            </h3>
            <div className="text-2xl font-bold text-red-500">
              {stats.outOfStockItems}
            </div>
            <div className="text-sm text-gray-500 mt-1">Items to reorder</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Inventory Value
            </h3>
            <div className="text-2xl font-bold text-gray-900">
              ${stats.totalValue.toLocaleString()}
            </div>
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
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1); // Reset page when filter changes
                  }}
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
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1); // Reset page when filter changes
                  }}
                  className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <button
                className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                onClick={handleAddItem}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                  <span className="ml-2 text-gray-600">
                    Loading inventory data...
                  </span>
                </div>
              ) : (
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
                    {inventoryData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-6 text-gray-500"
                        >
                          No inventory items found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      inventoryData.map((item) => (
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
                          <td className="py-3 px-4 text-gray-600">
                            {item.sku}
                          </td>
                          <td className="py-3 px-4">
                            {item.status === "Out of Stock" ? (
                              <div className="flex items-center text-red-600">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {item.quantity}
                              </div>
                            ) : item.quantity <= item.reorder_point ? (
                              <div className="flex items-center text-yellow-600">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {item.quantity}
                              </div>
                            ) : (
                              <div className="text-gray-900">
                                {item.quantity}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {item.reorder_point}
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            ${item.price}
                          </td>
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
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleReorder(item)}
                              >
                                Reorder
                              </button>
                              <button>
                                <MoreHorizontal className="h-5 w-5 text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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
                {recentActivity.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No recent activity found.
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div
                        className={`mr-4 ${getActivityBgColor(
                          activity.type
                        )} p-2 rounded-lg`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {activity.type}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  ))
                )}
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
