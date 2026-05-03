import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getArticleBySlug } from "@/data/articleStore";

type Row = { article_slug: string; completed_at: string; read_minutes: number };

const CompletedInner = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("completed_articles")
        .select("article_slug, completed_at, read_minutes")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      setRows(data ?? []);
      setLoading(false);
    })();
  }, [user]);

  // Tarihe göre grupla (gün)
  const groups = rows.reduce<Record<string, Row[]>>((acc, r) => {
    const key = new Date(r.completed_at).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    (acc[key] ??= []).push(r);
    return acc;
  }, {});

  return (
    <AccountLayout
      eyebrow="Okuma Odası"
      title="Tamamladığım Yazılar"
      description="Sonuna kadar okudukların kronolojik olarak burada birikir."
    >
      {loading ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
        </div>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center border-y border-hairline">
          Henüz tamamladığın bir yazı yok.
        </p>
      ) : (
        <div className="space-y-12">
          {Object.entries(groups).map(([date, list]) => (
            <section key={date}>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="eyebrow font-mono-jb">{date.toUpperCase()}</span>
                <span className="h-px flex-1 bg-hairline" />
                <span className="text-xs text-muted-foreground font-mono-jb">
                  {list.length} YAZI
                </span>
              </div>
              <ul className="divide-y divide-hairline border-y border-hairline">
                {list.map((r) => {
                  const a = getArticleBySlug(r.article_slug);
                  if (!a) return null;
                  return (
                    <li key={r.article_slug}>
                      <Link
                        to={`/profil/tamamlanan/${a.slug}`}
                        className="group flex gap-5 py-5 items-start"
                      >
                        <div className="w-20 h-20 shrink-0 overflow-hidden bg-secondary">
                          <img src={a.cover} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="eyebrow text-accent">{a.kind}</span>
                          <h3 className="mt-1 font-display text-xl leading-snug group-hover:text-accent transition-colors text-balance">
                            {a.title}
                          </h3>
                          <div className="mt-1.5 text-xs text-muted-foreground">
                            {a.author.name} · {r.read_minutes} dk
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

const Completed = () => (
  <AccountGuard>
    <CompletedInner />
  </AccountGuard>
);

export default Completed;