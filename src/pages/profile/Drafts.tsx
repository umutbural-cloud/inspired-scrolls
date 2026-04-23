import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountLayout } from "@/components/site/AccountLayout";
import { AccountGuard } from "@/components/site/AccountGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { STATUS_LABELS, STATUS_TONES, type Post } from "@/lib/posts";
import { Plus, FileText, MessageSquare } from "lucide-react";

function DraftsInner() {
  const { user } = useAuth();
  const [items, setItems] = useState<Array<Post & { comment_count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user.id)
        .in("status", ["draft", "in_review", "changes_requested"])
        .order("updated_at", { ascending: false });

      const ids = (posts ?? []).map((p) => p.id);
      let counts: Record<string, number> = {};
      if (ids.length) {
        const { data: cmts } = await supabase
          .from("post_comments")
          .select("post_id")
          .in("post_id", ids);
        (cmts ?? []).forEach((c: any) => {
          counts[c.post_id] = (counts[c.post_id] ?? 0) + 1;
        });
      }
      setItems((posts ?? []).map((p) => ({ ...(p as Post), comment_count: counts[p.id] ?? 0 })));
      setLoading(false);
    })();
  }, [user?.id]);

  return (
    <AccountLayout
      eyebrow="Yazılar"
      title="Taslaklarım"
      description="Çalıştığınız ve incelemede bekleyen yazılar."
      actions={
        <Link to="/profil/yaz/yeni">
          <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" /> Yeni yazı</Button>
        </Link>
      }
    >
      {loading ? (
        <div className="text-muted-foreground text-sm py-10">Yükleniyor…</div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-hairline py-16 text-center">
          <FileText className="h-6 w-6 mx-auto text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted-foreground">Henüz taslağınız yok.</p>
          <Link to="/profil/yaz/yeni" className="inline-block mt-4">
            <Button size="sm" variant="outline">İlk yazını oluştur</Button>
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                to={p.status === "changes_requested" ? `/profil/revize/${p.id}` : `/profil/yaz/${p.id}`}
                className="flex items-start justify-between gap-6 py-5 hover:bg-surface-sunken/40 transition-colors px-2 -mx-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg truncate">{p.title || "Başlıksız"}</h3>
                    <Badge variant="outline" className={STATUS_TONES[p.status]}>{STATUS_LABELS[p.status]}</Badge>
                  </div>
                  {p.excerpt && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-1">{p.excerpt}</p>}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(p.updated_at).toLocaleDateString("tr-TR")}</span>
                    <span>·</span>
                    <span>{p.read_minutes} dk</span>
                    {p.comment_count > 0 && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {p.comment_count}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  );
}

export default function Drafts() {
  return <AccountGuard><DraftsInner /></AccountGuard>;
}