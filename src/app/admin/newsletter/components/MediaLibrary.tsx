"use client";
import { useState } from "react";

type MediaItem = {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
  size: number;
};

type MediaLibraryProps = {
  onImageSelect: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
};

export default function MediaLibrary({ onImageSelect, onUpload }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed");
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB");
          continue;
        }

        if (onUpload) {
          const url = await onUpload(file);
          const newItem: MediaItem = {
            id: Math.random().toString(36).substr(2, 9),
            url,
            name: file.name,
            uploadedAt: new Date().toISOString(),
            size: file.size,
          };
          setMedia((prev) => [newItem, ...prev]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = (id: string) => {
    setMedia((prev) => prev.filter((item) => item.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Media Library</h3>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          {showUpload ? "Close" : "+ Upload"}
        </button>
      </div>

      {showUpload && (
        <div className="mb-4 p-3 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
          <div className="flex flex-col items-center justify-center py-4">
            <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <label className="cursor-pointer">
              <span className="text-blue-600 font-semibold">Click to upload</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB each</p>
          </div>
          {uploading && <p className="text-center text-sm text-blue-600">Uploading...</p>}
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
        </div>
      )}

      {media.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded text-center text-gray-500">
          <p>No media uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {media.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <img src={item.url} alt={item.name} className="w-full h-24 object-cover" />
              <div className="p-2 bg-gray-50">
                <p className="text-xs font-semibold truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => onImageSelect(item.url)}
                    className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="flex-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
