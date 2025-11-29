"use client";
import { useEffect, useState } from "react";
import NewsletterTable from "./NewsletterTable";
import RssFeedManager from './components/RssFeedManager';

type NewsletterSubscriber = {
  id: number;
  email: string;
  name?: string;
  interests?: string;
  confirmed?: boolean;
  created_at?: string;
};

export default function NewsletterPage() {
  const [tab, setTab] = useState<'campaigns' | 'subscribers' | 'rss'>('subscribers');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    interests: "",
    confirmed: false,
  });
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState<boolean>(false);

  async function fetchSubscribers() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/admin/newsletter-subscribers", {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch {
      setError("Failed to load subscribers");
    }
    setLoading(false);
  }

  async function fetchCampaigns() {
    setCampaignsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/admin/newsletter-campaigns", {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load campaigns");
    }
    setCampaignsLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSubscribers();
  }, []);

  useEffect(() => {
    if (tab === 'campaigns') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchCampaigns();
    }
  }, [tab]);

  async function handleAddSubscriber(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/admin/newsletter-subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to add subscriber");
        return;
      }

      setFormData({ email: "", name: "", interests: "", confirmed: false });
      setShowForm(false);
      fetchSubscribers();
    } catch {
      setError("Failed to add subscriber");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this subscriber?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/admin/newsletter-subscribers/${id}`, {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return alert("Delete failed");
    fetchSubscribers();
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <button onClick={() => setTab('campaigns')} className={tab === 'campaigns' ? 'font-bold underline' : ''}>Campaigns</button>
        <button onClick={() => setTab('subscribers')} className={tab === 'subscribers' ? 'font-bold underline' : ''}>Subscribers</button>
        <button onClick={() => setTab('rss')} className={tab === 'rss' ? 'font-bold underline' : ''}>RSS Feeds</button>
      </div>
      {tab === 'campaigns' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Newsletter Campaigns</h1>
            <a href="/admin/newsletter/campaigns" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Campaign
            </a>
          </div>
          {campaignsLoading ? (
            <div>Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-gray-600 p-4 bg-gray-50 rounded">No campaigns yet. <a href="/admin/newsletter/campaigns" className="text-blue-600 hover:underline">Create one</a></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded shadow">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Recipients</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign: any) => (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{campaign.title}</td>
                      <td className="p-3">{campaign.subject_line}</td>
                      <td className="p-3"><span className="px-2 py-1 rounded text-sm" style={{backgroundColor: campaign.status === 'sent' ? '#d4edda' : campaign.status === 'sending' ? '#fff3cd' : '#e2e3e5', color: campaign.status === 'sent' ? '#155724' : campaign.status === 'sending' ? '#856404' : '#383d41'}}>{campaign.status}</span></td>
                      <td className="p-3">{campaign.total_recipients || 0}</td>
                      <td className="p-3">
                        <a href={`/admin/newsletter/campaigns/${campaign.id}`} className="text-blue-600 hover:underline text-sm">Edit</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {tab === 'subscribers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showForm ? "Cancel" : "+ Add Subscriber"}
            </button>
          </div>
          {error && <div className="text-red-600 mb-4 p-2 bg-red-100 rounded">{error}</div>}
          {showForm && (
            <form onSubmit={handleAddSubscriber} className="bg-white p-4 rounded shadow mb-4">
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Interests (optional)"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.confirmed}
                    onChange={(e) => setFormData({ ...formData, confirmed: e.target.checked })}
                    className="mr-2"
                  />
                  <span>Mark as confirmed (skip confirmation email)</span>
                </label>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Add Subscriber
                </button>
              </div>
            </form>
          )}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <NewsletterTable
              subscribers={subscribers}
              onDelete={handleDelete}
              onBulkAction={async (ids, action) => {
                if (action === "delete") {
                  if (!confirm("Delete selected subscribers?")) return;
                  const token = localStorage.getItem("token");
                  await Promise.all(
                    ids.map(id =>
                      fetch(`http://localhost:8000/api/admin/newsletter-subscribers/${id}`, {
                        method: "DELETE",
                        headers: { 
                          Authorization: `Bearer ${token}`,
                          Accept: "application/json",
                        },
                      })
                    )
                  );
                  fetchSubscribers();
                } else if (action === "export") {
                  const selected = subscribers.filter(s => ids.includes(s.id));
                  const csv = [
                    ["ID", "Email", "Name", "Interests", "Confirmed", "Created At"],
                    ...selected.map(s => [s.id, s.email, s.name || "", s.interests || "", s.confirmed ? "Yes" : "No", s.created_at || ""])
                  ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }}
            />
          )}
        </div>
      )}
      {tab === 'rss' && (
        <RssFeedManager />
      )}
    </div>
  );
}
