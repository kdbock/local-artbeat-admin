"use client";
import { useState } from "react";

type Post = {
  id: number;
  title: string;
  slug: string;
  author: string;
  status?: string;
  [key: string]: unknown;
};

type PostsTableProps = {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  onBulkAction: (ids: number[], action: string) => void;
};

export default function PostsTable({ posts, onEdit, onDelete, onBulkAction }: PostsTableProps) {
  const [selected, setSelected] = useState<number[]>([]);

  function toggleSelect(id: number) {
    setSelected(selected =>
      selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]
    );
  }

  function selectAll() {
    if (selected.length === posts.length) setSelected([]);
    else setSelected(posts.map(p => p.id));
  }

  function handleBulk(action: string) {
    if (selected.length === 0) return;
    onBulkAction(selected, action);
  }

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button onClick={() => handleBulk("delete")} className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50" disabled={selected.length === 0}>Delete Selected</button>
        <button onClick={() => handleBulk("publish")} className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50" disabled={selected.length === 0}>Publish Selected</button>
        <button onClick={() => handleBulk("draft")} className="bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50" disabled={selected.length === 0}>Mark as Draft</button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2"><input type="checkbox" checked={selected.length === posts.length && posts.length > 0} onChange={selectAll} /></th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Slug</th>
            <th className="p-2 text-left">Author</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td className="p-2"><input type="checkbox" checked={selected.includes(post.id)} onChange={() => toggleSelect(post.id)} /></td>
              <td className="p-2">{post.title}</td>
              <td className="p-2">{post.slug}</td>
              <td className="p-2">{post.author}</td>
              <td className="p-2">{post.status}</td>
              <td className="p-2 flex gap-2">
                <button className="bg-yellow-400 px-2 py-1 rounded" onClick={() => onEdit(post)}>Edit</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => onDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
