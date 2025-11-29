
"use client";
import { useEffect, useState } from "react";
import CampaignEditorV2, { EditorData } from "../components/CampaignEditorV2";
import TemplateManager from "../components/TemplateManager";
import Link from "next/link";

type Analytics = {
  total_recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
};

type Campaign = {
  id?: number;
  title: string;
  subject_line: string;
  from_name: string;
  from_email: string;
  reply_to_email: string;
  content_html: string;
  status: string;
  total_recipients?: number;
  opened_count?: number;
  clicked_count?: number;
  sent_at?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [sending, setSending] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmails, setTestEmails] = useState("");
  const [testingCampaignId, setTestingCampaignId] = useState<number | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsCampaign, setAnalyticsCampaign] = useState<Campaign | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/newsletter-campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendCampaign(id: number) {
    if (!confirm("Send this campaign to all confirmed subscribers?")) return;
    setSending(true);
    setError("");
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/admin/newsletter-campaigns/${id}/send`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to send campaign");
      fetchCampaigns();
      alert("Campaign sent successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send campaign");
    } finally {
      setSending(false);
    }
  }

  async function handleSave(editorData: EditorData) {
    setError("");
    const token = localStorage.getItem("token");
    const method = editing?.id ? "PUT" : "POST";
    const url = editing?.id 
      ? `${API_URL}/admin/newsletter-campaigns/${editing.id}`
      : `${API_URL}/admin/newsletter-campaigns`;
    
    const payload = {
      ...editorData,
      status: editing?.status || "draft",
    };
    
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save campaign");
      fetchCampaigns();
      setShowEditor(false);
      setEditing(null);
      alert("Campaign saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save campaign");
    }
  }

  async function handleAutoSave(editorData: EditorData) {
    if (!editing?.id) return;
    const token = localStorage.getItem("token");
    const payload = {
      ...editorData,
      status: editing.status || "draft",
    };
    try {
      await fetch(`${API_URL}/admin/newsletter-campaigns/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this campaign?")) return;
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/admin/newsletter-campaigns/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete campaign");
      fetchCampaigns();
      alert("Campaign deleted!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete campaign");
    }
  }

  async function handleViewAnalytics(campaign: Campaign) {
    setAnalyticsCampaign(campaign);
    setAnalyticsLoading(true);
    setAnalyticsError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/admin/newsletter-campaigns/${campaign.id}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load analytics");
      const data = await res.json();
      setAnalytics(data.analytics);
      setShowAnalytics(true);
    } catch (err) {
      setAnalyticsError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function handleSendTest() {
    if (!testingCampaignId) return;
    setError("");
    setSending(true);
    const token = localStorage.getItem("token");
    const emails = testEmails.split(",").map(e => e.trim());
    
    try {
      const res = await fetch(`${API_URL}/admin/newsletter-campaigns/${testingCampaignId}/send-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ test_emails: emails }),
      });
      if (!res.ok) throw new Error("Failed to send test");
      setShowTestModal(false);
      setTestEmails("");
      setTestingCampaignId(null);
      alert("Test emails sent successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send test");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      {showEditor ? (
        <div className="p-6">
          <div className="mb-4">
            <button
              onClick={() => { setShowEditor(false); setEditing(null); }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back to Campaigns
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <CampaignEditorV2
                campaignId={editing?.id}
                initialTitle={editing?.title || ""}
                initialSubject={editing?.subject_line || ""}
                initialFromName={editing?.from_name || ""}
                initialFromEmail={editing?.from_email || ""}
                initialReplyTo={editing?.reply_to_email || ""}
                initialHtmlContent={editing?.content_html || ""}
                onSave={handleSave}
                onAutoSave={handleAutoSave}
              />
            </div>
            <div>
              <TemplateManager
                onSelectTemplate={() => {}}
                onSaveAsTemplate={async () => {}}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded shadow">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Recipients</th>
                    <th className="p-3 text-left">Opens</th>
                    <th className="p-3 text-left">Clicks</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{c.title}</td>
                      <td className="p-3">{c.subject_line}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          c.status === 'sent' ? 'bg-green-100 text-green-800' :
                          c.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3">{c.total_recipients || 0}</td>
                      <td className="p-3">{c.opened_count || 0}</td>
                      <td className="p-3">{c.clicked_count || 0}</td>
                      <td className="p-3 flex gap-2 flex-wrap">
                        {c.status === 'draft' && (
                          <>
                            <button 
                              className="bg-yellow-400 text-black px-2 py-1 rounded text-sm hover:bg-yellow-500" 
                              onClick={() => { setEditing(c); setShowEditor(true); }}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-purple-600 text-white px-2 py-1 rounded text-sm hover:bg-purple-700" 
                              onClick={() => { setTestingCampaignId(c.id!); setShowTestModal(true); }}
                            >
                              Test
                            </button>
                            <button 
                              className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700" 
                              disabled={sending} 
                              onClick={() => { if (typeof c.id === 'number') handleSendCampaign(c.id); }}
                            >
                              Send
                            </button>
                            <button 
                              className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700" 
                              onClick={() => { if (typeof c.id === 'number') handleDelete(c.id); }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {c.status !== 'draft' && (
                          <button className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700" onClick={() => handleViewAnalytics(c)}>View Details</button>
                        )}
                            {showAnalytics && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full relative">
                                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowAnalytics(false)}>&times;</button>
                                  <h2 className="text-xl font-bold mb-2">Campaign Analytics</h2>
                                  {analyticsLoading ? (
                                    <div>Loading analytics...</div>
                                  ) : analyticsError ? (
                                    <div className="text-red-600">{analyticsError}</div>
                                  ) : analytics && analyticsCampaign ? (
                                    <div>
                                      <div className="mb-2"><b>Title:</b> {analyticsCampaign.title}</div>
                                      <div className="mb-2"><b>Subject:</b> {analyticsCampaign.subject_line}</div>
                                      <div className="mb-2"><b>Status:</b> {analyticsCampaign.status}</div>
                                      <div className="mb-2"><b>Sent At:</b> {analyticsCampaign.sent_at || 'N/A'}</div>
                                      <div className="mb-2"><b>Total Recipients:</b> {analytics.total_recipients}</div>
                                      <div className="mb-2"><b>Delivered:</b> {analytics.delivered}</div>
                                      <div className="mb-2"><b>Opened:</b> {analytics.opened} ({analytics.open_rate.toFixed(1)}%)</div>
                                      <div className="mb-2"><b>Clicked:</b> {analytics.clicked} ({analytics.click_rate.toFixed(1)}%)</div>
                                      <div className="mb-2"><b>Bounced:</b> {analytics.bounced} ({analytics.bounce_rate.toFixed(1)}%)</div>
                                      <div className="mb-2"><b>Unsubscribed:</b> {analytics.unsubscribed} ({analytics.unsubscribe_rate.toFixed(1)}%)</div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showTestModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded shadow-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Send Test Email</h2>
                <input
                  type="text"
                  placeholder="email1@example.com, email2@example.com"
                  value={testEmails}
                  onChange={(e) => setTestEmails(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-4"
                />
                <div className="flex gap-2 justify-end">
                  <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => { setShowTestModal(false); setTestingCampaignId(null); }}>Cancel</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={sending} onClick={handleSendTest}>Send Test</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

}
