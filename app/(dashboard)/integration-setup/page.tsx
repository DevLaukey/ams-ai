"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  RefreshCw,
  Server,
  ChevronDown,
  Check,
} from "lucide-react";

const IntegrationSetupPage = () => {
  const router = useRouter();
  const [selectedIntegrationType, setSelectedIntegrationType] = useState("api");
  const [currentStep, setCurrentStep] = useState(1);
  const [integrationSystem, setIntegrationSystem] = useState("");
  const [isSystemDropdownOpen, setIsSystemDropdownOpen] = useState(false);

  const systemOptions = [
    { label: "Epic Systems", value: "epic" },
    { label: "Cerner", value: "cerner" },
    { label: "MEDITECH", value: "meditech" },
    { label: "Allscripts", value: "allscripts" },
    { label: "Oracle Health", value: "oracle" },
    { label: "SAP Healthcare", value: "sap" },
    { label: "McKesson", value: "mckesson" },
    { label: "Other", value: "other" },
  ];

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="container max-w-5xl py-10 ml-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Integration Setup
        </h1>
        <p className="text-gray-500">
          Connect your hospital supply management system to unlock Tier 3
          features including AI Agent, Predictive Analytics, and Supply
          Exchange.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            1
          </div>
          <div
            className={`h-1 flex-1 mx-2 ${
              currentStep >= 2 ? "bg-purple-200" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            2
          </div>
          <div
            className={`h-1 flex-1 mx-2 ${
              currentStep >= 3 ? "bg-purple-200" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 3
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            3
          </div>
          <div
            className={`h-1 flex-1 mx-2 ${
              currentStep >= 4 ? "bg-purple-200" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 4
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            4
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="w-20 text-center">Select System</div>
          <div className="w-20 text-center">Connection Type</div>
          <div className="w-20 text-center">Configure</div>
          <div className="w-20 text-center">Verify</div>
        </div>
      </div>

      {/* Step 1: Select System */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Select Your Inventory Management System
            </h2>
            <p className="text-gray-500 mt-1">
              Choose the system you currently use to manage your hospital
              inventory
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
                <div className="relative">
                  <button
                    type="button"
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    onClick={() =>
                      setIsSystemDropdownOpen(!isSystemDropdownOpen)
                    }
                  >
                    <span className="block truncate">
                      {integrationSystem
                        ? systemOptions.find(
                            (option) => option.value === integrationSystem
                          )?.label
                        : "Select your inventory system"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  {isSystemDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {systemOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-purple-50 ${
                            integrationSystem === option.value
                              ? "bg-purple-100 text-purple-900"
                              : "text-gray-900"
                          }`}
                          onClick={() => {
                            setIntegrationSystem(option.value);
                            setIsSystemDropdownOpen(false);
                          }}
                        >
                          <span
                            className={`block truncate ${
                              integrationSystem === option.value
                                ? "font-medium"
                                : "font-normal"
                            }`}
                          >
                            {option.label}
                          </span>
                          {integrationSystem === option.value && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-purple-600">
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-lg">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNextStep}
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
      )}

      {/* Step 2: Integration Type */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose Integration Type
            </h2>
            <p className="text-gray-500 mt-1">
              Select how you want to integrate your system with our platform
            </p>
          </div>
          <div className="p-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: "api", name: "API Integration" },
                  { id: "sftp", name: "SFTP Transfer" },
                  { id: "connector", name: "System Connector" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedIntegrationType(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      selectedIntegrationType === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6">
              {selectedIntegrationType === "api" && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-purple-50 text-purple-800">
                    <div className="flex items-start">
                      <Server className="h-5 w-5 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">API Integration</h3>
                        <p className="text-sm mt-1">
                          Direct real-time connection between our platform and
                          your inventory system through secure API endpoints.
                          Best for systems with available APIs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      Real-time data synchronization
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      Automated updates and alerts
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      Secure, encrypted communication
                    </span>
                  </div>
                </div>
              )}

              {selectedIntegrationType === "sftp" && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-blue-50 text-blue-800">
                    <div className="flex items-start">
                      <RefreshCw className="h-5 w-5 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">SFTP Transfer</h3>
                        <p className="text-sm mt-1">
                          Schedule secure file transfers of inventory data at
                          regular intervals. Best for systems that can export
                          data files automatically.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Scheduled data updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      No direct system access required
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      Minimal IT setup requirements
                    </span>
                  </div>
                </div>
              )}

              {selectedIntegrationType === "connector" && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-amber-50 text-amber-800">
                    <div className="flex items-start">
                      <Database className="h-5 w-5 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">System Connector</h3>
                        <p className="text-sm mt-1">
                          Install our lightweight connector on your network to
                          bridge your inventory system. Best for legacy systems
                          without modern API capabilities.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Works with legacy systems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      No modifications to existing system
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      IT team assistance required for setup
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-lg">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Steps 3-4 are in part 2 */}
      {currentStep > 2 && (
        <div className="text-center py-10">
          <p>Loading next steps...</p>
        </div>
      )}
      </div>
      
      
  );
};

export default IntegrationSetupPage;
