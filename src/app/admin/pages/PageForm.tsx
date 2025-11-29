"use client";
import { useState } from "react";

export default function PageForm({ page, onSave, onCancel }: any) {
  const [form, setForm] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
    status: page?.status || "",
  });
  const [error, setError] = useState("");

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    try {
      await onSave(form);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      {error && <div className="text-red-600">{error}</div>}
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border px-3 py-2 rounded" required />
      <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" className="w-full border px-3 py-2 rounded" required />
      <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" className="w-full border px-3 py-2 rounded" rows={5} required />
      <input name="status" value={form.status} onChange={handleChange} placeholder="Status" className="w-full border px-3 py-2 rounded" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        {onCancel && <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>}
      </div>
    </form>
  );
}
