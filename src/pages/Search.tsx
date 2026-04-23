import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles, authors, categories, tags } from "@/data/mock";

type Filter = "tumu" | "yazi" | "yazar" | "kategori" | "etiket";

const filters: { id: Filter; label: string }[] = [
  { id: "tumu", label: "Tümü" },
  { id: "yazi", label: "Yazı" },
  { id: "yazar", label: "Yazar" },
  { id: "kategori", label: "Kategori" },
  { id: "etiket", label: "Etiket" },
];

const norm = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ıİiI]/g, "i");

const Search = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [filter, setFilter] = useState<Filter>("tumu");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (q) next.set("q", q);
      else next.delete("q");
      setParams(next, { replace: true });
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const term = norm(q.trim());

  const results = useMemo(() => {
    if (!term) {
      return {
        articles: [],
        authors: [],
        categories: [],
        tags: [],
      };
    }
    return {
      articles: articles.filter((a) =>
        [a.title, a.subtitle, a.excerpt, a.author.name, a.category, ...a.tags]
          .some((s) => norm(s).includes(term)),
      ),
      authors: authors.filter((a) =>
        [a.name, a.title, a.bio].some((s) => norm(s).includes(term)),
      ),
      categories: categories.filter((c) =>
        [c.name, c.description].some((s) => norm(s).includes(term)),
      ),
      tags: tags.filter((t) => norm(t.name).includes(term)),
    };
  }, [term]);

  const visible = (k: Filter) => filter === "tumu" || filter === k;

  const total =
    results.articles.length +
    results.authors.length +
    results.categories.length +
    results.tags.length;

  const counts = {
    yazi: results.articles.length,
    yazar: results.authors.length,
    kategori: results.categories.length,
    etiket: results.tags.length,
  };

  return (
    <SiteLayout>
      <section className="border-b border-hairline">
        <div className="content-column px-6 pt-16 md:pt-24 pb-10">
          <span className="eyebrow text-accent">Ara</span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight">
            Bir kelime, bir yazar, bir yer.
          </h1>
          <p className="mt-4 text-lg font-serif-body text-muted-foreground max-w-xl">
            Yazıların başlıklarında, yazarlarda, kategorilerde ve etiketlerde ara.
          </p>

          <div className="mt-10 relative">
            <SearchIcon
              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
              strokeWidth={1.5}
            />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQ("");
                } else if (e.key === "Enter" && results.articles[0]) {
                  navigate(`/yazi/${results.articles[0].slug}`);
                }
              }}
              placeholder="ne arıyorsun?"
              className="w-full bg-transparent border-0 border-b-2 border-foreground/30 focus:border-foreground focus:outline-none pl-9 pr-10 py-4 text-2xl md:text-3xl font-display placeholder:text-muted-foreground/50 transition-colors"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Temizle"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {term && (
            <div className="mt-6 text-xs font-mono-jb tracking-wider text-muted-foreground">
              {total > 0 ? `${total} SONUÇ` : "SONUÇ YOK"}
            </div>
          )}
        </div>
      </section>

      {term && (
        <section className="content-column px-6 py-10">
          {/* Filtre */}
          <div className="flex flex-wrap gap-1 border border-hairline mb-12 w-fit">
            {filters.map((f) => {
              const c = f.id === "tumu" ? total : counts[f.id];
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 text-xs font-mono-jb tracking-wider transition-colors ${
                    filter === f.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label.toUpperCase()}{" "}
                  <span className="opacity-60">{c}</span>
                </button>
              );
            })}
          </div>

          {total === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-muted-foreground">
                "{q}" için bir şey bulamadık.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Farklı bir kelime ya da yazar adı dene.
              </p>
            </div>
          )}

          {/* Yazarlar */}
          {visible("yazar") && results.authors.length > 0 && (
            <Block title="Yazarlar" count={results.authors.length}>
              <div className="grid sm:grid-cols-2 gap-6">
                {results.authors.map((a) => (
                  <Link
                    key={a.slug}
                    to={`/yazar/${a.slug}`}
                    className="group flex gap-4 p-5 border border-hairline hover:bg-surface-sunken/60 transition-colors"
                  >
                    <img
                      src={a.avatar}
                      alt={a.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-display text-lg group-hover:text-accent transition-colors">
                        {a.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{a.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {a.bio}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </Block>
          )}

          {/* Kategoriler */}
          {visible("kategori") && results.categories.length > 0 && (
            <Block title="Kategoriler" count={results.categories.length}>
              <div className="grid sm:grid-cols-2 gap-px bg-hairline border border-hairline">
                {results.categories.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/kategori/${c.slug}`}
                    className="bg-background p-5 hover:bg-surface-sunken/60 transition-colors group"
                  >
                    <div className="font-display text-lg group-hover:text-accent transition-colors">
                      {c.name}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {c.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Block>
          )}

          {/* Etiketler */}
          {visible("etiket") && results.tags.length > 0 && (
            <Block title="Etiketler" count={results.tags.length}>
              <div className="flex flex-wrap gap-2">
                {results.tags.map((t) => (
                  <Link
                    key={t.slug}
                    to={`/etiket/${t.slug}`}
                    className="text-sm px-3 py-1.5 border border-hairline hover:border-accent hover:text-accent transition-colors"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            </Block>
          )}

          {/* Yazılar */}
          {visible("yazi") && results.articles.length > 0 && (
            <Block title="Yazılar" count={results.articles.length}>
              <ul className="divide-y divide-hairline border-y border-hairline">
                {results.articles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={`/yazi/${a.slug}`}
                      className="group flex gap-5 py-6 items-start"
                    >
                      <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 overflow-hidden bg-secondary">
                        <img
                          src={a.cover}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3">
                          <span className="eyebrow text-accent">{a.kind}</span>
                          <span className="text-xs text-muted-foreground">
                            · {a.publishedAt}
                          </span>
                        </div>
                        <h3 className="mt-2 font-display text-xl md:text-2xl leading-snug group-hover:text-accent transition-colors text-balance">
                          {a.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                          {a.excerpt}
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {a.author.name} · {a.readMinutes} dk
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </section>
      )}

      {!term && (
        <section className="content-column px-6 py-16">
          <span className="eyebrow text-muted-foreground">Önerilen etiketler</span>
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.slice(0, 14).map((t) => (
              <button
                key={t.slug}
                onClick={() => setQ(t.name)}
                className="text-sm px-3 py-1.5 border border-hairline hover:border-accent hover:text-accent transition-colors"
              >
                #{t.name}
              </button>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
};

const Block = ({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) => (
  <div className="mb-14">
    <div className="flex items-baseline gap-3 mb-5">
      <h2 className="font-display text-2xl">{title}</h2>
      <span className="text-xs font-mono-jb tracking-wider text-muted-foreground">
        {count}
      </span>
    </div>
    {children}
  </div>
);

export default Search;