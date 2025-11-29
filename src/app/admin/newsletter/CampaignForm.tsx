"use client";
import { useState } from "react";

type Campaign = {
  id?: number;
  title: string;
  subject_line: string;
  from_name: string;
  from_email: string;
  reply_to_email: string;
  content_html: string;
  content_text?: string;
  status: string;
  scheduled_at?: string;
  sent_at?: string;
};

type CampaignFormProps = {
  campaign?: Campaign | null;
  onSave: (form: Campaign) => Promise<void>;
  onCancel?: () => void;
};

export default function CampaignForm({ campaign, onSave, onCancel }: CampaignFormProps) {
  const [form, setForm] = useState<Campaign>({
    title: campaign?.title || "",
    subject_line: campaign?.subject_line || "",
    from_name: campaign?.from_name || "",
    from_email: campaign?.from_email || "",
    reply_to_email: campaign?.reply_to_email || "",
    content_html: campaign?.content_html || "",
    content_text: campaign?.content_text || "",
    status: campaign?.status || "draft",
    scheduled_at: campaign?.scheduled_at || "",
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An error occurred");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow max-w-2xl">
      {error && <div className="text-red-600 mb-4 p-2 bg-red-100 rounded">{error}</div>}
      <div>
        <label className="block text-sm font-semibold mb-1">Internal Title *</label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="My Campaign" className="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Subject Line *</label>
        <input name="subject_line" value={form.subject_line} onChange={handleChange} placeholder="Check out our latest updates" className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">From Name *</label>
          <input name="from_name" value={form.from_name} onChange={handleChange} placeholder="ArtBeat Team" className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">From Email *</label>
          <input name="from_email" value={form.from_email} onChange={handleChange} placeholder="noreply@artbeat.local" className="w-full border px-3 py-2 rounded" type="email" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Reply-To Email *</label>
        <input name="reply_to_email" value={form.reply_to_email} onChange={handleChange} placeholder="support@artbeat.local" className="w-full border px-3 py-2 rounded" type="email" required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">HTML Content *</label>
        <textarea name="content_html" value={form.content_html} onChange={handleChange} placeholder="<h1>Hello</h1><p>Your content here</p>" className="w-full border px-3 py-2 rounded font-mono text-sm" rows={8} required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Plain Text Content (optional)</label>
        <textarea name="content_text" value={form.content_text || ""} onChange={handleChange} placeholder="Your content here" className="w-full border px-3 py-2 rounded" rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Scheduled At (optional)</label>
          <input name="scheduled_at" value={form.scheduled_at} onChange={handleChange} placeholder="Schedule for later" className="w-full border px-3 py-2 rounded" type="datetime-local" />
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Campaign</button>
        {onCancel && <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>}
      </div>
    </form>
  );
}
