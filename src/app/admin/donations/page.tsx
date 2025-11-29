
"use client";
import { useEffect, useState } from "react";
import DonationsTable from "./DonationsTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDonations() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/donations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch donations");
      const data = await res.json();
      setDonations(data.donations || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDonations();
  }, []);

  async function handleDelete(donation: any) {
    if (!confirm("Delete this donation?")) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/donations/${donation.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete donation");
      fetchDonations();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Donations</h1>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DonationsTable
          donations={donations}
          onDelete={handleDelete}
          onBulkAction={async (ids: number[], action: string) => {
            if (action === "delete") {
              if (!confirm("Delete selected donations?")) return;
              const token = localStorage.getItem("token");
              await Promise.all(
                ids.map(id =>
                  fetch(`${API_URL}/admin/donations/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  })
                )
              );
              fetchDonations();
            } else if (action === "export") {
              // CSV export for selected donations
              const selectedDonations = donations.filter((d: any) => ids.includes(d.id));
              const csv = [
                ["ID", "Name", "Email", "Amount", "Date"],
                ...selectedDonations.map((d: any) => [d.id, d.name, d.email, d.amount, d.created_at])
              ].map(row => row.join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "donations.csv";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          }}
        />
      )}
    </div>
  );
}
