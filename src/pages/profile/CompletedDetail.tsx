import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Highlighter, NotebookPen } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getArticleBySlug } from "@/data/articleStore";

type Highlight = { id: string; text: string; createdAt: number };
type Note = { id: string; text: string; createdAt: number };

const Inner = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !slug) return;
    (async () => {
      const { data } = await supabase
        .from("completed_articles")
        .select("completed_at")
        .eq("user_id", user.id)
        .eq("article_slug", slug)
        .maybeSingle();
      setCompletedAt(data?.completed_at ?? null);
      try {
        const h = JSON.parse(localStorage.getItem(`hl:${slug}`) || "[]");
        const n = JSON.parse(localStorage.getItem(`notes:${slug}`) || "[]");
        setHighlights(Array.isArray(h) ? h : []);
        setNotes(Array.isArray(n) ? n : []);
      } catch {}
      setLoading(false);
    })();
  }, [user, slug]);

  if (!article) return <Navigate to="/profil/tamamlanan" replace />;

  return (
    <AccountLayout
      eyebrow="Tamamlanan Yazı"
      title={article.title}
      description={
        completedAt
          ? `Tamamlandı: ${new Date(completedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}`
          : undefined
      }
      actions={
        <Link
          to="/profil/tamamlanan"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Tamamlananlar
        </Link>
      }
    >
      <div className="surface-card overflow-hidden mb-10">
        <div className="aspect-[16/7] bg-secondary overflow-hidden">
          <img src={article.cover} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-muted-foreground">
            {article.author.name} · {article.readMinutes} dk
          </div>
          <Link
            to={`/yazi/${article.slug}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Yazıyı yeniden aç
          </Link>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Highlighter className="h-4 w-4 text-accent" strokeWidth={2.5} />
          <h2 className="font-display font-bold text-xl">Vurguların ({highlights.length})</h2>
        </div>
        {highlights.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center surface-card">
            Bu yazıda henüz vurgu yapmadın.
          </p>
        ) : (
          <ul className="space-y-3">
            {highlights.map((h) => (
              <li key={h.id} className="surface-card p-4">
                <p className="text-sm leading-relaxed">
                  <span className="user-highlight">{h.text}</span>
                </p>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {new Date(h.createdAt).toLocaleString("tr-TR")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <NotebookPen className="h-4 w-4 text-accent" strokeWidth={2.5} />
          <h2 className="font-display font-bold text-xl">Notların ({notes.length})</h2>
        </div>
        {notes.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center surface-card">
            Bu yazıya henüz not almadın.
          </p>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="surface-card p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{n.text}</p>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString("tr-TR")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AccountLayout>
  );
};

const CompletedDetail = () => (
  <AccountGuard>
    <Inner />
  </AccountGuard>
);

export default CompletedDetail;
