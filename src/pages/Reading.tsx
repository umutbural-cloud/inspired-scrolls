import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Bookmark, Heart, Share2, ArrowRight, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArticleCard } from "@/components/site/ArticleCard";
import { findArticle, articles } from "@/data/mock";

const Reading = () => {
  const { slug } = useParams();
  const article = slug ? findArticle(slug) : undefined;
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

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

  if (!article) return <Navigate to="/" replace />;

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
        <p className="mt-6 text-xl md:text-2xl font-serif-body italic text-muted-foreground leading-snug text-balance">
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
              onClick={() => setSaved((v) => !v)}
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
          {article.tags.map((t) => (
            <Link
              key={t}
              to={`/etiket/${t}`}
              className="text-xs px-3 py-1.5 border border-hairline hover:border-accent hover:text-accent transition-colors"
            >
              #{t}
            </Link>
          ))}
        </div>
      </div>

      {/* Yazıyı tamamla */}
      <div className="reading-column px-6 mt-20">
        <div className="border border-hairline p-8 text-center bg-surface-sunken/30">
          <span className="eyebrow text-accent">Yazıyı Tamamla</span>
          <p className="mt-3 font-display text-2xl text-balance">
            Okudukların burada birikiyor
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Sağa kaydır — bu yazıyı tamamladıklarına ekle.
          </p>
          <div className="mt-6 mx-auto max-w-sm h-12 border border-foreground/30 relative overflow-hidden flex items-center px-2 cursor-pointer group hover:border-foreground transition-colors">
            <div className="absolute inset-y-0 left-0 w-12 bg-foreground text-background flex items-center justify-center group-hover:w-full transition-all duration-700 ease-out">
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="ml-16 text-sm text-muted-foreground group-hover:opacity-0 transition-opacity">
              Kaydır ve tamamla
            </span>
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
