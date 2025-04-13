"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, ShoppingCart, PlusCircle, Loader2 } from "lucide-react";
import supabase from "@/lib/supabase";
import InventoryStats from "../../../components/InventoryStats";
import InventoryTable from "../../../components/InventoryTable";
import InventoryItemModal from "../../../components/InventoryItemModal";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    categoryCount: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const itemsPerPage = 5;

  // Fetch inventory data
  useEffect(() => {
    const fetchInventoryData = async () => {
      setIsLoading(true);
      try {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        let query = supabase.from("inventory").select("*", { count: "exact" });

        if (searchTerm) {
          query = query.or(
            `name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`
          );
        }

        if (filterCategory) {
          query = query.eq("category", filterCategory);
        }

        if (filterStatus) {
          query = query.eq("status", filterStatus);
        }

        const { data, error, count } = await query
          .range(from, to)
          .order("name", { ascending: true });

        if (error) throw error;

        setInventoryData(data || []);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
        fetchInventoryStats();
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

  // Handler for adding a new item
  const handleAddItem = () => {
    setEditingItem({
      id: "",
      name: "",
      category: "Small",
      sku: "",
      quantity: 0,
      reorder_point: 0,
      price: 0,
      supplier: "",
      last_ordered: new Date().toISOString().split("T")[0],
      status: "In Stock",
      location: "",
    });
    setIsModalOpen(true);
  };

  // Handler for editing an item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Handler for reordering an item
  const handleReorder = async (item) => {
    try {
      const { error } = await supabase
        .from("inventory")
        .update({
          last_ordered: new Date().toISOString().split("T")[0],
        })
        .eq("id", item.id);

      if (error) throw error;

      // Refresh inventory data
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      const { data } = await supabase
        .from("inventory")
        .select("*")
        .range(from, to)
        .order("name", { ascending: true });

      setInventoryData(data || []);
      alert(`Reorder placed for ${item.name}`);
    } catch (error) {
      console.error("Error reordering item:", error);
      alert("Failed to place reorder. Please try again.");
    }
  };

  // Handler for saving an item
  const handleSaveItem = async () => {
    if (!editingItem) return;

    try {
      setIsLoading(true);

      if (editingItem.id) {
        // Update existing item
        const { error } = await supabase
          .from("inventory")
          .update({
            name: editingItem.name,
            category: editingItem.category,
            sku: editingItem.sku,
            quantity: editingItem.quantity,
            reorder_point: editingItem.reorder_point,
            price: editingItem.price,
            supplier: editingItem.supplier,
            last_ordered: editingItem.last_ordered,
            location: editingItem.location,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase.from("inventory").insert({
          name: editingItem.name,
          category: editingItem.category,
          sku: editingItem.sku,
          quantity: editingItem.quantity,
          reorder_point: editingItem.reorder_point,
          price: editingItem.price,
          supplier: editingItem.supplier,
          last_ordered: editingItem.last_ordered,
          location: editingItem.location,
        });

        if (error) throw error;
      }

      // Close modal and refresh data
      setIsModalOpen(false);
      setEditingItem(null);

      // Refresh inventory data
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      const { data } = await supabase
        .from("inventory")
        .select("*")
        .range(from, to)
        .order("name", { ascending: true });

      setInventoryData(data || []);
      fetchInventoryStats();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting an item
  const handleDeleteItem = async (item) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      // Refresh inventory data
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      const { data, count } = await supabase
        .from("inventory")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("name", { ascending: true });

      setInventoryData(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      fetchInventoryStats();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsLoading(false);
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
                  setCurrentPage(1);
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
        <InventoryStats stats={stats} />

        {/* Inventory Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Inventory Items
            </h2>
            <div className="flex items-center space-x-2">
              <button
                className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                onClick={handleAddItem}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <InventoryTable
            inventoryData={inventoryData}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            handleEditItem={handleEditItem}
            handleReorder={handleReorder}
            handleDeleteItem={handleDeleteItem}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <InventoryItemModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleSaveItem={handleSaveItem}
      />
    </div>
  );
};

export default Inventory;
