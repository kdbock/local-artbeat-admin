"use client";
import { useState, useRef } from "react";
import RichTextEditor from "@/components/RichTextEditor";

export type Tour = {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  city?: string;
  type?: string;
  is_free?: boolean;
  date?: string;
  time?: string;
  guide?: string;
  map_url?: string;
  featured_image?: string;
  [key: string]: unknown;
};

type TourFormProps = {
  tour?: Tour | null;
  onSave: (form: Tour) => Promise<void>;
  onCancel?: () => void;
};

export default function TourForm({ tour, onSave, onCancel }: TourFormProps) {
  const [form, setForm] = useState<Tour>({
    name: tour?.name || "",
    slug: tour?.slug || "",
    description: tour?.description || "",
    city: tour?.city || "",
    type: tour?.type || "",
    is_free: tour?.is_free || false,
    date: tour?.date || "",
    time: tour?.time || "",
    guide: tour?.guide || "",
    map_url: tour?.map_url || "",
    featured_image: tour?.featured_image || "",
  });
  const [error, setError] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState(tour?.featured_image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox") {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm({ ...form, [name]: fieldValue });
  }

  function handleDescriptionChange(content: string) {
    setForm({ ...form, description: content });
  }

  function handleFeaturedImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setForm({ ...form, featured_image: base64 });
        setFeaturedImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = generateSlug(e.target.value);
    setForm({ ...form, slug: formatted });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
      console.error("Tour save error:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-4xl">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tour/Event Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={(e) => {
            handleChange(e);
            if (!form.slug) {
              setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) });
            }
          }}
          placeholder="e.g., Downtown Art Walk"
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleSlugChange}
            placeholder="tour-url-slug"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Auto-formatted from your text</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Guide/Organizer</label>
          <input
            name="guide"
            value={form.guide}
            onChange={handleChange}
            placeholder="Guide or organizer name"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Event city"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Type</label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="e.g., Walking, Virtual, Workshop"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
          <input
            name="time"
            type="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <input
            type="checkbox"
            name="is_free"
            checked={form.is_free || false}
            onChange={handleChange}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="font-semibold text-gray-700">This is a free event</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              📤 Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageUpload}
              className="hidden"
            />
          </div>
          {featuredImagePreview && (
            <div className="relative w-full max-w-xs">
              <img
                src={featuredImagePreview}
                alt="Featured image preview"
                className="w-full h-40 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Map/Location URL</label>
        <input
          name="map_url"
          value={form.map_url}
          onChange={handleChange}
          placeholder="Google Maps link or location URL"
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
        <RichTextEditor value={form.description || ""} onChange={handleDescriptionChange} />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          ✓ Save Tour/Event
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
