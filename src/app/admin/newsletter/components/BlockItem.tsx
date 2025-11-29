"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentBlock } from "./BlockBuilder";
import { ReactNode } from "react";

type BlockItemProps = {
  block: ContentBlock;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  preview: ReactNode;
};

export default function BlockItem({
  block,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
  preview,
}: BlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border rounded-lg ${isDragging ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2" {...attributes} {...listeners}>
          <span className="cursor-grab active:cursor-grabbing text-gray-400">⋮⋮</span>
          <span className="text-xs font-semibold text-gray-600">{block.type.toUpperCase()}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200 text-sm">
        {preview}
      </div>

      {isEditing && (
        <div className="mt-3 p-3 border-t bg-gray-50 space-y-2">
          {block.type !== "divider" && (
            <div>
              <label className="text-xs font-semibold block mb-1">Content</label>
              {block.type === "image" ? (
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  placeholder="Image URL"
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              ) : block.type === "spacer" ? (
                <input
                  type="number"
                  value={block.content}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  placeholder="Height in pixels"
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              ) : (
                <textarea
                  value={block.content}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-xs"
                  rows={3}
                />
              )}
            </div>
          )}

          {(block.type === "text" || block.type === "heading" || block.type === "button") && (
            <>
              <div>
                <label className="text-xs font-semibold block mb-1">Text Color</label>
                <input
                  type="color"
                  value={block.style?.textColor || "#000000"}
                  onChange={(e) => onUpdate({ style: { ...block.style, textColor: e.target.value } })}
                  className="w-full h-8 border rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Background Color</label>
                <input
                  type="color"
                  value={block.style?.backgroundColor || "#ffffff"}
                  onChange={(e) => onUpdate({ style: { ...block.style, backgroundColor: e.target.value } })}
                  className="w-full h-8 border rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Font Size</label>
                <input
                  type="text"
                  value={block.style?.fontSize || "16px"}
                  onChange={(e) => onUpdate({ style: { ...block.style, fontSize: e.target.value } })}
                  placeholder="e.g., 16px"
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Alignment</label>
                <select
                  value={block.style?.alignment || "left"}
                  onChange={(e) => onUpdate({ style: { ...block.style, alignment: e.target.value } })}
                  className="w-full px-2 py-1 border rounded text-xs"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold block mb-1">Padding</label>
            <input
              type="text"
              value={block.style?.padding || "16px"}
              onChange={(e) => onUpdate({ style: { ...block.style, padding: e.target.value } })}
              placeholder="e.g., 16px"
              className="w-full px-2 py-1 border rounded text-xs"
            />
          </div>

          <button
            onClick={() => onUpdate({ style: { ...block.style } })}
            className="w-full text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Done Editing
          </button>
        </div>
      )}
    </div>
  );
}
