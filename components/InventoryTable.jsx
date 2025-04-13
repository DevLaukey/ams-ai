import React from "react";
import { Filter, ArrowUpDown, AlertCircle, Loader2 } from "lucide-react";

// Table Pagination subcomponent
const TablePagination = ({ currentPage, totalPages, onPageChange }) => (
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

const InventoryTable = ({
  inventoryData,
  isLoading,
  currentPage,
  totalPages,
  setCurrentPage,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  handleEditItem,
  handleReorder,
  handleDeleteItem,
}) => {
  const getStatusColor = (status) => {
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
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
                setCurrentPage(1);
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
        </div>
      </div>

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
                  <td colSpan={8} className="text-center py-6 text-gray-500">
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
                    <td className="py-3 px-4 text-gray-600">{item.sku}</td>
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
                        <div className="text-gray-900">{item.quantity}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {item.reorder_point}
                    </td>
                    <td className="py-3 px-4 text-gray-900">${item.price}</td>
                    <td className="py-3 px-4 text-gray-600">{item.supplier}</td>
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
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditItem(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleReorder(item)}
                        >
                          Reorder
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteItem(item)}
                        >
                          Delete
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
  );
};

export default InventoryTable;
