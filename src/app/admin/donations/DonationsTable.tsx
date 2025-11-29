"use client";

import { useState } from "react";

export default function DonationsTable({ donations, onDelete, onBulkAction }: any) {
  const [selected, setSelected] = useState<number[]>([]);

  function toggleSelect(id: number) {
    setSelected(selected =>
      selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]
    );
  }

  function selectAll() {
    if (selected.length === donations.length) setSelected([]);
    else setSelected(donations.map((d: any) => d.id));
  }

  function handleBulk(action: string) {
    if (selected.length === 0) return;
    onBulkAction(selected, action);
  }

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button onClick={() => handleBulk("delete")} className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50" disabled={selected.length === 0}>Delete Selected</button>
        <button onClick={() => handleBulk("export")} className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50" disabled={selected.length === 0}>Export CSV</button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border"><input type="checkbox" checked={selected.length === donations.length && donations.length > 0} onChange={selectAll} /></th>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation: any) => (
            <tr key={donation.id}>
              <td className="px-4 py-2 border"><input type="checkbox" checked={selected.includes(donation.id)} onChange={() => toggleSelect(donation.id)} /></td>
              <td className="px-4 py-2 border">{donation.id}</td>
              <td className="px-4 py-2 border">{donation.name}</td>
              <td className="px-4 py-2 border">{donation.email}</td>
              <td className="px-4 py-2 border">${donation.amount}</td>
              <td className="px-4 py-2 border">{donation.created_at?.slice(0, 10)}</td>
              <td className="px-4 py-2 border">
                <button onClick={() => onDelete(donation)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
