import React from "react";
import { useDraggable } from "@dnd-kit/core";

export function BlockPalette({ onAdd }: { onAdd: (type: string) => void }) {
  const blocks = [
    { type: "text", label: "Text Block" },
    { type: "image", label: "Image Block" },
    { type: "button", label: "Button Block" },
    { type: "divider", label: "Divider Block" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block) => (
        <DraggableBlock key={block.type} type={block.type} label={block.label} />
      ))}
    </div>
  );
}

function DraggableBlock({ type, label }: { type: string; label: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: type });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2 border rounded bg-white shadow-sm cursor-move ${isDragging ? "opacity-50" : ""}`}
      style={{ marginBottom: 8 }}
    >
      {label}
    </div>
  );
}
