import { useEffect, useRef, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Bookmark, Heart, Share2, ArrowRight, ArrowLeft, Check } from "lucide-react";
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
  }, [user, article?.slug]);

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

  return (
    <SiteLayout>
      {/* İlerleme çubuğu */}
      <div
        className="fixed top-0 left-0 right-0 h-px z-50 bg-accent origin-left"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden
      />

      {/* Üst meta */}
      <div className="reading-column px-6 pt-16 md:pt-24">
        <Link
          to={`/kategori/${article.categorySlug}`}
          className="eyebrow text-accent link-quiet"
        >
          {article.category} · {article.kind}
        </Link>
        <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
          {article.title}
        </h1>
        <p className="mt-6 text-xl md:text-2xl font-serif-body text-muted-foreground leading-snug text-balance">
          {article.subtitle}
        </p>

        <div className="mt-10 flex items-center justify-between flex-wrap gap-4 pb-10 border-b border-hairline">
          <Link to={`/yazar/${article.author.slug}`} className="flex items-center gap-3 group">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover"
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked((v) => !v)}
              className={`p-2.5 border border-hairline transition-colors ${
                liked ? "bg-accent text-accent-foreground border-accent" : "hover:bg-surface-sunken"
              }`}
              aria-label="Beğen"
            >
              <Heart className="h-4 w-4" strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={toggleSave}
              className={`p-2.5 border border-hairline transition-colors ${
                saved ? "bg-foreground text-background border-foreground" : "hover:bg-surface-sunken"
              }`}
              aria-label="Kaydet"
            >
              <Bookmark className="h-4 w-4" strokeWidth={1.5} fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              className="p-2.5 border border-hairline hover:bg-surface-sunken transition-colors"
              aria-label="Paylaş"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Kapak görseli */}
      <figure className="content-column px-0 md:px-6 mt-10">
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
      <div className="reading-column px-6 mt-14">
        <details className="group border-y border-hairline py-5" open>
          <summary className="cursor-pointer flex items-center justify-between list-none">
            <span className="eyebrow">İçindekiler</span>
            <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <ol className="mt-4 space-y-2">
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
      <article className="reading-column px-6 mt-14 prose-reading">
        {article.body.map((p, i) => (
          <p key={i} className={i === 0 ? "drop-cap" : ""}>
            {p}
          </p>
        ))}
        <h2 id="ii">II — Sayfanın geometrisi</h2>
        <p>{article.body[1]}</p>
        <blockquote>
          "Bir kelimeyi anlamak için, onun etrafında dönülen mesafeyi yürümek
          gerekir." — Maurice Blanchot
        </blockquote>
        <p>{article.body[2]}</p>
        <h2 id="iii">III — Sonuç</h2>
        <p>{article.body[3]}</p>
      </article>

      {/* Etiketler */}
      <div className="reading-column px-6 mt-16">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((t) => {
            const slug = allTags.find((x) => x.name === t)?.slug ?? t;
            return (
              <Link
                key={t}
                to={`/etiket/${slug}`}
                className="text-xs px-3 py-1.5 border border-hairline hover:border-accent hover:text-accent transition-colors"
              >
                #{t}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Yazıyı tamamla */}
      <div className="reading-column px-6 mt-20">
        <div className="border border-hairline p-8 text-center bg-surface-sunken/30">
          <span className="eyebrow text-accent">{completed ? "Tamamlandı" : "Yazıyı Tamamla"}</span>
          <p className="mt-3 font-display text-2xl text-balance">
            {completed ? "Bu yazı arşivine eklendi" : "Okudukların burada birikiyor"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {completed
              ? "Tamamladığın yazılar profilinde görünür."
              : "Tutamacı sağa sürükle — bu yazıyı tamamladıklarına ekle."}
          </p>

          <div
            ref={trackRef}
            className={`mt-6 mx-auto max-w-sm h-12 border relative overflow-hidden select-none touch-none ${
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
      <div className="reading-column px-6 mt-20 pt-10 border-t border-hairline">
        <Link to={`/yazar/${article.author.slug}`} className="flex gap-5 items-start group">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
          <div>
            <span className="eyebrow">Yazar</span>
            <div className="font-display text-xl mt-1 group-hover:text-accent transition-colors">
              {article.author.name}
            </div>
            <p className="mt-2 text-muted-foreground leading-relaxed">{article.author.bio}</p>
            <span className="inline-flex items-center gap-2 mt-3 text-sm border-b border-foreground/40 pb-0.5 group-hover:border-accent group-hover:text-accent transition-colors">
              Yazarın profili <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      </div>

      {/* Önerilenler */}
      <section className="wide-column px-6 mt-24 pt-12 border-t border-hairline">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-3xl">Devam Etmek İçin</h2>
          <Link to="/" className="text-sm link-quiet text-muted-foreground inline-flex items-center gap-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Ana sayfa
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-x-10 gap-y-12 pb-16">
          {recommended.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Reading;
