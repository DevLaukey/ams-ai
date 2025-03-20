import React from "react";

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
}) => {
  return (
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
  );
};

export default ProgressIndicator;
