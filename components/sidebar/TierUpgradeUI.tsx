"use client";

import React, { useState } from "react";
import { Settings, AlertCircle, FileSpreadsheet } from "lucide-react";
import { UserTier } from "../../types/auth";
import { useRouter } from "next/navigation";
import { FileUploader } from "./FileUploader";
import { UploadStatus } from "./UploadStatus";

interface TierUpgradeUIProps {
  currentTier: UserTier;
  updateToTier2: () => Promise<boolean>;
  updateToTier3: () => Promise<boolean>;
}

export const TierUpgradeUI: React.FC<TierUpgradeUIProps> = ({
  currentTier,
  updateToTier2,
  updateToTier3,
}) => {
  const router = useRouter();
  const [uploadingInventory, setUploadingInventory] = useState(false);
  const [uploadingHistorical, setUploadingHistorical] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleInventoryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setUploadError("Please select an Excel file (.xlsx or .xls)");
      return;
    }

    setUploadingInventory(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file to your server
      const uploadResponse = await fetch("/api/uploads/inventory", {
        method: "POST",
        body: formData,
      });

      const responseData = await uploadResponse.json();

      // Check for error in HTTP status
      if (!uploadResponse.ok) {
        throw new Error(
          responseData.error ||
            `Upload failed with status ${uploadResponse.status}`
        );
      }

      // Check for success flag in response data
      if (responseData.success === true) {
        setUploadSuccess(
          `Successfully imported ${
            responseData.data?.import?.importedItems || 0
          } inventory items. ${
            responseData.data?.tierUpgraded
              ? "Your account has been upgraded to Pro tier!"
              : ""
          }`
        );

        // Check if we need to update the tier
        if (responseData.data?.tierUpgraded) {
          // Refresh the page after a short delay to reflect changes
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          // No tier change needed, but still refresh the inventory data
          setTimeout(() => {
            router.refresh();
          }, 1000);
        }
      } else {
        // Improved error handling for when success is false
        throw new Error(
          responseData.error ||
            responseData.message ||
            "Failed to process inventory data"
        );
      }
    } catch (error: any) {
      console.error("Error during inventory upload:", error);
      setUploadError(
        error.message || "Failed to process inventory data. Please try again."
      );
    } finally {
      setUploadingInventory(false);
      // Clear the file input
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleHistoricalUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setUploadError("Please select an Excel file (.xlsx or .xls)");
      return;
    }

    setUploadingHistorical(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file to your server
      const uploadResponse = await fetch("/api/uploads/historical", {
        method: "POST",
        body: formData,
      });

      const responseData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          responseData.error || "Failed to upload historical data file"
        );
      }

      if (responseData.success) {
        setUploadSuccess(
          `Historical data uploaded successfully. ${
            responseData.data.tierUpgraded
              ? "Your account has been upgraded to Enterprise tier!"
              : ""
          }`
        );

        // Try to update tier status on the client if needed
        if (responseData.data.tierUpgraded) {
          try {
            await updateToTier3();
          } catch (tierError) {
            console.error(
              "Tier update already handled by API, continuing:",
              tierError
            );
          }

          // Refresh the page after a short delay to reflect changes
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        throw new Error(
          responseData.error || "Failed to process historical data"
        );
      }
    } catch (error: any) {
      console.error("Error during historical data upload:", error);
      setUploadError(
        error.message || "Failed to process historical data. Please try again."
      );
    } finally {
      setUploadingHistorical(false);
      // Clear the file input
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleIntegrationSetup = () => {
    router.push("/integration-setup");
  };

  if (currentTier < UserTier.TIER_2) {
    return (
      <div className="p-3 bg-blue-50 rounded-lg m-2 border border-blue-200">
        <p className="text-xs text-blue-800 mb-2">
          Upload your current supply stock spreadsheet to unlock Inventory Data
          features.
        </p>
        <div className="mb-2">
          <a
            href="/api/templates/inventory"
            className="flex items-center text-xs text-blue-700 hover:text-blue-900 transition-colors"
            download="inventory_template.xlsx"
          >
            <FileSpreadsheet size={14} className="mr-1" />
            <span>Download template</span>
          </a>
        </div>
        <FileUploader
          id="inventory-upload"
          label="Upload Inventory Data"
          onUpload={handleInventoryUpload}
          isUploading={uploadingInventory}
          color="blue"
        />
        {!uploadSuccess && !uploadError && (
          <div className="flex items-start mt-2 text-xs text-gray-600">
            <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
            <p>
              Excel files only (.xlsx or .xls). Your data will be imported into
              your inventory.
            </p>
          </div>
        )}
        <UploadStatus success={uploadSuccess} error={uploadError} />
      </div>
    );
  }

  if (currentTier === UserTier.TIER_2) {
    return (
      <div className="p-3 bg-purple-50 rounded-lg m-2 border border-purple-200">
        <p className="text-xs text-purple-800 mb-2">
          Upload historical supply and purchase order data to unlock Full
          Integration features or set up real-time integration.
        </p>
        <div className="mb-2">
          <a
            href="/api/templates/historical"
            className="flex items-center text-xs text-purple-700 hover:text-purple-900 transition-colors"
            download="historical_data_template.xlsx"
          >
            <FileSpreadsheet size={14} className="mr-1" />
            <span>Download template</span>
          </a>
        </div>
        <div className="space-y-2">
          <FileUploader
            
            id="historical-data-upload"
            label="Upload Historical Data"
            onUpload={handleHistoricalUpload}
            isUploading={uploadingHistorical}
            color="purple"
          />
          {/* <button
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 px-3 rounded cursor-pointer transition-colors"
            onClick={handleIntegrationSetup}
          >
            <Settings size={16} /> Set Up Real-time Integration
          </button> */}
        </div>
        {!uploadSuccess && !uploadError && (
          <div className="flex items-start mt-2 text-xs text-gray-600">
            <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
            <p>
              Excel files only (.xlsx or .xls) with your historical order data.
            </p>
          </div>
        )}
        <UploadStatus success={uploadSuccess} error={uploadError} />
      </div>
    );
  }

  return null;
};
