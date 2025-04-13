import React from "react";

const InventoryItemModal = ({
  isModalOpen,
  setIsModalOpen,
  editingItem,
  setEditingItem,
  handleSaveItem,
}) => {
  if (!isModalOpen || !editingItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingItem.id ? "Edit Inventory Item" : "Add Inventory Item"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={editingItem.category}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  category: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              value={editingItem.sku}
              onChange={(e) =>
                setEditingItem({ ...editingItem, sku: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={editingItem.quantity}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reorder Point
            </label>
            <input
              type="number"
              value={editingItem.reorder_point}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  reorder_point: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              value={editingItem.price}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier
            </label>
            <input
              type="text"
              value={editingItem.supplier}
              onChange={(e) =>
                setEditingItem({ ...editingItem, supplier: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Ordered
            </label>
            <input
              type="date"
              value={editingItem.last_ordered}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  last_ordered: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={editingItem.location}
              onChange={(e) =>
                setEditingItem({ ...editingItem, location: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Warehouse A, Shelf 3"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveItem}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            disabled={!editingItem.name || !editingItem.sku}
          >
            {editingItem.id ? "Update Item" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemModal;
