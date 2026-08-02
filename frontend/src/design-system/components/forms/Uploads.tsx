import React, { useState, useRef } from "react";
import { FormField } from "./FormField";
import { Upload, X, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

// ─── UploadProgress ────────────────────────────────────────────────────────
export interface UploadProgressProps {
  fileName: string;
  progress: number; // 0-100
  status?: "uploading" | "completed" | "error";
  errorMessage?: string;
  onCancel?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  progress,
  status = "uploading",
  errorMessage,
  onCancel,
}) => {
  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2 truncate">
          {status === "completed" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : status === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span className="text-slate-200 truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-400 font-mono text-[11px]">{progress}%</span>
          {onCancel && status === "uploading" && (
            <button onClick={onCancel} className="text-slate-500 hover:text-white p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            status === "error"
              ? "bg-red-500"
              : status === "completed"
              ? "bg-emerald-500"
              : "bg-indigo-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {status === "error" && errorMessage && (
        <p className="text-[11px] text-red-400 font-semibold">{errorMessage}</p>
      )}
    </div>
  );
};

// ─── DragDropUpload / FileUpload ──────────────────────────────────────────
export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  error?: string;
  helpText?: string;
  isDisabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = "*",
  maxSizeMB = 10,
  multiple = false,
  onFilesSelected,
  error,
  helpText,
  isDisabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.size <= maxSizeMB * 1024 * 1024);
    setSelectedFiles(arr);
    onFilesSelected?.(arr);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isDisabled) handleFiles(e.dataTransfer.files);
  };

  return (
    <FormField label={label} error={error} helpText={helpText || `Max file size: ${maxSizeMB}MB`}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isDisabled && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
          isDragOver
            ? "border-indigo-500 bg-indigo-950/20"
            : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="p-3 bg-indigo-950/80 border border-indigo-800 rounded-2xl text-indigo-400">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-slate-200">
          <span className="text-indigo-400">Click to upload</span> or drag & drop files
        </p>
        <p className="text-[11px] text-slate-500">Supports PDF, DOCX, PNG, JPG up to {maxSizeMB}MB</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-1.5 pt-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-200 font-semibold truncate">{file.name}</span>
                <span className="text-slate-500 text-[10px] font-mono">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                }}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </FormField>
  );
};

export const DragDropUpload = FileUpload;
export const DocumentUpload = FileUpload;

// ─── AvatarUpload / ImageUpload ────────────────────────────────────────────
export interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange?: (file: File | null) => void;
  error?: string;
  helpText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  error,
  helpText,
}) => {
  const [preview, setPreview] = useState<string | undefined>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div className="flex items-center gap-4">
        <div
          onClick={() => inputRef.current?.click()}
          className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden hover:border-indigo-500 transition-all shrink-0"
        >
          {preview ? (
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-500" />
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
        />
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl transition-all"
          >
            Choose Image
          </button>
          <p className="text-[11px] text-slate-500">JPG, PNG or GIF up to 5MB</p>
        </div>
      </div>
    </FormField>
  );
};

export const AvatarUpload = ImageUpload;
