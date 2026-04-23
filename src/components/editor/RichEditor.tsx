import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import {
  Bold, Italic, Heading2, Heading3, Quote, List, ListOrdered,
  Image as ImageIcon, Link2, Undo2, Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadPostImage } from "@/lib/posts";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type Props = {
  initialContent?: any;
  onChange: (json: any, text: string) => void;
  editable?: boolean;
};

export const RichEditor = ({ initialContent, onChange, editable = true }: Props) => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ HTMLAttributes: { class: "rounded-md my-4" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-accent" } }),
      Placeholder.configure({ placeholder: "Yazınıza buradan başlayın…" }),
    ],
    content: initialContent || "",
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[400px] py-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getText());
    },
  });

  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) return null;

  const handleImage = async (file: File) => {
    if (!user) return;
    try {
      toast.loading("Görsel yükleniyor…", { id: "img" });
      const url = await uploadPostImage(file, user.id);
      editor.chain().focus().setImage({ src: url }).run();
      toast.success("Görsel eklendi", { id: "img" });
    } catch (e: any) {
      toast.error(e.message || "Yükleme başarısız", { id: "img" });
    }
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Bağlantı URL'si", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-hairline">
      {editable && (
        <div className="flex flex-wrap items-center gap-1 border-b border-hairline px-2 py-1.5 bg-surface-sunken/30">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} aria="Kalın"><Bold className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} aria="İtalik"><Italic className="h-3.5 w-3.5" /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} aria="Başlık"><Heading2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} aria="Alt başlık"><Heading3 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} aria="Alıntı"><Quote className="h-3.5 w-3.5" /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} aria="Liste"><List className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} aria="Sıralı liste"><ListOrdered className="h-3.5 w-3.5" /></ToolBtn>
          <Sep />
          <ToolBtn onClick={setLink} active={editor.isActive("link")} aria="Bağlantı"><Link2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => fileRef.current?.click()} active={false} aria="Görsel"><ImageIcon className="h-3.5 w-3.5" /></ToolBtn>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImage(f);
              e.target.value = "";
            }}
          />
          <div className="ml-auto flex items-center gap-1">
            <ToolBtn onClick={() => editor.chain().focus().undo().run()} active={false} aria="Geri al"><Undo2 className="h-3.5 w-3.5" /></ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().redo().run()} active={false} aria="Yinele"><Redo2 className="h-3.5 w-3.5" /></ToolBtn>
          </div>
        </div>
      )}
      <div className="px-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const ToolBtn = ({
  onClick, active, aria, children,
}: { onClick: () => void; active: boolean; aria: string; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={aria}
    title={aria}
    className={`p-1.5 rounded transition-colors ${active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-surface-sunken"}`}
  >
    {children}
  </button>
);

const Sep = () => <span className="w-px h-4 bg-hairline mx-1" />;

export type { Editor };