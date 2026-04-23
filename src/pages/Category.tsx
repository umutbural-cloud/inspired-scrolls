import { useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArticleCard } from "@/components/site/ArticleCard";
import {
  findCategory,
  articlesByCategory,
  findTag,
  articlesByTag,
} from "@/data/mock";

const sortOptions = [
  { id: "new", label: "En Yeni" },
  { id: "popular", label: "En Çok Okunan" },
  { id: "recommended", label: "Önerilen" },
] as const;

type SortId = (typeof sortOptions)[number]["id"];

const Category = () => {
  const { slug } = useParams();
  const location = useLocation();
  const isTag = location.pathname.startsWith("/etiket/");
  const tag = slug && isTag ? findTag(slug) : undefined;
  const category = slug && !isTag ? findCategory(slug) : undefined;
  const [sort, setSort] = useState<SortId>("new");

  if (isTag && !tag) return <Navigate to="/" replace />;
  if (!isTag && !category) return <Navigate to="/" replace />;

  const list = isTag ? articlesByTag(tag!.slug) : articlesByCategory(category!.slug);
  const sorted = [...list].sort((a, b) => {
    if (sort === "popular") return b.reads - a.reads;
    if (sort === "recommended") return b.readMinutes - a.readMinutes;
    return 0;
  });

  const eyebrow = isTag ? "Etiket" : "Kategori";
  const title = isTag ? `#${tag!.name}` : category!.name;
  const description = isTag
    ? `"${tag!.name}" etiketiyle yayımlanan tüm yazılar.`
    : category!.description;

  return (
    <SiteLayout>
      <section className="border-b border-hairline">
        <div className="content-column px-6 pt-20 pb-16 md:pt-28">
          <span className="eyebrow text-accent">{eyebrow}</span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl tracking-tight">
            {title}
          </h1>
          <p className="mt-6 text-xl font-serif-body italic text-muted-foreground max-w-xl text-balance">
            {description}
          </p>
          <div className="mt-8 text-xs font-mono-jb tracking-wider text-muted-foreground">
            {list.length} YAZI
          </div>
        </div>
      </section>

      <section className="content-column px-6 py-12">
        <div className="flex items-center justify-between mb-10 pb-5 border-b border-hairline">
          <span className="eyebrow">Sırala</span>
          <div className="flex gap-6">
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSort(opt.id)}
                className={`text-sm transition-colors ${
                  sort === opt.id
                    ? "text-foreground border-b border-accent pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="text-muted-foreground italic py-20 text-center">
            Bu kategoride henüz yazı yok.
          </p>
        ) : (
          <div className="space-y-2">
            {sorted.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="minimal" />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Category;
