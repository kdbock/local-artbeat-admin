"use client";
import { useState } from "react";
import { Tour } from "./TourForm";

type ToursTableProps = {
  tours: Tour[];
  onEdit: (tour: Tour) => void;
  onDelete: (id: number) => void;
  onBulkAction: (ids: number[], action: string) => void;
};

export default function ToursTable({ tours, onEdit, onDelete, onBulkAction }: ToursTableProps) {
  const [selected, setSelected] = useState<number[]>([]);

  function toggleSelect(id: number) {
    setSelected(selected =>
      selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]
    );
  }

  function selectAll() {
    if (selected.length === tours.length) setSelected([]);
    else setSelected(tours.map(t => t.id as number));
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
            <th className="p-2"><input type="checkbox" checked={selected.length === tours.length && tours.length > 0} onChange={selectAll} /></th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map(tour => (
            <tr key={tour.id}>
              <td className="p-2"><input type="checkbox" checked={selected.includes(tour.id as number)} onChange={() => toggleSelect(tour.id as number)} /></td>
              <td className="p-2">{tour.name}</td>
              <td className="p-2">{tour.city}</td>
              <td className="p-2">{tour.date}</td>
              <td className="p-2 flex gap-2">
                <button className="bg-yellow-400 px-2 py-1 rounded" onClick={() => onEdit(tour)}>Edit</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => onDelete(tour.id as number)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
