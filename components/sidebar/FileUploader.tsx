import React from "react";
import { FileText } from "lucide-react";

interface FileUploaderProps {
  id: string;
  label: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
  color: "blue" | "purple";
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  label,
  onUpload,
  isUploading,
  color,
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-center justify-center gap-2 bg-${color}-500 hover:bg-${color}-600 ${
        color == "purple" ? "text-black" : " text-white"
      } text-sm py-2 px-3 rounded cursor-pointer transition-colors`}
    >
      {isUploading ? (
        <span>Uploading...</span>
      ) : (
        <>
          <FileText size={16} /> {label}
        </>
      )}
      <input
        id={id}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={onUpload}
      />
    </label>
  );
};
