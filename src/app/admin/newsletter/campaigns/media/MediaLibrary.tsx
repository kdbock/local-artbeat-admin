import React, { useRef, useState } from "react";

export type MediaItem = {
  id: string;
  url: string;
  name: string;
};

const initialMedia: MediaItem[] = [
  {
    id: "sample1",
    url: "https://placekitten.com/200/200",
    name: "Kitten 1",
  },
  {
    id: "sample2",
    url: "https://placekitten.com/300/200",
    name: "Kitten 2",
  },
];

export default function MediaLibrary({ onSelect }: { onSelect: (item: MediaItem) => void }) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // For demo, just create a local URL
    const url = URL.createObjectURL(file);
    setMedia((prev) => [
      ...prev,
      { id: Date.now().toString(), url, name: file.name },
    ]);
  }

  return (
    <div>
      <div className="flex gap-2 mb-2 flex-wrap">
        {media.map((item) => (
          <button
            key={item.id}
            className="border rounded p-1 hover:shadow"
            onClick={() => onSelect(item)}
            title={item.name}
          >
            <img src={item.url} alt={item.name} className="w-16 h-16 object-cover rounded" />
          </button>
        ))}
        <button
          className="border rounded p-1 flex items-center justify-center w-16 h-16 bg-gray-100 hover:bg-gray-200"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Image"
        >
          +
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
