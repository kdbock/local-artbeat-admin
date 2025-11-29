"use client";
import { useState } from "react";

export default function SiteSettingsForm({ settings, onSave }: any) {
  const [form, setForm] = useState({
    site_name: settings?.site_name || "",
    contact_email: settings?.contact_email || "",
    description: settings?.description || "",
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow max-w-lg">
      {error && <div className="text-red-600">{error}</div>}
      <input name="site_name" value={form.site_name} onChange={handleChange} placeholder="Site Name" className="w-full border px-3 py-2 rounded" required />
      <input name="contact_email" value={form.contact_email} onChange={handleChange} placeholder="Contact Email" className="w-full border px-3 py-2 rounded" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2 rounded" rows={4} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Settings</button>
    </form>
  );
}
