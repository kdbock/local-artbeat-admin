"use client";
import { useState, useRef } from "react";
import RichTextEditor from "@/components/RichTextEditor";

export default function PostForm({ post, onSave, onCancel }: any) {
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    category: post?.category || "",
    tags: post?.tags || "",
    featured_image: post?.featured_image || "",
    published_at: post?.published_at || "",
  });
  const [error, setError] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState(post?.featured_image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleContentChange(content: string) {
    setForm({ ...form, content });
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

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    try {
      await onSave(form);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function generateSlug(title: string) {
    return title
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-4xl">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Post Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={(e) => {
            handleChange(e);
            if (!form.slug) {
              setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) });
            }
          }}
          placeholder="Enter post title"
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Brief summary of your post"
          rows={3}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Optional: Short description shown in listings</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleSlugChange}
            placeholder="post-url-slug"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Auto-formatted from your text</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author name"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g., News, Updates, Events"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="comma, separated, tags"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label>
        <input
          name="published_at"
          type="datetime-local"
          value={form.published_at}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Post Content *</label>
        <RichTextEditor value={form.content} onChange={handleContentChange} />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          ✓ Save Post
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
