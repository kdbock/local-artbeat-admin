"use client";
import { useState } from "react";

type Subscriber = {
  id: number;
  email: string;
  name?: string;
  confirmed?: boolean;
  created_at?: string;
};

type NewsletterTableProps = {
  subscribers: Subscriber[];
  onDelete: (id: number) => void;
  onBulkAction: (ids: number[], action: string) => void;
};

export default function NewsletterTable({ subscribers, onDelete, onBulkAction }: NewsletterTableProps) {
  const [selected, setSelected] = useState<number[]>([]);

  function toggleSelect(id: number) {
    setSelected(selected =>
      selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]
    );
  }

  function selectAll() {
    if (selected.length === subscribers.length) setSelected([]);
    else setSelected(subscribers.map(s => s.id));
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
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2"><input type="checkbox" checked={selected.length === subscribers.length && subscribers.length > 0} onChange={selectAll} /></th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Confirmed</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map(sub => (
            <tr key={sub.id}>
              <td className="p-2"><input type="checkbox" checked={selected.includes(sub.id)} onChange={() => toggleSelect(sub.id)} /></td>
              <td className="p-2">{sub.email}</td>
              <td className="p-2">{sub.name}</td>
              <td className="p-2">{sub.confirmed ? "Yes" : "No"}</td>
              <td className="p-2">
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => onDelete(sub.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
