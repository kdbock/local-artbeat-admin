"use client";
import { useState, useEffect } from "react";

export type EmailTemplate = {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  content_html: string;
  content_blocks?: Record<string, unknown>[];
  global_styles?: Record<string, unknown>;
  is_default: boolean;
  created_at?: string;
  created_by?: string;
};

type TemplateManagerProps = {
  onSelectTemplate: (template: EmailTemplate) => void;
  onSaveAsTemplate: (template: EmailTemplate) => Promise<void>;
};

export default function TemplateManager({ onSelectTemplate, onSaveAsTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<EmailTemplate>({
    name: "",
    slug: "",
    description: "",
    content_html: "",
    is_default: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/email-templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading templates");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    setSaving(true);
    setError("");
    try {
      await onSaveAsTemplate(newTemplate);
      setNewTemplate({ name: "", slug: "", description: "", content_html: "", is_default: false });
      setShowForm(false);
      fetchTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm("Delete this template?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/email-templates/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to delete");
      fetchTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete template");
    }
  };

  const handleCloneTemplate = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/email-templates/${id}/clone`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to clone");
      fetchTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clone template");
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Email Templates</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          {showForm ? "Cancel" : "+ New Template"}
        </button>
      </div>

      {error && <div className="p-2 bg-red-100 text-red-800 rounded mb-4 text-sm">{error}</div>}

      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50 space-y-2">
          <input
            type="text"
            placeholder="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            className="w-full px-2 py-1 border rounded text-sm"
          />
          <input
            type="text"
            placeholder="Template slug (auto-generated)"
            value={newTemplate.slug}
            onChange={(e) => setNewTemplate({ ...newTemplate, slug: e.target.value })}
            className="w-full px-2 py-1 border rounded text-sm"
          />
          <textarea
            placeholder="Description"
            value={newTemplate.description || ""}
            onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
            className="w-full px-2 py-1 border rounded text-sm"
            rows={2}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newTemplate.is_default}
              onChange={(e) => setNewTemplate({ ...newTemplate, is_default: e.target.checked })}
            />
            Set as default template
          </label>
          <button
            onClick={handleSaveTemplate}
            disabled={saving || !newTemplate.name || !newTemplate.content_html}
            className="w-full px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            {saving ? "Saving..." : "Save Template"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded text-center text-gray-500 text-sm">
          No templates yet. Create one from a campaign or click &quot;New Template&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {templates.map((template) => (
            <div key={template.id} className="border rounded-lg p-3 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-500">{template.slug}</p>
                </div>
                {template.is_default && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Default</span>
                )}
              </div>
              {template.description && (
                <p className="text-xs text-gray-600 mb-2">{template.description}</p>
              )}
              <div className="text-xs text-gray-500 mb-2">
                Created by {template.created_by || "Unknown"} on{" "}
                {template.created_at ? new Date(template.created_at).toLocaleDateString() : "—"}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onSelectTemplate(template)}
                  className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  Use
                </button>
                <button
                  onClick={() => template.id && handleCloneTemplate(template.id)}
                  className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Clone
                </button>
                <button
                  onClick={() => template.id && handleDeleteTemplate(template.id)}
                  className="flex-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
