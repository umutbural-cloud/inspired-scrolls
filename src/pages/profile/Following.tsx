import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { authors, articlesByAuthor, findAuthor } from "@/data/mock";

const FollowingInner = () => {
  const { user } = useAuth();
  const [followed, setFollowed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("author_follows")
        .select("author_slug")
        .eq("user_id", user.id);
      setFollowed((data ?? []).map((d) => d.author_slug));
      setLoading(false);
    })();
  }, [user]);

  const followedAuthors = followed
    .map((slug) => findAuthor(slug))
    .filter((a): a is (typeof authors)[number] => Boolean(a));

  // Akış: takip edilen yazarların yazıları, tarihe göre
  const feed = followedAuthors.flatMap((a) => articlesByAuthor(a.slug));

  return (
    <AccountLayout
      eyebrow="Okuma Odası"
      title="Takip Ettiklerim"
      description="Takip ettiğin yazarların son yazılarının akışı."
    >
      {loading ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
        </div>
      ) : followedAuthors.length === 0 ? (
        <div className="border-y border-hairline py-14 text-center">
          <p className="text-muted-foreground italic">
            Henüz kimseyi takip etmiyorsun.
          </p>
          <Link
            to="/yazar/elif-yildirim"
            className="mt-5 inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            Bir yazar profili keşfet
          </Link>
        </div>
      ) : (
        <>
          {/* Takip edilen yazarlar */}
          <section className="mb-12">
            <div className="eyebrow mb-4">Yazarlar · {followedAuthors.length}</div>
            <ul className="flex flex-wrap gap-3">
              {followedAuthors.map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`/yazar/${a.slug}`}
                    className="flex items-center gap-3 border border-hairline px-3 py-2 hover:border-foreground transition-colors"
                  >
                    <img src={a.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div className="text-sm">
                      <div className="leading-tight">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.title}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Akış */}
          <section>
            <div className="eyebrow mb-4">Son Yazılar</div>
            <ul className="divide-y divide-hairline border-y border-hairline">
              {feed.map((a) => (
                <li key={a.slug}>
                  <Link to={`/yazi/${a.slug}`} className="group flex gap-5 py-5 items-start">
                    <div className="w-24 h-24 shrink-0 overflow-hidden bg-secondary">
                      <img src={a.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="eyebrow text-accent">{a.kind}</span>
                      <h3 className="mt-1 font-display text-xl leading-snug group-hover:text-accent transition-colors text-balance">
                        {a.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                        {a.excerpt}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {a.author.name} · {a.publishedAt} · {a.readMinutes} dk
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </AccountLayout>
  );
};

const Following = () => (
  <AccountGuard>
    <FollowingInner />
  </AccountGuard>
);

export default Following;