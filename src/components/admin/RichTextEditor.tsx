"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  label,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[160px] px-3 py-2 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-stone-700">{label}</label>
      )}
      <div className="overflow-hidden rounded-lg border border-stone-300 bg-white">
        <div className="flex flex-wrap gap-1 border-b border-stone-200 bg-stone-50 px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            label="B"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            label="I"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            label="H2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            label="• List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            label="1. List"
          />
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  label,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-stone-800 text-white"
          : "text-stone-600 hover:bg-stone-200"
      }`}
    >
      {label}
    </button>
  );
}
