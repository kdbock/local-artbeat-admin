"use client";

export default function PagesTable({ pages, onEdit, onDelete }: any) {
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="px-4 py-2 border">ID</th>
          <th className="px-4 py-2 border">Title</th>
          <th className="px-4 py-2 border">Slug</th>
          <th className="px-4 py-2 border">Status</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {pages.map((page: any) => (
          <tr key={page.id}>
            <td className="px-4 py-2 border">{page.id}</td>
            <td className="px-4 py-2 border">{page.title}</td>
            <td className="px-4 py-2 border">{page.slug}</td>
            <td className="px-4 py-2 border">{page.status}</td>
            <td className="px-4 py-2 border">
              <button onClick={() => onEdit(page)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={() => onDelete(page)} className="text-red-600">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
