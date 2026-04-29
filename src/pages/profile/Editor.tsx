import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AccountGuard } from "@/components/site/AccountGuard";
import { RichEditor } from "@/components/editor/RichEditor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  calcReadMinutes, ensureUniqueSlug, slugify, uploadPostImage,
  STATUS_LABELS, STATUS_TONES, type Post,
} from "@/lib/posts";
import { toast } from "sonner";
import { ImagePlus, Loader2, Send, Save, X, ArrowLeft, Settings2 } from "lucide-react";

const CATEGORIES = [
  { slug: "kisisel-gelisim", label: "Kişisel Gelişim" },
  { slug: "uretkenlik", label: "Üretkenlik" },
  { slug: "alıskanlik", label: "Alışkanlık" },
  { slug: "psikoloji", label: "Psikoloji" },
  { slug: "kariyer", label: "Kariyer" },
  { slug: "dusunce", label: "Düşünce" },
];

function EditorPageInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = !id || id === "yeni";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<any>("");
  const [contentText, setContentText] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [tagsInput, setTagsInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const ogInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew || !user) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (!active) return;
      if (error || !data) {
        toast.error("Yazı bulunamadı");
        navigate("/profil/taslaklar");
        return;
      }
      const p = data as Post;
      setPost(p);
      setTitle(p.title);
      setExcerpt(p.excerpt ?? "");
      setContent(p.content);
      setContentText(p.content_text);
      setCoverUrl(p.cover_image_url);
      setCategorySlug(p.category_slug ?? "");
      setTagsInput((p.tags ?? []).join(", "));
      setMetaTitle(p.meta_title ?? "");
      setMetaDescription(p.meta_description ?? "");
      setOgImage(p.og_image_url);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [id, isNew, user, navigate]);

  const tags = useMemo(
    () => tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    [tagsInput],
  );

  const handleUpload = async (file: File, target: "cover" | "og") => {
    if (!user) return;
    try {
      toast.loading("Yükleniyor…", { id: target });
      const url = await uploadPostImage(file, user.id);
      if (target === "cover") setCoverUrl(url); else setOgImage(url);
      toast.success("Yüklendi", { id: target });
    } catch (e: any) {
      toast.error(e.message || "Hata", { id: target });
    }
  };

  const persist = async (status?: "draft" | "in_review"): Promise<Post | null> => {
    if (!user) return null;
    if (!title.trim()) {
      toast.error("Başlık zorunlu");
      return null;
    }
    setSaving(true);
    try {
      const slug = post?.slug ?? (await ensureUniqueSlug(slugify(title), post?.id));
      const payload = {
        author_id: user.id,
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || null,
        content,
        content_text: contentText,
        cover_image_url: coverUrl,
        category_slug: categorySlug || null,
        tags,
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
        og_image_url: ogImage,
        read_minutes: calcReadMinutes(contentText),
        ...(status ? { status } : {}),
      };

      let result: Post;
      if (post) {
        const { data, error } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", post.id)
          .select("*")
          .single();
        if (error) throw error;
        result = data as Post;
      } else {
        const { data, error } = await supabase
          .from("posts")
          .insert(payload)
          .select("*")
          .single();
        if (error) throw error;
        result = data as Post;
        navigate(`/profil/yaz/${result.id}`, { replace: true });
      }
      setPost(result);
      return result;
    } catch (e: any) {
      toast.error(e.message || "Kayıt başarısız");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const onSaveDraft = async () => {
    const r = await persist("draft");
    if (r) toast.success("Taslak kaydedildi");
  };

  const onSubmit = async () => {
    if (!contentText.trim()) {
      toast.error("İçerik boş olamaz");
      return;
    }
    const r = await persist("in_review");
    if (r) toast.success("İncelemeye gönderildi");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const wordCount = contentText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Üst toolbar — minimal */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-hairline">
        <div className="px-4 md:px-6 py-3 flex items-center gap-3">
          <Link
            to="/profil/taslaklar"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Geri</span>
          </Link>

          <div className="flex items-center gap-2 ml-1">
            {post && (
              <Badge variant="outline" className={STATUS_TONES[post.status]}>
                {STATUS_LABELS[post.status]}
              </Badge>
            )}
            <span className="hidden md:inline text-xs text-muted-foreground tabular-nums">
              {wordCount} kelime · ~{calcReadMinutes(contentText)} dk
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSaveDraft} disabled={saving} className="rounded-full">
              {saving ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
              Taslak
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full" aria-label="Yazı ayarları">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-display text-xl">Yazı ayarları</SheetTitle>
                </SheetHeader>
                <div className="space-y-7">
                  {/* Özet */}
                  <section>
                    <Label className="eyebrow mb-2 block">Özet</Label>
                    <Textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Kart önizlemesinde görünür"
                      className="min-h-[70px]"
                    />
                  </section>

                  {/* Kapak */}
                  <section>
                    <Label className="eyebrow mb-2 block">Kapak görseli</Label>
                    {coverUrl ? (
                      <div className="relative group">
                        <img src={coverUrl} alt="" className="w-full aspect-[16/10] object-cover rounded-xl" />
                        <button
                          onClick={() => setCoverUrl(null)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/95 border border-hairline opacity-0 group-hover:opacity-100 transition"
                          aria-label="Kaldır"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        className="w-full aspect-[16/10] border-2 border-dashed border-hairline rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                      >
                        <ImagePlus className="h-5 w-5" strokeWidth={2} />
                        <span className="text-xs font-medium">Kapak yükle</span>
                      </button>
                    )}
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(f, "cover");
                        e.target.value = "";
                      }}
                    />
                  </section>

                  {/* Kategori */}
                  <section>
                    <Label className="eyebrow mb-2 block">Kategori</Label>
                    <select
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value)}
                      className="w-full border border-hairline bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    >
                      <option value="">Seçiniz…</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.label}</option>
                      ))}
                    </select>
                  </section>

                  {/* Etiketler */}
                  <section>
                    <Label className="eyebrow mb-2 block">Etiketler</Label>
                    <Input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="virgülle ayır"
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tags.map((t) => (
                          <Badge key={t} variant="secondary" className="font-normal rounded-full">{t}</Badge>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* SEO */}
                  <section className="space-y-3 pt-2 border-t border-hairline">
                    <Label className="eyebrow block pt-3">SEO</Label>
                    <div>
                      <Label className="text-xs text-muted-foreground">Meta başlık</Label>
                      <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Meta açıklama</Label>
                      <Textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Arama motorlarında görünecek açıklama"
                        className="mt-1 min-h-[60px]"
                        maxLength={160}
                      />
                      <div className="text-[10px] text-muted-foreground mt-1 text-right">{metaDescription.length}/160</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Open Graph görseli</Label>
                      {ogImage ? (
                        <div className="relative group mt-1">
                          <img src={ogImage} alt="" className="w-full aspect-[16/10] object-cover rounded-xl" />
                          <button
                            onClick={() => setOgImage(null)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/95 border border-hairline opacity-0 group-hover:opacity-100 transition"
                            aria-label="Kaldır"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => ogInputRef.current?.click()}
                          className="mt-1 w-full aspect-[16/10] border-2 border-dashed border-hairline rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                        >
                          <ImagePlus className="h-5 w-5" strokeWidth={2} />
                          <span className="text-xs font-medium">OG görseli yükle</span>
                        </button>
                      )}
                      <input
                        ref={ogInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(f, "og");
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </section>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              size="sm"
              onClick={onSubmit}
              disabled={saving}
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent-glow"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" /> Gönder
            </Button>
          </div>
        </div>
      </header>

      {/* Yazma alanı — geniş, ortalanmış, sade */}
      <main className="flex-1 px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Başlık"
            className="text-3xl md:text-5xl font-display font-extrabold tracking-[-0.03em] border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-2 placeholder:text-muted-foreground/40 leading-tight bg-transparent shadow-none"
          />
          <div className="mt-6">
            <RichEditor
              initialContent={content}
              onChange={(json, text) => {
                setContent(json);
                setContentText(text);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EditorPage() {
  return (
    <AccountGuard>
      <EditorPageInner />
    </AccountGuard>
  );
}