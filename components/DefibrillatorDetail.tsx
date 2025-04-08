"use client";

import React from "react";

interface DefibrillatorDetailProps {
  device: {
    number: number,
    name: string,
    price: string,
    type: string,
    features: string[],
    manufacturer?: string,
    brand?: string,
    energy?: string,
    chargeTime?: string,
    weight?: string,
    warranty?: string,
  };
  onBackClick: () => void;
}

const DefibrillatorDetail = ({
  device,
  onBackClick,
}: DefibrillatorDetailProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <button
            onClick={onBackClick}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-center mb-2 mt-1">
            {device.name}
          </h2>
          <p className="text-xl font-medium text-center text-white/90">
            {device.price}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Type and manufacturer */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {device.type && (
            <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-1.5 text-sm font-semibold">
              {device.type}
            </span>
          )}
          {device.manufacturer && (
            <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-4 py-1.5 text-sm font-semibold">
              {device.manufacturer}
            </span>
          )}
          {device.brand && !device.name.includes(device.brand) && (
            <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-4 py-1.5 text-sm font-semibold">
              {device.brand}
            </span>
          )}
        </div>

        {/* Specifications */}
        <div className="bg-gray-50 rounded-lg p-5 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            {device.energy && (
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Energy Output
                  </h4>
                  <p className="text-gray-800">{device.energy}</p>
                </div>
              </div>
            )}
            {device.chargeTime && (
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Charge Time
                  </h4>
                  <p className="text-gray-800">{device.chargeTime}</p>
                </div>
              </div>
            )}
            {device.weight && (
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="M6 16.5l6 4 6-4" />
                    <path d="M6 12.5l6 4 6-4" />
                    <path d="M6 8.5l6 4 6-4" />
                    <path d="M6 4.5l6 4 6-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Weight</h4>
                  <p className="text-gray-800">{device.weight}</p>
                </div>
              </div>
            )}
            {device.warranty && (
              <div className="flex items-start">
                <div className="bg-yellow-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Warranty
                  </h4>
                  <p className="text-gray-800">
                    {device.warranty || "Available"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Key Features
          </h3>
          <ul className="space-y-3">
            {device.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-blue-50 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

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

export default DefibrillatorDetail;
