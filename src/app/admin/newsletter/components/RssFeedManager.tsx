import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RssFeed {
  id: number;
  name: string;
  url: string;
  auto_include: boolean;
  created_at: string;
  updated_at: string;
  articles_count?: number;
}

export default function RssFeedManager() {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFeed, setEditingFeed] = useState<RssFeed | null>(null);
  const [form, setForm] = useState({ name: '', url: '', auto_include: false });
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/rss-feeds');
      setFeeds(res.data);
    } catch (e: unknown) {
      if (typeof e === 'object' && e && 'message' in e) {
        setError((e as { message?: string }).message || 'Failed to load feeds');
      } else {
        setError('Failed to load feeds');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (feed: RssFeed) => {
    setEditingFeed(feed);
    setForm({ name: feed.name, url: feed.url, auto_include: feed.auto_include });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this RSS feed?')) return;
    await axios.delete(`/api/admin/rss-feeds/${id}`);
    fetchFeeds();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingFeed) {
        await axios.put(`/api/admin/rss-feeds/${editingFeed.id}`, form);
      } else {
        await axios.post('/api/admin/rss-feeds', form);
      }
      setEditingFeed(null);
      setForm({ name: '', url: '', auto_include: false });
      fetchFeeds();
    } catch (e: unknown) {
      if (typeof e === 'object' && e) {
        // Try to get error message from axios error
        const axiosErr = e as { response?: { data?: { message?: string } }, message?: string };
        setError(axiosErr.response?.data?.message || axiosErr.message || 'Save failed');
      } else {
        setError('Save failed');
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">RSS Feeds</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 max-w-md">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Feed Name"
          className="border px-2 py-1 rounded"
          required
        />
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="Feed URL"
          className="border px-2 py-1 rounded"
          required
          type="url"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="auto_include"
            checked={form.auto_include}
            onChange={handleChange}
          />
          Auto-include articles in campaigns
        </label>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
            {editingFeed ? 'Update Feed' : 'Add Feed'}
          </button>
          {editingFeed && (
            <button type="button" onClick={() => { setEditingFeed(null); setForm({ name: '', url: '', auto_include: false }); }} className="px-4 py-1 border rounded">
              Cancel
            </button>
          )}
        </div>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">URL</th>
              <th className="border px-2 py-1">Auto-Include</th>
              <th className="border px-2 py-1">Articles</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map(feed => (
              <tr key={feed.id}>
                <td className="border px-2 py-1">{feed.name}</td>
                <td className="border px-2 py-1"><a href={feed.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{feed.url}</a></td>
                <td className="border px-2 py-1 text-center">{feed.auto_include ? 'Yes' : 'No'}</td>
                <td className="border px-2 py-1 text-center">{feed.articles_count ?? '-'}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button onClick={() => handleEdit(feed)} className="text-blue-600 underline">Edit</button>
                  <button onClick={() => handleDelete(feed.id)} className="text-red-600 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
