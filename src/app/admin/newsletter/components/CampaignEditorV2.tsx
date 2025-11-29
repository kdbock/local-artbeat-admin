"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import TipTapEditor from "./TipTapEditor";
import BlockBuilder, { ContentBlock } from "./BlockBuilder";
import GlobalStyles, { GlobalStylesConfig } from "./GlobalStyles";
import MediaLibrary from "./MediaLibrary";
import PreviewPanel from "./PreviewPanel";

export type CampaignEditorV2Props = {
  campaignId?: number;
  initialTitle?: string;
  initialSubject?: string;
  initialFromName?: string;
  initialFromEmail?: string;
  initialReplyTo?: string;
  initialHtmlContent?: string;
  onSave: (data: EditorData) => Promise<void>;
  onAutoSave?: (data: EditorData) => Promise<void>;
};

export type EditorData = {
  title: string;
  subject_line: string;
  from_name: string;
  from_email: string;
  reply_to_email: string;
  content_html: string;
  content_blocks?: ContentBlock[];
  global_styles?: GlobalStylesConfig;
};

export default function CampaignEditorV2({
  campaignId,
  initialTitle = "",
  initialSubject = "",
  initialFromName = "",
  initialFromEmail = "",
  initialReplyTo = "",
  initialHtmlContent = "",
  onSave,
  onAutoSave,
}: CampaignEditorV2Props) {
  void campaignId;
  const [tab, setTab] = useState<"editor" | "blocks" | "settings" | "preview">("editor");
  const [title, setTitle] = useState(initialTitle);
  const [subject, setSubject] = useState(initialSubject);
  const [fromName, setFromName] = useState(initialFromName);
  const [fromEmail, setFromEmail] = useState(initialFromEmail);
  const [replyTo, setReplyTo] = useState(initialReplyTo);
  const [htmlContent, setHtmlContent] = useState(initialHtmlContent);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [globalStyles, setGlobalStyles] = useState<GlobalStylesConfig>({
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
  });
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const editorData = useMemo(
    () => ({
      title,
      subject_line: subject,
      from_name: fromName,
      from_email: fromEmail,
      reply_to_email: replyTo,
      content_html: htmlContent,
      content_blocks: blocks,
      global_styles: globalStyles,
    }),
    [title, subject, fromName, fromEmail, replyTo, htmlContent, blocks, globalStyles]
  );

  const performAutoSave = useCallback(async (data: EditorData) => {
    if (!onAutoSave) return;
    
    setAutoSaveStatus("saving");
    try {
      await onAutoSave(data);
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    } catch (err) {
      setAutoSaveStatus("idle");
      console.error("Auto-save failed:", err);
    }
  }, [onAutoSave]);

  useEffect(() => {
    setUnsavedChanges(true);
    const timer = setTimeout(() => {
      performAutoSave(editorData);
    }, 3000);

    return () => clearTimeout(timer);
  }, [editorData, performAutoSave]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(editorData);
      setUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const generateHtmlFromBlocks = (): string => {
    if (blocks.length === 0) return "";
    
    let html = '<table style="width: 100%; font-family: ' + (globalStyles.fontFamily || "Arial") + ';">';
    
    blocks.forEach((block) => {
      const style = {
        padding: block.style?.padding || "16px",
        margin: block.style?.margin || "8px 0",
        backgroundColor: block.style?.backgroundColor || "transparent",
        color: block.style?.textColor || "#000",
        fontSize: block.style?.fontSize || "16px",
        textAlign: block.style?.alignment as "left" | "center" | "right" | undefined || "left",
      };

      const styleString = Object.entries(style)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${v}`)
        .join("; ");

      html += "<tr><td style=\"" + styleString + "\">";

      switch (block.type) {
        case "heading":
          html += "<h2 style=\"margin: 0;\">" + escapeHtml(block.content) + "</h2>";
          break;
        case "text":
          html += "<p style=\"margin: 0; line-height: 1.6;\">" + escapeHtml(block.content) + "</p>";
          break;
        case "image":
          html += "<img src=\"" + block.content + "\" alt=\"\" style=\"max-width: 100%; height: auto;\" />";
          break;
        case "button":
          html +=
            '<a href="#" style="display: inline-block; background-color: ' +
            (globalStyles.primaryColor || "#3b82f6") +
            '; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">' +
            escapeHtml(block.content) +
            "</a>";
          break;
        case "divider":
          html += "<hr style=\"border: none; border-top: 1px solid #ddd; margin: 16px 0;\" />";
          break;
        case "spacer":
          html += "<div style=\"height: " + (block.content || "32") + "px;\"></div>";
          break;
      }

      html += "</td></tr>";
    });

    html += "</table>";
    return html;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaign Editor</h1>
        <div className="flex gap-2">
          <span className={`text-sm px-3 py-1 rounded ${
            autoSaveStatus === "saving" ? "bg-yellow-100 text-yellow-800" :
            autoSaveStatus === "saved" ? "bg-green-100 text-green-800" :
            "text-gray-500"
          }`}>
            {autoSaveStatus === "saving" ? "Saving..." : autoSaveStatus === "saved" ? "Saved" : ""}
          </span>
          <button
            onClick={handleSave}
            disabled={saving || !unsavedChanges}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Campaign"}
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Campaign Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Internal campaign name"
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Subject Line *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line"
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">From Name *</label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="e.g., ArtBeat Team"
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">From Email *</label>
            <input
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="noreply@artbeat.local"
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Reply-To Email *</label>
          <input
            type="email"
            value={replyTo}
            onChange={(e) => setReplyTo(e.target.value)}
            placeholder="support@artbeat.local"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="flex gap-0 border-b bg-gray-50">
          <button
            onClick={() => setTab("editor")}
            className={`px-4 py-2 font-semibold ${tab === "editor" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            WYSIWYG Editor
          </button>
          <button
            onClick={() => setTab("blocks")}
            className={`px-4 py-2 font-semibold ${tab === "blocks" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            Block Builder
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`px-4 py-2 font-semibold ${tab === "settings" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            Styles & Media
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`px-4 py-2 font-semibold ${tab === "preview" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            Preview
          </button>
        </div>

        <div className="p-4">
          {tab === "editor" && (
            <div className="space-y-4">
              <TipTapEditor
                initialContent={htmlContent}
                onChange={setHtmlContent}
                onImageUpload={handleImageUpload}
              />
            </div>
          )}

          {tab === "blocks" && (
            <BlockBuilder blocks={blocks} onBlocksChange={setBlocks} globalStyles={globalStyles} />
          )}

          {tab === "settings" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <GlobalStyles styles={globalStyles} onStylesChange={setGlobalStyles} />
                {blocks.length > 0 && (
                  <button
                    onClick={() => setHtmlContent(generateHtmlFromBlocks())}
                    className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Generate HTML from Blocks
                  </button>
                )}
              </div>
              <MediaLibrary onImageSelect={() => {}} onUpload={handleImageUpload} />
            </div>
          )}

          {tab === "preview" && (
            <PreviewPanel htmlContent={htmlContent} title="Email Preview" />
          )}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
