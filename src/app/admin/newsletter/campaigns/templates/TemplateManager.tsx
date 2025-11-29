import React, { useState } from "react";

export type Template = {
  id: string;
  name: string;
  html: string;
};

const initialTemplates: Template[] = [
  {
    id: "welcome",
    name: "Welcome Template",
    html: "<h2>Welcome to our newsletter!</h2><p>We're glad you're here.</p>",
  },
  {
    id: "promo",
    name: "Promo Template",
    html: "<h2>Special Offer</h2><p>Don't miss our latest promotion!</p>",
  },
];

export default function TemplateManager({ onSelect }: { onSelect: (template: Template) => void }) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [name, setName] = useState("");
  const [html, setHtml] = useState("");

  function handleAdd() {
    if (!name || !html) return;
    setTemplates((prev) => [
      ...prev,
      { id: Date.now().toString(), name, html },
    ]);
    setName("");
    setHtml("");
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="font-bold mb-2">Templates</div>
        <ul className="space-y-1">
          {templates.map((tpl) => (
            <li key={tpl.id}>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => onSelect(tpl)}
              >
                {tpl.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-bold mb-1">Add New Template</div>
        <input
          className="border p-1 rounded w-full mb-1"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="border p-1 rounded w-full mb-1"
          placeholder="HTML Content"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={3}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={handleAdd}
        >
          Add Template
        </button>
      </div>
    </div>
  );
}
