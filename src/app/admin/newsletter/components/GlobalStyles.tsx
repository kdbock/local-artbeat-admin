"use client";
import { useState } from "react";

export type GlobalStylesConfig = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
};

type GlobalStylesProps = {
  styles: GlobalStylesConfig;
  onStylesChange: (styles: GlobalStylesConfig) => void;
};

export default function GlobalStyles({ styles, onStylesChange }: GlobalStylesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof GlobalStylesConfig, value: string) => {
    onStylesChange({
      ...styles,
      [key]: value,
    });
  };

  const presets = {
    modern: {
      primaryColor: "#3b82f6",
      secondaryColor: "#10b981",
      accentColor: "#f59e0b",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      fontSize: "16px",
      lineHeight: "1.6",
      borderRadius: "8px",
      padding: "16px",
      margin: "8px",
    },
    minimal: {
      primaryColor: "#000000",
      secondaryColor: "#666666",
      accentColor: "#cccccc",
      backgroundColor: "#ffffff",
      textColor: "#333333",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      lineHeight: "1.5",
      borderRadius: "0px",
      padding: "12px",
      margin: "4px",
    },
    vibrant: {
      primaryColor: "#ff006e",
      secondaryColor: "#8338ec",
      accentColor: "#ffbe0b",
      backgroundColor: "#ffffff",
      textColor: "#2a2a2a",
      fontFamily: '"Trebuchet MS", sans-serif',
      fontSize: "16px",
      lineHeight: "1.7",
      borderRadius: "12px",
      padding: "20px",
      margin: "12px",
    },
  };

  const applyPreset = (preset: GlobalStylesConfig) => {
    onStylesChange(preset);
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between font-bold text-lg mb-4 hover:text-blue-600"
      >
        <span>Global Styles</span>
        <span>{isExpanded ? "▼" : "▶"}</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-sm">Quick Presets</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(presets).map(([name, preset]) => (
                <button
                  key={name}
                  onClick={() => applyPreset(preset)}
                  className="p-2 border rounded hover:bg-gray-100 text-xs font-semibold capitalize"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 text-sm">Colors</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={styles.primaryColor || "#3b82f6"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.primaryColor || "#3b82f6"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={styles.secondaryColor || "#10b981"}
                    onChange={(e) => handleChange("secondaryColor", e.target.value)}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.secondaryColor || "#10b981"}
                    onChange={(e) => handleChange("secondaryColor", e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Accent Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={styles.accentColor || "#f59e0b"}
                    onChange={(e) => handleChange("accentColor", e.target.value)}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.accentColor || "#f59e0b"}
                    onChange={(e) => handleChange("accentColor", e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={styles.textColor || "#1f2937"}
                    onChange={(e) => handleChange("textColor", e.target.value)}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.textColor || "#1f2937"}
                    onChange={(e) => handleChange("textColor", e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 text-sm">Typography</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold block mb-1">Font Family</label>
                <select
                  value={styles.fontFamily || "Arial, sans-serif"}
                  onChange={(e) => handleChange("fontFamily", e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value='"Trebuchet MS", sans-serif'>Trebuchet MS</option>
                  <option value='"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'>Segoe UI</option>
                  <option value='"Georgia", serif'>Georgia</option>
                  <option value='"Times New Roman", serif'>Times New Roman</option>
                  <option value="Courier New, monospace">Courier New</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Font Size</label>
                <input
                  type="text"
                  value={styles.fontSize || "16px"}
                  onChange={(e) => handleChange("fontSize", e.target.value)}
                  placeholder="e.g., 16px"
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Line Height</label>
                <input
                  type="text"
                  value={styles.lineHeight || "1.6"}
                  onChange={(e) => handleChange("lineHeight", e.target.value)}
                  placeholder="e.g., 1.6"
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 text-sm">Spacing & Border</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold block mb-1">Padding</label>
                <input
                  type="text"
                  value={styles.padding || "16px"}
                  onChange={(e) => handleChange("padding", e.target.value)}
                  placeholder="e.g., 16px"
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Margin</label>
                <input
                  type="text"
                  value={styles.margin || "8px"}
                  onChange={(e) => handleChange("margin", e.target.value)}
                  placeholder="e.g., 8px"
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Border Radius</label>
                <input
                  type="text"
                  value={styles.borderRadius || "8px"}
                  onChange={(e) => handleChange("borderRadius", e.target.value)}
                  placeholder="e.g., 8px"
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 bg-gray-50 p-3 rounded">
            <h4 className="font-semibold mb-2 text-sm">Preview</h4>
            <div
              style={{
                backgroundColor: styles.backgroundColor || "#ffffff",
                color: styles.textColor || "#1f2937",
                fontFamily: styles.fontFamily || "Arial, sans-serif",
                fontSize: styles.fontSize || "16px",
                lineHeight: styles.lineHeight || "1.6",
                padding: styles.padding || "16px",
                borderRadius: styles.borderRadius || "8px",
                border: "1px solid #ddd",
              }}
            >
              <p>This is how your text will look.</p>
              <button
                style={{
                  backgroundColor: styles.primaryColor || "#3b82f6",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: styles.borderRadius || "8px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
