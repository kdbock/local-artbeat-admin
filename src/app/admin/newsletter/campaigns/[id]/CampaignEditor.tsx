import React, { useState, useEffect } from "react";
// For date/time picker, use native input for now (can swap for a library later)
import RichTextEditor from "@/components/RichTextEditor";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { BlockPalette } from "./BlockPalette";
import TemplateManager, { Template } from "../templates/TemplateManager";
import MediaLibrary, { MediaItem } from "../media/MediaLibrary";
import RssArticleBrowser from "../../components/RssArticleBrowser";

// Placeholder for the advanced campaign editor UI
// This will include the WYSIWYG editor, drag-and-drop blocks, template selection, and media library access

function DropZone({ blocks }: { blocks: string[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: "dropzone" });
  return (
    <div
      ref={setNodeRef}
      className={`mb-6 p-4 border-2 border-dashed rounded min-h-20 ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
    >
      {blocks.length === 0 ? (
        <span className="text-gray-400">Drag blocks here</span>
      ) : (
        blocks.map((type, idx) => (
          <div key={idx} className="mb-2 p-2 bg-gray-100 rounded border">
            {type.charAt(0).toUpperCase() + type.slice(1)} Block
          </div>
        ))
      )}
    </div>
  );
}

function CampaignEditorPage() {
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>("desktop");
  const draftKey = "campaign-editor-draft";

  // Scheduling state
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [recurrence, setRecurrence] = useState<string>("none");

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      setIsRestoring(true);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (!isRestoring) {
      localStorage.setItem(draftKey, content);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [content, isRestoring]);

  // Restore draft if user chooses
  function handleRestoreDraft() {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      setContent(saved);
    }
    setIsRestoring(false);
  }
  function handleDiscardDraft() {
    localStorage.removeItem(draftKey);
    setIsRestoring(false);
  }
  // For demo: blocks dropped (not persisted yet)
  const [blocks, setBlocks] = useState<string[]>([]);
  function handleBlockDrop(type: string) {
    setBlocks((prev) => [...prev, type]);
  }
  function handleTemplateSelect(template: Template) {
    setContent(template.html);
  }
  function handleMediaSelect(item: MediaItem) {
    // Insert image HTML at the end of content (for demo)
    setContent((prev) => prev + `<img src="${item.url}" alt="${item.name}" style="max-width:100%;border-radius:8px;" />`);
  }

  function handleRssInsert(article: { title: string; url: string; summary: string; published_at: string }) {
    // Insert article as a block of HTML at the end of content
    setContent((prev) =>
      prev +
      `<div class="rss-article-block" style="border:1px solid #e5e7eb;padding:12px;margin:12px 0;border-radius:8px;">
        <div style="font-weight:bold;font-size:1.1em;">${article.title}</div>
        <div style="color:#666;font-size:0.9em;">${new Date(article.published_at).toLocaleString()}</div>
        <div style="margin:8px 0;">${article.summary}</div>
        <a href="${article.url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>
      </div>`
    );
  }
  return (
    <>
      {/* Scheduling UI */}
      <div className="p-4 mb-4 bg-gray-50 border rounded flex flex-col md:flex-row gap-6 items-center">
        <div>
          <label className="block font-bold mb-1">Send Date & Time</label>
          <input
            type="datetime-local"
            className="border rounded px-2 py-1"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Recurrence</label>
          <select
            className="border rounded px-2 py-1"
            value={recurrence}
            onChange={e => setRecurrence(e.target.value)}
          >
            <option value="none">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="text-xs text-gray-500">
          {scheduledAt ? `Scheduled for: ${new Date(scheduledAt).toLocaleString()}` : 'No send time set.'}
        </div>
      </div>
      {isRestoring && (
        <div className="p-4 bg-yellow-100 border-b border-yellow-300 flex items-center gap-4">
          <span>Restore previous draft?</span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleRestoreDraft}>Restore</button>
          <button className="bg-gray-300 px-3 py-1 rounded" onClick={handleDiscardDraft}>Discard</button>
        </div>
      )}
      <DndContext
        onDragEnd={(event) => {
          const { over, active } = event;
          if (over && over.id === "dropzone") {
            handleBlockDrop(active.id as string);
          }
        }}
      >
        <div className="campaign-editor-layout flex">
          {/* Sidebar: Templates, Media Library, Blocks */}
          <aside className="editor-sidebar w-64 p-4 border-r bg-gray-50 space-y-6">
            <TemplateManager onSelect={handleTemplateSelect} />
            <div>
              <div className="font-bold mb-2">Blocks</div>
              <BlockPalette onAdd={handleBlockDrop} />
            </div>
            <div className="font-bold mt-6 mb-2">Media Library</div>
            <MediaLibrary onSelect={handleMediaSelect} />
            <div className="font-bold mt-6 mb-2">RSS Articles</div>
            <RssArticleBrowser onInsert={handleRssInsert} />
          </aside>
          {/* Main Editor Area */}
          <main className="editor-main flex-1 p-6">
            <DropZone blocks={blocks} />
            <RichTextEditor value={content} onChange={setContent} />
            <div className="text-xs text-gray-400 mt-2">
              {lastSaved && <span>Auto-saved at {lastSaved}</span>}
            </div>
          </main>
          {/* Preview Panel */}
          <section className="editor-preview w-96 p-4 border-l bg-gray-50">
            <div className="font-bold mb-2 flex items-center gap-2">
              Preview
              <button
                className={`px-2 py-1 rounded text-xs border ${previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => setPreviewMode('desktop')}
              >
                Desktop
              </button>
              <button
                className={`px-2 py-1 rounded text-xs border ${previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => setPreviewMode('mobile')}
              >
                Mobile
              </button>
            </div>
            <div
              className={`prose prose-sm bg-white p-4 rounded min-h-[300px] border mx-auto ${
                previewMode === 'mobile' ? 'max-w-xs w-[375px] shadow-lg' : 'max-w-none w-full'
              }`}
              style={previewMode === 'mobile' ? { border: '1px solid #e5e7eb' } : {}}
            >
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </section>
        </div>
      </DndContext>
    </>
  );
}
