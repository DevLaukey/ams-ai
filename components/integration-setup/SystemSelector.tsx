import React from "react";
import { ArrowRight } from "lucide-react";
// import Dropdown, { DropdownOption } from "../ui/Dropdown";

interface SystemSelectorProps {
  integrationSystem: string;
  setIntegrationSystem: (value: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

const SystemSelector: React.FC<SystemSelectorProps> = ({
  integrationSystem,
  onCancel,
  onNext,
}) => {
  // const systemOptions: DropdownOption[] = [
  //   { label: "Epic Systems", value: "epic" },
  //   { label: "Cerner", value: "cerner" },
  //   { label: "MEDITECH", value: "meditech" },
  //   { label: "Allscripts", value: "allscripts" },
  //   { label: "Oracle Health", value: "oracle" },
  //   { label: "SAP Healthcare", value: "sap" },
  //   { label: "McKesson", value: "mckesson" },
  //   { label: "Other", value: "other" },
  // ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Select Your Inventory Management System
        </h2>
        <p className="text-gray-500 mt-1">
          Choose the system you currently use to manage your hospital inventory
        </p>
      </div>
      <div className="p-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <label
              htmlFor="system"
              className="text-sm font-medium text-gray-700"
            >
              System
            </label>
            {/* <Dropdown
              options={systemOptions}
              value={integrationSystem}
              onChange={setIntegrationSystem}
              placeholder="Select your inventory system"
            /> */}
          </div>

          {integrationSystem === "other" && (
            <div className="grid gap-2">
              <label
                htmlFor="other-system"
                className="text-sm font-medium text-gray-700"
              >
                System Name
              </label>
              <input
                type="text"
                id="other-system"
                placeholder="Enter your system name"
                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-lg">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!integrationSystem}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !integrationSystem
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          }`}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SystemSelector;
