"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, ShoppingCart, PlusCircle, Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useAuth, useUser } from "@clerk/nextjs";
import supabase from "@/lib/supabase";
import InventoryStats from "../../../components/InventoryStats";
import InventoryTable from "../../../components/InventoryTable";
import InventoryItemModal from "../../../components/InventoryItemModal";

const Inventory = () => {
  const { userId: clerkUserId, isLoaded: isAuthLoaded } = useAuth();
  const { user: clerkUser } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [databaseUser, setDatabaseUser] = useState(null);
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

  // Fetch database user based on Clerk user ID
  useEffect(() => {
    const getDatabaseUser = async () => {
      if (!isAuthLoaded || !clerkUserId) return;

      try {
        // Try to find the user in the database
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_user_id", clerkUserId)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          toast.error("Unable to verify your account");
          return;
        }

        if (data) {
          setDatabaseUser(data);

          // Update the last_visit timestamp
          await supabase
            .from("users")
            .update({
              last_visit: new Date().toISOString(),
              is_new_user: false,
            })
            .eq("id", data.id);
        } else {
          // This shouldn't happen if webhook is working properly,
          // but handle it anyway with an informative error
          console.error("User found in Clerk but not in database");
          toast.error("Account synchronization issue. Please contact support.");
        }
      } catch (error) {
        console.error("Error in getDatabaseUser:", error);
        toast.error("Error retrieving user information");
      }
    };

    getDatabaseUser();
  }, [clerkUserId, isAuthLoaded]);

  // Fetch inventory data when database user is available
  useEffect(() => {
    if (!databaseUser) return; // Don't fetch if no database user is loaded

    const fetchInventoryData = async () => {
      setIsLoading(true);
      try {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // Build query with user_id filter
        let query = supabase
          .from("inventory")
          .select("*", { count: "exact" })
          .eq("user_id", databaseUser.id); // Filter items by the database user's ID

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
        toast.error("Failed to load inventory data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, [searchTerm, filterCategory, filterStatus, currentPage, databaseUser]);

  // Fetch inventory statistics
  const fetchInventoryStats = async () => {
    if (!databaseUser) return;

    try {
      // Get total items for this user
      const { count: totalItems } = await supabase
        .from("inventory")
        .select("*", { count: "exact", head: true })
        .eq("user_id", databaseUser.id);

      // Get low stock items for this user
      const { count: lowStockItems } = await supabase
        .from("inventory")
        .select("*", { count: "exact", head: true })
        .eq("user_id", databaseUser.id)
        .eq("status", "Low Stock");

      // Get out of stock items for this user
      const { count: outOfStockItems } = await supabase
        .from("inventory")
        .select("*", { count: "exact", head: true })
        .eq("user_id", databaseUser.id)
        .eq("status", "Out of Stock");

      // Get total value for this user's inventory
      const { data: valueData } = await supabase
        .from("inventory")
        .select("quantity, price")
        .eq("user_id", databaseUser.id);

      const totalValue =
        valueData?.reduce((acc, item) => acc + item.quantity * item.price, 0) ||
        0;

      // Get unique categories for this user
      const { data: categories } = await supabase
        .from("inventory")
        .select("category")
        .eq("user_id", databaseUser.id)
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
      toast.error("Failed to load inventory statistics");
    }
  };

  // Handler for adding a new item
  const handleAddItem = () => {
    if (!databaseUser) {
      toast.error(
        "Unable to add items - please wait while we verify your account"
      );
      return;
    }

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
      user_id: databaseUser.id, // Add the user_id to the new item
    });
    setIsModalOpen(true);
  };

  // Handler for editing an item
  const handleEditItem = (item) => {
    if (!databaseUser) {
      toast.error(
        "Unable to edit items - please wait while we verify your account"
      );
      return;
    }

    // Verify the item belongs to the current user
    if (item.user_id !== databaseUser.id) {
      toast.error("You don't have permission to edit this item");
      return;
    }

    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Handler for reordering an item
  const handleReorder = async (item) => {
    if (!databaseUser) {
      toast.error(
        "Unable to reorder items - please wait while we verify your account"
      );
      return;
    }

    // Verify the item belongs to the current user
    if (item.user_id !== databaseUser.id) {
      toast.error("You don't have permission to reorder this item");
      return;
    }

    try {
      toast.promise(
        supabase
          .from("inventory")
          .update({
            last_ordered: new Date().toISOString().split("T")[0],
          })
          .eq("id", item.id)
          .eq("user_id", databaseUser.id) // Add user_id check for security
          .then(async ({ error }) => {
            if (error) throw error;

            // Refresh inventory data
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;
            const { data } = await supabase
              .from("inventory")
              .select("*")
              .eq("user_id", databaseUser.id)
              .range(from, to)
              .order("name", { ascending: true });

            setInventoryData(data || []);
          }),
        {
          loading: `Placing reorder for ${item.name}...`,
          success: `Reorder placed for ${item.name}`,
          error: "Failed to place reorder. Please try again.",
        }
      );
    } catch (error) {
      console.error("Error reordering item:", error);
    }
  };

  // Handler for saving an item
  const handleSaveItem = async () => {
    if (!editingItem) return;
    if (!databaseUser) {
      toast.error(
        "Unable to save items - please wait while we verify your account"
      );
      return;
    }

    try {
      setIsLoading(true);
      const isNewItem = !editingItem.id;
      const itemName = editingItem.name;

      // Make sure we always include the user_id
      const itemData = {
        name: editingItem.name,
        category: editingItem.category,
        sku: editingItem.sku,
        quantity: editingItem.quantity,
        reorder_point: editingItem.reorder_point,
        price: editingItem.price,
        supplier: editingItem.supplier,
        last_ordered: editingItem.last_ordered,
        location: editingItem.location,
        user_id: databaseUser.id, // Ensure user_id is set
      };

      if (isNewItem) {
        // Create new item
        toast.promise(
          supabase
            .from("inventory")
            .insert(itemData)
            .then(({ error }) => {
              if (error) throw error;
            }),
          {
            loading: `Adding ${itemName}...`,
            success: `${itemName} added successfully`,
            error: "Failed to add item. Please try again.",
          }
        );
      } else {
        // Update existing item - ensure it belongs to the current user
        toast.promise(
          supabase
            .from("inventory")
            .update(itemData)
            .eq("id", editingItem.id)
            .eq("user_id", databaseUser.id) // Add user_id check for security
            .then(({ error }) => {
              if (error) throw error;
            }),
          {
            loading: `Updating ${itemName}...`,
            success: `${itemName} updated successfully`,
            error: "Failed to update item. Please try again.",
          }
        );
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
        .eq("user_id", databaseUser.id)
        .range(from, to)
        .order("name", { ascending: true });

      setInventoryData(data || []);
      fetchInventoryStats();
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting an item
  const handleDeleteItem = async (item) => {
    if (!databaseUser) {
      toast.error(
        "Unable to delete items - please wait while we verify your account"
      );
      return;
    }

    // Verify the item belongs to the current user
    if (item.user_id !== databaseUser.id) {
      toast.error("You don't have permission to delete this item");
      return;
    }

    // Create a custom toast for confirmation
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Delete {item.name}?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);

                // Execute deletion after confirmation
                toast.promise(
                  supabase
                    .from("inventory")
                    .delete()
                    .eq("id", item.id)
                    .eq("user_id", databaseUser.id) // Add user_id check for security
                    .then(async ({ error }) => {
                      if (error) throw error;

                      // Refresh inventory data
                      const from = (currentPage - 1) * itemsPerPage;
                      const to = from + itemsPerPage - 1;
                      const { data, count } = await supabase
                        .from("inventory")
                        .select("*", { count: "exact" })
                        .eq("user_id", databaseUser.id)
                        .range(from, to)
                        .order("name", { ascending: true });

                      setInventoryData(data || []);
                      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
                      fetchInventoryStats();
                    }),
                  {
                    loading: `Deleting ${item.name}...`,
                    success: `${item.name} has been deleted`,
                    error: "Failed to delete item. Please try again.",
                  }
                );
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  // Loading state when waiting for authentication
  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  // Not authenticated state
  if (!clerkUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please sign in to access your inventory
          </p>
          <a
            href="/sign-in"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #34D399",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#FEF2F2",
              color: "#B91C1C",
              border: "1px solid #F87171",
            },
          },
        }}
      />

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
        {/* User Welcome Message */}
        {databaseUser && clerkUser && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700">
              Welcome, {clerkUser.firstName || databaseUser.email || "User"}
            </h2>
            <p className="text-sm text-gray-500">
              Managing your personal inventory
            </p>
          </div>
        )}

        {!databaseUser ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            <span className="ml-2 text-gray-600">
              Loading your account information...
            </span>
          </div>
        ) : (
          <>
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
          </>
        )}
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
