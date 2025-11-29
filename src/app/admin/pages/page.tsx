
"use client";
import { useEffect, useState } from "react";
import PagesTable from "./PagesTable";
import PageForm from "./PageForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function PagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function fetchPages() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/pages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch pages");
      const data = await res.json();
      setPages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPages();
  }, []);

  function handleEdit(page: any) {
    setEditing(page);
    setShowForm(true);
  }

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  async function handleDelete(page: any) {
    if (!confirm("Delete this page?")) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/pages/${page.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete page");
      fetchPages();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleSave(form: any) {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const isEdit = !!editing;
      const url = isEdit ? `${API_URL}/admin/pages/${editing.id}` : `${API_URL}/admin/pages`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save page");
      }
      setShowForm(false);
      setEditing(null);
      fetchPages();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pages</h1>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add Page</button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {showForm ? (
        <PageForm
          page={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <PagesTable pages={pages} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
