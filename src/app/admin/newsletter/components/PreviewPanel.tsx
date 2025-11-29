"use client";
import { useState } from "react";

type PreviewPanelProps = {
  htmlContent: string;
  title?: string;
};

export default function PreviewPanel({ htmlContent, title = "Preview" }: PreviewPanelProps) {
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");

  const containerStyle = {
    mobile: { width: "320px" },
    tablet: { width: "768px" },
    desktop: { width: "100%" },
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex gap-2 bg-gray-100 p-1 rounded">
          <button
            onClick={() => setDeviceType("mobile")}
            className={`px-3 py-1 rounded text-sm font-semibold ${
              deviceType === "mobile"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="Mobile View"
          >
            📱
          </button>
          <button
            onClick={() => setDeviceType("tablet")}
            className={`px-3 py-1 rounded text-sm font-semibold ${
              deviceType === "tablet"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="Tablet View"
          >
            📱
          </button>
          <button
            onClick={() => setDeviceType("desktop")}
            className={`px-3 py-1 rounded text-sm font-semibold ${
              deviceType === "desktop"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="Desktop View"
          >
            🖥
          </button>
        </div>
      </div>

      <div className="flex justify-center bg-gray-100 p-4 rounded-lg min-h-96 overflow-auto">
        <div
          style={containerStyle[deviceType]}
          className="bg-white border-4 border-gray-300 shadow-lg overflow-auto max-h-96"
        >
          <div className="p-4">
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="prose prose-sm max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600 border">
        <p className="font-semibold mb-2">Preview Information:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>This preview shows how your email will appear to subscribers</li>
          <li>Switch between device types to see responsive layout</li>
          <li>Test links and interactive elements before sending</li>
        </ul>
      </div>
    </div>
  );
}
