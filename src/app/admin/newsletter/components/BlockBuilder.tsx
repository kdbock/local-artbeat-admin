"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import BlockItem from "./BlockItem";

export type ContentBlock = {
  id: string;
  type: "text" | "image" | "button" | "divider" | "heading" | "spacer";
  content: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    alignment?: string;
  };
};

type BlockBuilderProps = {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
  globalStyles?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    fontSize?: string;
  };
};

export default function BlockBuilder({ blocks, onBlocksChange, globalStyles }: BlockBuilderProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
      }
    }
  };

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: uuidv4(),
      type,
      content: type === "divider" ? "" : `New ${type}`,
      style: {
        padding: "16px",
        margin: "8px 0",
      },
    };
    onBlocksChange([...blocks, newBlock]);
  };

  const deleteBlock = (id: string) => {
    onBlocksChange(blocks.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onBlocksChange(
      blocks.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    setEditingBlockId(null);
  };

  const getBlockPreview = (block: ContentBlock) => {
    const baseStyle = {
      padding: block.style?.padding || "16px",
      margin: block.style?.margin || "8px 0",
      backgroundColor: block.style?.backgroundColor || "transparent",
      color: block.style?.textColor || "#000",
      fontSize: block.style?.fontSize || "16px",
      textAlign: block.style?.alignment as "left" | "center" | "right" | undefined || "left",
      fontFamily: globalStyles?.fontFamily || "Arial, sans-serif",
    };

    switch (block.type) {
      case "heading":
        return <h2 style={baseStyle}>{block.content}</h2>;
      case "text":
        return <p style={baseStyle}>{block.content}</p>;
      case "image":
        return (
          <div style={baseStyle}>
            <img src={block.content} alt="Block" className="max-w-full h-auto" />
          </div>
        );
      case "button":
        return (
          <div style={baseStyle}>
            <button
              style={{
                backgroundColor: globalStyles?.primaryColor || "#3b82f6",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {block.content}
            </button>
          </div>
        );
      case "divider":
        return <hr style={{ margin: "16px 0" }} />;
      case "spacer":
        return <div style={{ height: block.content ? parseInt(block.content) : 32 }} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-64 bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-bold mb-4">Add Blocks</h3>
        <div className="space-y-2">
          <button
            onClick={() => addBlock("heading")}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Heading
          </button>
          <button
            onClick={() => addBlock("text")}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Text
          </button>
          <button
            onClick={() => addBlock("image")}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Image
          </button>
          <button
            onClick={() => addBlock("button")}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Button
          </button>
          <button
            onClick={() => addBlock("divider")}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Divider
          </button>
          <button
            onClick={() => addBlock("spacer")}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Spacer
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold mb-4">Content Blocks (Drag to Reorder)</h3>
        {blocks.length === 0 ? (
          <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-500">
            No blocks yet. Add one from the left panel.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {blocks.map((block) => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    isEditing={editingBlockId === block.id}
                    onEdit={() => setEditingBlockId(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                    onUpdate={(updates) => updateBlock(block.id, updates)}
                    preview={getBlockPreview(block)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
