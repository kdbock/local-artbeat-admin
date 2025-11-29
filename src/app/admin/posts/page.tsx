"use client";

import { useEffect, useState } from "react";
import PostForm from "./PostForm";
import PostsTable from "./PostsTable";

type Post = {
  id: number;
  title: string;
  slug: string;
  author: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function fetchPosts() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts((data.posts || []) as Post[]);
    } catch {
      setError("Failed to load posts");
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await fetchPosts();
    })();
  }, []);

  async function handleSave(post: Post) {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const isEdit = !!editing;
      const url = isEdit
        ? `http://localhost:8000/api/admin/posts/${editing?.id}`
        : "http://localhost:8000/api/admin/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || error.error || "Save failed");
      }
      setShowForm(false);
      setEditing(null);
      fetchPosts();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert("Delete failed");
      return;
    }
    fetchPosts();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
      >
        + New Post
      </button>
      {showForm && (
        <PostForm
          post={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <PostsTable
          posts={posts}
          onEdit={(post) => {
            setEditing(post);
            setShowForm(true);
          }}
          onDelete={handleDelete}
          onBulkAction={async (ids, action) => {
            if (action === "delete") {
              if (!confirm("Delete selected posts?")) return;
              const token = localStorage.getItem("token");
              await Promise.all(
                ids.map(id =>
                  fetch(`http://localhost:8000/api/admin/posts/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  })
                )
              );
              fetchPosts();
            } else if (action === "publish" || action === "draft") {
              const token = localStorage.getItem("token");
              await Promise.all(
                ids.map(id =>
                  fetch(`http://localhost:8000/api/admin/posts/${id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: action === "publish" ? "published" : "draft" }),
                  })
                )
              );
              fetchPosts();
            }
          }}
        />
      )}
    </div>
  );
}
