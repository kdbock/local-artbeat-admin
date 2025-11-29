import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">ARTbeat Admin</h2>
        <nav className="flex-1 space-y-4">
          <Link href="/admin/posts" className="block hover:text-blue-300">Posts</Link>
          <Link href="/admin/tours" className="block hover:text-blue-300">Tours</Link>
          <Link href="/admin/newsletter" className="block hover:text-blue-300">Newsletter</Link>
          <Link href="/admin/pages" className="block hover:text-blue-300">Pages</Link>
          <Link href="/admin/donations" className="block hover:text-blue-300">Donations</Link>
          <Link href="/admin/site-settings" className="block hover:text-blue-300">Site Settings</Link>
        </nav>
        <form action="/login" method="post" className="mt-8">
          <button type="submit" className="w-full bg-red-600 py-2 rounded hover:bg-red-700">Logout</button>
        </form>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
