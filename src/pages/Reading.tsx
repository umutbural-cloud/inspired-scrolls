import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Bookmark, Heart, Share2, ArrowRight, ArrowLeft, Check, Highlighter, Trash2, NotebookPen, Plus } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArticleCard } from "@/components/site/ArticleCard";
import { findArticle, articles, tags as allTags } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Reading = () => {
  const { slug } = useParams();
  const article = slug ? findArticle(slug) : undefined;
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [drag, setDrag] = useState(0); // 0..1
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startDragRef = useRef(0);

  // Highlights (kullanıcı seçimleri)
  type Highlight = { id: string; text: string; createdAt: number };
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectionRect, setSelectionRect] = useState<{ x: number; y: number } | null>(null);
  const [pendingSelection, setPendingSelection] = useState<string>("");
  const articleRef = useRef<HTMLElement>(null);

  // Notlar
  type Note = { id: string; text: string; createdAt: number };
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteDraft, setNoteDraft] = useState("");

  const hlKey = useMemo(() => (article ? `hl:${article.slug}` : ""), [article?.slug]);
  const noteKey = useMemo(() => (article ? `notes:${article.slug}` : ""), [article?.slug]);

  // Local storage'tan yükle
  useEffect(() => {
    if (!hlKey) return;
    try {
      const h = JSON.parse(localStorage.getItem(hlKey) || "[]");
      const n = JSON.parse(localStorage.getItem(noteKey) || "[]");
      setHighlights(Array.isArray(h) ? h : []);
      setNotes(Array.isArray(n) ? n : []);
    } catch {
      setHighlights([]);
      setNotes([]);
    }
  }, [hlKey, noteKey]);

  const persistHighlights = (next: Highlight[]) => {
    setHighlights(next);
    if (hlKey) localStorage.setItem(hlKey, JSON.stringify(next));
  };
  const persistNotes = (next: Note[]) => {
    setNotes(next);
    if (noteKey) localStorage.setItem(noteKey, JSON.stringify(next));
  };

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  // Metin seçimi → highlight popover
  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setSelectionRect(null);
        setPendingSelection("");
        return;
      }
      const text = sel.toString().trim();
      if (text.length < 3) {
        setSelectionRect(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const container = articleRef.current;
      if (!container) return;
      // Sadece makale içindeki seçimler
      if (!container.contains(range.commonAncestorContainer)) {
        setSelectionRect(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      setPendingSelection(text);
      setSelectionRect({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY,
      });
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const addHighlightFromSelection = () => {
    if (!pendingSelection) return;
    const next: Highlight = {
      id: `${Date.now()}`,
      text: pendingSelection,
      createdAt: Date.now(),
    };
    persistHighlights([next, ...highlights]);
    window.getSelection()?.removeAllRanges();
    setSelectionRect(null);
    setPendingSelection("");
    toast.success("Vurgulandı");
  };

  const removeHighlight = (id: string) => {
    persistHighlights(highlights.filter((h) => h.id !== id));
  };

  const addNote = () => {
    const v = noteDraft.trim();
    if (!v) return;
    persistNotes([{ id: `${Date.now()}`, text: v, createdAt: Date.now() }, ...notes]);
    setNoteDraft("");
  };
  const removeNote = (id: string) => {
    persistNotes(notes.filter((n) => n.id !== id));
  };

  // İlk yüklemede tamamlandı + kaydedildi durumunu çek
  useEffect(() => {
    if (!user || !article) return;
    let cancelled = false;
    (async () => {
      const [{ data: c }, { data: defList }] = await Promise.all([
        supabase
          .from("completed_articles")
          .select("article_slug")
          .eq("user_id", user.id)
          .eq("article_slug", article!.slug)
          .maybeSingle(),
        supabase
          .from("reading_lists")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      if (c) {
        setCompleted(true);
        setDrag(1);
      }
      if (defList) {
        const { data: it } = await supabase
          .from("reading_list_items")
          .select("article_slug")
          .eq("list_id", defList.id)
          .eq("article_slug", article!.slug)
          .maybeSingle();
        if (!cancelled && it) setSaved(true);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, article?.slug]);

  if (!article) return <Navigate to="/" replace />;

  const persistComplete = async () => {
    if (!user || !article) {
      toast("Tamamlanan yazıları kaydetmek için giriş yap.");
      return;
    }
    const { error } = await supabase
      .from("completed_articles")
      .upsert({
        user_id: user.id,
        article_slug: article.slug,
        read_minutes: article.readMinutes,
      });
    if (error) toast.error(error.message);
    else toast.success("Tamamladıklarına eklendi.");
  };

  const toggleSave = async () => {
    if (!user || !article) {
      toast("Yazıyı kaydetmek için giriş yap.");
      return;
    }
    const { data: defList } = await supabase
      .from("reading_lists")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .maybeSingle();
    if (!defList) return;
    if (saved) {
      setSaved(false);
      await supabase
        .from("reading_list_items")
        .delete()
        .eq("list_id", defList.id)
        .eq("article_slug", article.slug);
    } else {
      setSaved(true);
      const { error } = await supabase
        .from("reading_list_items")
        .insert({ list_id: defList.id, article_slug: article.slug });
      if (error) {
        setSaved(false);
        toast.error(error.message);
      } else {
        toast.success("Kaydettiklerime eklendi.");
      }
    }
  };

  const HANDLE = 48; // px

  const beginDrag = (clientX: number) => {
    if (completed) return;
    draggingRef.current = true;
    startXRef.current = clientX;
    startDragRef.current = drag;
  };
  const moveDrag = (clientX: number) => {
    if (!draggingRef.current || !trackRef.current) return;
    const trackW = trackRef.current.clientWidth;
    const maxPx = trackW - HANDLE;
    const deltaPx = (clientX - startXRef.current) + startDragRef.current * maxPx;
    const next = Math.max(0, Math.min(1, deltaPx / maxPx));
    setDrag(next);
  };
  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (drag > 0.92) {
      setDrag(1);
      if (!completed) {
        setCompleted(true);
        persistComplete();
      }
    } else {
      setDrag(0);
    }
  };

  const recommended = articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  // Bir paragraf içindeki tüm highlight metinlerini <mark> ile sarmala
  const renderWithHighlights = (text: string, key: string) => {
    if (highlights.length === 0) return text;
    // Uzun olanı önce işaretle (overlap'i azaltmak için)
    const sorted = [...highlights].sort((a, b) => b.text.length - a.text.length);
    const escaped = sorted.map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`(${escaped.join("|")})`, "g");
    const parts = text.split(re);
    return parts.map((p, i) => {
      const match = sorted.find((h) => h.text === p);
      if (match) {
        return (
          <mark key={`${key}-${i}`} className="user-highlight" data-hl-id={match.id}>
            {p}
          </mark>
        );
      }
      return <span key={`${key}-${i}`}>{p}</span>;
    });
  };

  return (
    <SiteLayout>
      {/* İlerleme çubuğu */}
      <div
        className="fixed top-0 left-0 right-0 h-px z-50 bg-accent origin-left"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden
      />

      {/* Üst meta */}
      <div className="reading-column px-6 pt-10 md:pt-16">
        <Link
          to={`/kategori/${article.categorySlug}`}
          className="eyebrow text-accent link-quiet"
        >
          {article.category} · {article.kind}
        </Link>
        <h1 className="mt-4 font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
          {article.title}
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-muted-foreground leading-snug text-balance">
          {article.subtitle}
        </p>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-hairline">
          <Link to={`/yazar/${article.author.slug}`} className="flex items-center gap-3 group">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-medium group-hover:text-accent transition-colors">
                {article.author.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {article.publishedAt} · {article.readMinutes} dakika okuma
              </div>
            </div>
          </Link>

          <button
            className="p-2 border border-hairline hover:bg-surface-sunken transition-colors rounded-md"
            aria-label="Paylaş"
          >
            <Share2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Kapak görseli */}
      <figure className="content-column px-0 md:px-6 mt-6">
        <div className="aspect-[16/9] overflow-hidden bg-secondary">
          <img
            src={article.cover}
            alt={article.title}
            width={1600}
            height={900}
            className="w-full h-full object-cover"
          />
        </div>
      </figure>

      {/* İçindekiler */}
      <div className="reading-column px-6 mt-8">
        <details className="group border-y border-hairline py-4">
          <summary className="cursor-pointer flex items-center justify-between list-none">
            <span className="eyebrow">İçindekiler</span>
            <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <ol className="mt-3 space-y-1.5">
            {article.toc.map((t) => (
              <li key={t.id} className="text-sm">
                <a href={`#${t.id}`} className="text-muted-foreground hover:text-accent transition-colors">
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </details>
      </div>

      {/* İçerik */}
      <article ref={articleRef} className="reading-column px-6 mt-8 prose-reading">
        {article.body.map((p, i) => (
          <p key={i} className={i === 0 ? "first-letter:font-display first-letter:text-foreground text-lg" : ""}>
            {renderWithHighlights(p, `p-${i}`)}
          </p>
        ))}
        <h2 id="ii">II — Sayfanın geometrisi</h2>
        <p>{renderWithHighlights(article.body[1], "p-ii")}</p>
        <blockquote>
          "Bir kelimeyi anlamak için, onun etrafında dönülen mesafeyi yürümek
          gerekir." — Maurice Blanchot
        </blockquote>
        <p>{renderWithHighlights(article.body[2], "p-bq")}</p>
        <h2 id="iii">III — Sonuç</h2>
        <p>{renderWithHighlights(article.body[3], "p-iii")}</p>
      </article>

      {/* Seçim popover'ı — vurgula */}
      {selectionRect && (
        <button
          type="button"
          onMouseDown={(e) => {
            // mousedown ile seçimi kaybetmeden yakala
            e.preventDefault();
            addHighlightFromSelection();
          }}
          className="fixed z-50 inline-flex items-center gap-1.5 px-3 h-9 bg-foreground text-background text-xs font-medium rounded-md shadow-lg hover:bg-foreground/90 transition-colors"
          style={{
            left: selectionRect.x,
            top: selectionRect.y - 44,
            transform: "translateX(-50%)",
            position: "absolute",
          }}
        >
          <Highlighter className="h-3.5 w-3.5" strokeWidth={1.5} />
          Vurgula
        </button>
      )}

      {/* Etiketler */}
      <div className="reading-column px-6 mt-10">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((t) => {
            const slug = allTags.find((x) => x.name === t)?.slug ?? t;
            return (
              <Link
                key={t}
                to={`/etiket/${slug}`}
                className="text-xs px-3 py-1.5 border border-hairline hover:border-accent hover:text-accent transition-colors rounded-md"
              >
                #{t}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Aksiyon barı — Beğen / Kaydet / Paylaş */}
      <div className="reading-column px-6 mt-10">
        <div className="flex items-center justify-center gap-3 py-5 border-y border-hairline">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 h-10 border rounded-md text-sm transition-colors ${
              liked
                ? "bg-accent text-accent-foreground border-accent"
                : "border-hairline hover:bg-surface-sunken"
            }`}
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
            {liked ? "Beğenildi" : "Beğen"}
          </button>
          <button
            onClick={toggleSave}
            className={`inline-flex items-center gap-2 px-4 h-10 border rounded-md text-sm transition-colors ${
              saved
                ? "bg-foreground text-background border-foreground"
                : "border-hairline hover:bg-surface-sunken"
            }`}
          >
            <Bookmark className="h-4 w-4" strokeWidth={1.5} fill={saved ? "currentColor" : "none"} />
            {saved ? "Kaydedildi" : "Kaydet"}
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 h-10 border border-hairline rounded-md text-sm hover:bg-surface-sunken transition-colors"
            aria-label="Paylaş"
          >
            <Share2 className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Paylaş</span>
          </button>
        </div>
      </div>

      {/* Vurgular paneli */}
      {highlights.length > 0 && (
        <div className="reading-column px-6 mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Highlighter className="h-4 w-4 text-accent" strokeWidth={1.5} />
            <span className="eyebrow">Vurguların ({highlights.length})</span>
          </div>
          <ul className="space-y-2">
            {highlights.map((h) => (
              <li
                key={h.id}
                className="group flex items-start gap-3 p-3 border border-hairline rounded-md bg-surface-sunken/30"
              >
                <span className="flex-1 text-sm leading-relaxed text-foreground/90">
                  <span className="bg-accent/20 px-1 rounded-sm">{h.text}</span>
                </span>
                <button
                  onClick={() => removeHighlight(h.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
                  aria-label="Vurguyu sil"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notlar */}
      <div className="reading-column px-6 mt-10">
        <div className="flex items-center gap-2 mb-4">
          <NotebookPen className="h-4 w-4 text-accent" strokeWidth={1.5} />
          <span className="eyebrow">Notların ({notes.length})</span>
        </div>
        <div className="border border-hairline rounded-md p-3 bg-background">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Bu yazı için bir not yaz…"
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-sm leading-relaxed placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-hairline">
            <span className="text-xs text-muted-foreground">
              Notların yalnızca bu cihazda saklanır.
            </span>
            <button
              onClick={addNote}
              disabled={!noteDraft.trim()}
              className="inline-flex items-center gap-1.5 px-3 h-8 bg-foreground text-background rounded-md text-xs font-medium disabled:opacity-40 hover:bg-foreground/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Not ekle
            </button>
          </div>
        </div>
        {notes.length > 0 && (
          <ul className="mt-4 space-y-2">
            {notes.map((n) => (
              <li
                key={n.id}
                className="group flex items-start gap-3 p-3 border border-hairline rounded-md"
              >
                <p className="flex-1 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {n.text}
                </p>
                <button
                  onClick={() => removeNote(n.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
                  aria-label="Notu sil"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Yazıyı tamamla */}
      <div className="reading-column px-6 mt-10">
        <div className="border border-hairline rounded-md p-6 text-center bg-surface-sunken/30">
          <span className="eyebrow text-accent">{completed ? "Tamamlandı" : "Yazıyı Tamamla"}</span>
          <p className="mt-2 font-display text-xl md:text-2xl text-balance">
            {completed ? "Bu yazı arşivine eklendi" : "Okudukların burada birikiyor"}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {completed
              ? "Tamamladığın yazılar profilinde görünür."
              : "Tutamacı sağa sürükle — bu yazıyı tamamladıklarına ekle."}
          </p>

          <div
            ref={trackRef}
            className={`mt-5 mx-auto max-w-sm h-12 border rounded-md relative overflow-hidden select-none touch-none ${
              completed ? "border-accent bg-accent/10" : "border-foreground/30"
            }`}
            onPointerMove={(e) => moveDrag(e.clientX)}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              className="absolute inset-y-0 left-0 bg-foreground/8"
              style={{
                width: `calc(${HANDLE}px + (100% - ${HANDLE}px) * ${drag})`,
                transition: draggingRef.current ? "none" : "width 250ms ease-out",
              }}
              aria-hidden
            />
            <span
              className={`absolute inset-0 flex items-center justify-center text-sm pointer-events-none transition-opacity ${
                completed ? "opacity-0" : ""
              }`}
              style={{ opacity: 1 - drag }}
            >
              <span className="ml-12 text-muted-foreground">Kaydır ve tamamla</span>
            </span>
            {completed && (
              <span className="absolute inset-0 flex items-center justify-center text-sm font-mono-jb tracking-wider text-accent">
                <Check className="h-4 w-4 mr-2" strokeWidth={2} /> TAMAMLANDI
              </span>
            )}
            <button
              type="button"
              aria-label="Kaydır ve tamamla"
              disabled={completed}
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                beginDrag(e.clientX);
              }}
              className={`absolute top-0 bottom-0 flex items-center justify-center text-background ${
                completed ? "bg-accent cursor-default" : "bg-foreground cursor-grab active:cursor-grabbing"
              }`}
              style={{
                width: `${HANDLE}px`,
                left: `calc((100% - ${HANDLE}px) * ${drag})`,
                transition: draggingRef.current ? "none" : "left 250ms ease-out",
              }}
            >
              {completed ? <Check className="h-4 w-4" strokeWidth={2} /> : <ArrowRight className="h-4 w-4" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Yazar kartı */}
      <div className="reading-column px-6 mt-12 pt-8 border-t border-hairline">
        <Link to={`/yazar/${article.author.slug}`} className="flex gap-5 items-start group">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shrink-0"
          />
          <div>
            <span className="eyebrow">Yazar</span>
            <div className="font-display text-lg md:text-xl mt-1 group-hover:text-accent transition-colors">
              {article.author.name}
            </div>
            <p className="mt-1.5 text-sm md:text-base text-muted-foreground leading-relaxed">{article.author.bio}</p>
            <span className="inline-flex items-center gap-2 mt-2.5 text-sm border-b border-foreground/40 pb-0.5 group-hover:border-accent group-hover:text-accent transition-colors">
              Yazarın profili <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      </div>

      {/* Önerilenler */}
      <section className="wide-column px-6 mt-12 md:mt-16 pt-8 border-t border-hairline">
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2 className="font-display text-2xl md:text-3xl">Devam Etmek İçin</h2>
          <Link to="/" className="text-sm link-quiet text-muted-foreground inline-flex items-center gap-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Ana sayfa
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-x-10 gap-y-10 pb-12">
          {recommended.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Reading;
