import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface UploadStatusProps {
  success: string | null;
  error: string | null;
}

export const UploadStatus: React.FC<UploadStatusProps> = ({
  success,
  error,
}) => {
  if (!success && !error) return null;

  return (
    <>
      {success && (
        <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
          <CheckCircle size={14} /> {success}
        </div>
      )}
      {error && (
        <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </>
  );
};
