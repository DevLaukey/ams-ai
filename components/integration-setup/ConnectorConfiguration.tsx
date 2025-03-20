import React from "react";
import { FileWarning } from "lucide-react";

const ConnectorConfiguration: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-amber-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileWarning className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Installation Required
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Our system connector requires installation on your network.
                Please download the connector and have your IT team install it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="font-medium mb-2">Download System Connector</h3>
        <p className="text-sm text-gray-500 mb-4">
          Version 3.2.1 | Last updated: February 28, 2025
        </p>
        <div className="space-y-2">
          <button className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Download for Windows Server
          </button>
          <button className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Download for Linux
          </button>
          <button className="w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            View Installation Guide
          </button>
        </div>
      </div>

      <div className="grid gap-2 mt-4">
        <label
          htmlFor="connector-key"
          className="text-sm font-medium text-gray-700"
        >
          Connector Activation Key
        </label>
        <input
          type="text"
          id="connector-key"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
        <p className="text-xs text-gray-500">
          Your activation key will be provided after downloading the connector
        </p>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="connector-name"
          className="text-sm font-medium text-gray-700"
        >
          Connector Name (Optional)
        </label>
        <input
          type="text"
          id="connector-name"
          placeholder="Main Hospital Inventory"
          className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default ConnectorConfiguration;
