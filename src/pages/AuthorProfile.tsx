import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { findAuthor, articlesByAuthor } from "@/data/mock";

const filters = ["Tümü", "Araştırma", "Kolektif", "Deneme"] as const;

const AuthorProfile = () => {
  const { slug } = useParams();
  const author = slug ? findAuthor(slug) : undefined;
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tümü");
  const [following, setFollowing] = useState(false);

  if (!author) return <Navigate to="/" replace />;

  const all = articlesByAuthor(author.slug);
  const filtered = filter === "Tümü" ? all : all.filter((a) => a.kind === filter);

  return (
    <SiteLayout>
      <section className="border-b border-hairline">
        <div className="content-column px-6 pt-16 pb-14 md:pt-24">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
              <span className="eyebrow text-accent">{author.title}</span>
              <h1 className="mt-3 font-display text-4xl md:text-5xl tracking-tight">
                {author.name}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-foreground/85 max-w-2xl text-pretty">
                {author.longBio}
              </p>
              <button
                onClick={() => setFollowing((v) => !v)}
                className={`mt-7 px-6 py-2.5 text-sm border transition-colors ${
                  following
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                {following ? "Takip ediliyor" : "Takip et"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-hairline">
        <div className="content-column px-6 py-10 grid grid-cols-3 gap-6 text-center">
          <Stat label="Yazı" value={String(author.stats.posts)} />
          <Stat label="Toplam Okuma" value={author.stats.reads} />
          <Stat label="Ort. Okuma Süresi" value={`${author.stats.avgMinutes} dk`} />
        </div>
      </section>

      <section className="content-column px-6 py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10">
          <h2 className="font-display text-3xl">Yayımlanmış Yazılar</h2>
          <div className="flex gap-1 border border-hairline">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-mono-jb tracking-wider transition-colors ${
                  filter === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground italic py-12 text-center">
            Bu kategoride henüz yazı yok.
          </p>
        ) : (
          <ul className="divide-y divide-hairline border-y border-hairline">
            {filtered.map((a) => (
              <li key={a.slug}>
                <Link
                  to={`/yazi/${a.slug}`}
                  className="group flex gap-6 md:gap-8 py-7 items-start"
                >
                  <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 overflow-hidden bg-secondary">
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
                      <span className="text-xs text-muted-foreground">· {a.publishedAt}</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl md:text-[1.65rem] leading-snug group-hover:text-accent transition-colors text-balance">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed text-pretty line-clamp-2">
                      {a.excerpt}
                    </p>
                    <div className="mt-3 text-xs text-muted-foreground font-mono-jb tracking-wider">
                      {a.readMinutes} DK OKUMA
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-display text-3xl md:text-4xl text-accent">{value}</div>
    <div className="mt-1 eyebrow">{label}</div>
  </div>
);

export default AuthorProfile;
