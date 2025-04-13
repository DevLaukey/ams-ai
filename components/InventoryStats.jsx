import React from "react";

const InventoryStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Items</h3>
        <div className="text-2xl font-bold text-gray-900">
          {stats.totalItems.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Across {stats.categoryCount} categories
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Low Stock</h3>
        <div className="text-2xl font-bold text-yellow-500">
          {stats.lowStockItems}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Items below reorder point
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Out of Stock</h3>
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
        <div className="text-sm text-gray-500 mt-1">Total current value</div>
      </div>
    </div>
  );
};

export default InventoryStats;
