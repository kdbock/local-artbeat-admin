"use client";
import { useEffect, useState } from "react";
import TourForm, { Tour } from "./TourForm";
import ToursTable from "./ToursTable";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function fetchTours() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/tours", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTours(data.tours || []);
    } catch {
      setError("Failed to load tours");
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await fetchTours();
    })();
  }, []);

  async function handleSave(form: Tour) {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const isEdit = !!editing;
      const url = isEdit
        ? `http://localhost:8000/api/admin/tours/${editing?.id}`
        : "http://localhost:8000/api/admin/tours";
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
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.message || errorData.error || "Save failed";
        throw new Error(errorMsg);
      }
      setShowForm(false);
      setEditing(null);
      fetchTours();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this tour?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/admin/tours/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return alert("Delete failed");
    fetchTours();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tours</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
      >
        + New Tour
      </button>
      {showForm && (
        <TourForm
          tour={editing}
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
        <ToursTable
          tours={tours}
          onEdit={(tour) => {
            setEditing(tour);
            setShowForm(true);
          }}
          onDelete={(tourId) => {
            if (typeof tourId === "number") handleDelete(tourId);
          }}
          onBulkAction={async (ids, action) => {
            const token = localStorage.getItem("token");
            if (action === "delete") {
              if (!confirm("Delete selected tours?")) return;
              await Promise.all(
                ids.map(id =>
                  fetch(`http://localhost:8000/api/admin/tours/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  })
                )
              );
              fetchTours();
            } else if (action === "publish" || action === "draft") {
              await Promise.all(
                ids.map(id =>
                  fetch(`http://localhost:8000/api/admin/tours/${id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: action === "publish" ? "published" : "draft" }),
                  })
                )
              );
              fetchTours();
            }
          }}
        />
      )}
    </div>
  );
}
