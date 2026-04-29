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
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-6 w-full" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-accent" } }),
      Placeholder.configure({ placeholder: "Yazmaya başla…" }),
    ],
    content: initialContent || "",
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[60vh] text-lg leading-relaxed",
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
    <div className="relative">
      {/* Sade floating toolbar — sayfa altında ortalanmış pill */}
      {editable && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 bg-foreground/95 backdrop-blur text-background rounded-full px-2 py-1.5 shadow-xl">
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
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} active={false} aria="Geri al"><Undo2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} active={false} aria="Yinele"><Redo2 className="h-3.5 w-3.5" /></ToolBtn>
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
        </div>
      )}

      <EditorContent editor={editor} />
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
    className={`p-2 rounded-full transition-colors ${active ? "bg-accent text-accent-foreground" : "text-background/80 hover:text-background hover:bg-background/10"}`}
  >
    {children}
  </button>
);

const Sep = () => <span className="w-px h-4 bg-background/20 mx-0.5" />;

export type { Editor };