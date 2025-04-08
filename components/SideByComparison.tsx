"use client";

import React from "react";

interface SideByComparisonProps {
  devices: {
    number: number;
    name: string;
    price: string;
    type: string;
    features: string[];
    manufacturer?: string;
    brand?: string;
    energy?: string;
    chargeTime?: string;
    weight?: string;
    warranty?: string;
  }[];
  onBackClick: () => void;
  disclaimer?: string;
}

const SideByComparison = ({ devices, onBackClick, disclaimer }: SideByComparisonProps) => {
  // Get all possible specification fields across all devices
  const allSpecFields = devices.reduce((fields, device) => {
    if (device.energy && !fields.includes("energy")) fields.push("energy");
    if (device.chargeTime && !fields.includes("chargeTime")) fields.push("chargeTime");
    if (device.weight && !fields.includes("weight")) fields.push("weight");
    if (device.warranty && !fields.includes("warranty")) fields.push("warranty");
    if (device.type && !fields.includes("type")) fields.push("type");
    if (device.manufacturer && !fields.includes("manufacturer")) fields.push("manufacturer");
    if (device.brand && !fields.includes("brand")) fields.push("brand");
    return fields;
  }, [] as string[]);

  // Get all unique features across all devices
  const allFeatures = Array.from(
    new Set(
      devices.flatMap(device => device.features)
    )
  );

  // Helper function to render field value with an icon
  const renderFieldValue = (fieldName: string, value?: string) => {
    if (!value) return <span className="text-gray-400">—</span>;
    
    // Return checkmark for feature presence
    if (fieldName === "feature") {
      return <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>;
    }
    
    return <span>{value}</span>;
  };

  // Field display names
  const fieldLabels: {[key: string]: string} = {
    energy: "Energy Output",
    chargeTime: "Charge Time",
    weight: "Weight",
    warranty: "Warranty",
    type: "Type",
    manufacturer: "Manufacturer",
    brand: "Brand"
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <button 
            onClick={onBackClick}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-center mt-1">Side-by-Side Comparison</h2>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 shadow-sm z-10">
                Specifications
              </th>
              {devices.map((device, index) => (
                <th key={index} className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {device.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Price row */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 sticky left-0 bg-blue-50 shadow-sm z-10">
                Price
              </td>
              {devices.map((device, index) => (
                <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600">
                  {device.price}
                </td>
              ))}
            </tr>

            {/* Specification rows */}
            {allSpecFields.map((field, index) => (
              <tr key={field} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 sticky left-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} shadow-sm z-10`}>
                  {fieldLabels[field] || field}
                </td>
                {devices.map((device, deviceIndex) => (
                  <td key={deviceIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {renderFieldValue(field, (device as any)[field])}
                  </td>
                ))}
              </tr>
            ))}

            {/* Features header */}
            <tr className="bg-blue-50">
              <td colSpan={devices.length + 1} className="px-6 py-4 text-sm font-bold text-gray-700">
                Features
              </td>
            </tr>

            {/* Feature rows */}
            {allFeatures.map((feature, index) => (
              <tr key={`feature-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className={`px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} shadow-sm z-10`}>
                  {feature}
                </td>
                {devices.map((device, deviceIndex) => (
                  <td key={deviceIndex} className="px-6 py-4 text-sm text-center">
                    {device.features.includes(feature) ? (
                      <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Disclaimer */}
        {disclaimer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-medium">Note:</span> {disclaimer}
            </p>
          </div>
        )}

        {/* Back button */}
        <div className="mt-6 text-center">
          <button 
            onClick={onBackClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-sm"
          >
            Back to Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideByComparison;