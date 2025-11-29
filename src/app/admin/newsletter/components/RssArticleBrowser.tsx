import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RssFeed {
  id: number;
  name: string;
}

interface RssArticle {
  id: number;
  title: string;
  url: string;
  summary: string;
  published_at: string;
}

interface Props {
  onInsert: (article: RssArticle) => void;
}

export default function RssArticleBrowser({ onInsert }: Props) {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<number | null>(null);
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/admin/rss-feeds').then(res => setFeeds(res.data));
  }, []);

  useEffect(() => {
    if (selectedFeed) {
      Promise.resolve().then(() => setLoading(true));
      axios.get(`/api/admin/rss-feeds/${selectedFeed}/articles`).then(res => {
        setArticles(res.data);
        setLoading(false);
      });
    } else {
      Promise.resolve().then(() => setArticles([]));
    }
  }, [selectedFeed]);

  return (
    <div>
      <h3 className="font-bold mb-2">Insert RSS Article</h3>
      <select
        className="border px-2 py-1 rounded mb-2"
        value={selectedFeed ?? ''}
        onChange={e => setSelectedFeed(Number(e.target.value) || null)}
      >
        <option value="">Select Feed...</option>
        {feeds.map(feed => (
          <option key={feed.id} value={feed.id}>{feed.name}</option>
        ))}
      </select>
      {loading ? (
        <div>Loading articles...</div>
      ) : (
        <ul className="max-h-64 overflow-y-auto border rounded p-2 bg-gray-50">
          {articles.map(article => (
            <li key={article.id} className="mb-2 border-b pb-2 last:border-b-0">
              <div className="font-semibold">{article.title}</div>
              <div className="text-xs text-gray-500 mb-1">{new Date(article.published_at).toLocaleString()}</div>
              <div className="text-sm mb-1">{article.summary?.slice(0, 120)}{article.summary?.length > 120 ? '...' : ''}</div>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">View Original</a>
              <button
                className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs"
                onClick={() => onInsert(article)}
              >Insert</button>
            </li>
          ))}
          {selectedFeed && articles.length === 0 && !loading && (
            <li className="text-gray-500">No articles found for this feed.</li>
          )}
        </ul>
      )}
    </div>
  );
}
