"use client";

import React, { useState } from "react";
import { Settings} from "lucide-react";
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

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload inventory file");
      }

      // Update the user's tier to Tier 2
      const tierUpdated = await updateToTier2();

      if (tierUpdated) {
        setUploadSuccess(
          "Inventory data uploaded successfully. Your account has been upgraded to Pro tier!"
        );

        // Refresh the page after a short delay to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Failed to update account tier");
      }
    } catch (error) {
      console.error("Error during inventory upload:", error);
      setUploadError("Failed to process inventory data. Please try again.");
    } finally {
      setUploadingInventory(false);
      // Clear the file input
      e.target.value = "";
    }
  };

  const handleHistoricalUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload historical data file");
      }

      // Update the user's tier to Tier 3
      const tierUpdated = await updateToTier3();

      if (tierUpdated) {
        setUploadSuccess(
          "Historical data uploaded successfully. Your account has been upgraded to Enterprise tier!"
        );

        // Refresh the page after a short delay to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Failed to update account tier");
      }
    } catch (error) {
      console.error("Error during historical data upload:", error);
      setUploadError("Failed to process historical data. Please try again.");
    } finally {
      setUploadingHistorical(false);
      // Clear the file input
      e.target.value = "";
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
        <FileUploader
          id="inventory-upload"
          label="Upload Inventory Data"
          onUpload={handleInventoryUpload}
          isUploading={uploadingInventory}
          color="blue"
        />
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
        <div className="space-y-2">
          <FileUploader
            id="historical-data-upload"
            label="Upload Historical Data"
            onUpload={handleHistoricalUpload}
            isUploading={uploadingHistorical}
            color="blue"
          />
          <button
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 px-3 rounded cursor-pointer transition-colors"
            onClick={handleIntegrationSetup}
          >
            <Settings size={16} /> Set Up Real-time Integration
          </button>
        </div>
        <UploadStatus success={uploadSuccess} error={uploadError} />
      </div>
    );
  }

  return null;
};
