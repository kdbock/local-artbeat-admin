"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

type TipTapEditorProps = {
  initialContent?: string;
  onChange?: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
};

export default function TipTapEditor({ initialContent = "", onChange, onImageUpload }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
      Placeholder.configure({
        placeholder: "Start writing your email content here...",
      }),
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const addImage = async (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const url = await onImageUpload(file);
      addImage(url);
    }
  };

  return (
    <div className="border rounded-lg bg-white">
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded ${editor.isActive("strike") ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        <div className="border-l mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive("heading", { level: 1 }) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Heading 1"
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Heading 2"
        >
          H2
        </button>

        <div className="border-l mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${editor.isActive("bulletList") ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${editor.isActive("orderedList") ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Ordered List"
        >
          1. List
        </button>

        <div className="border-l mx-1" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Align Left"
        >
          ⬅
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Align Center"
        >
          ⬍
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Align Right"
        >
          ⬎
        </button>

        <div className="border-l mx-1" />

        <div className="relative">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => document.getElementById("image-upload")?.click()}
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
            title="Insert Image"
          >
            🖼
          </button>
        </div>

        <div className="border-l mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded ${editor.isActive("codeBlock") ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Code Block"
        >
          &lt;/&gt;
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${editor.isActive("blockquote") ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          title="Quote"
        >
          &quot;
        </button>

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
          title="Horizontal Rule"
        >
          ―
        </button>

        <div className="border-l mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          title="Undo"
        >
          ↶
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          title="Redo"
        >
          ↷
        </button>
      </div>

      <div className="p-4 prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
