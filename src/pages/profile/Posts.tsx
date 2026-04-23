import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountLayout } from "@/components/site/AccountLayout";
import { AccountGuard } from "@/components/site/AccountGuard";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { STATUS_LABELS, STATUS_TONES, type Post } from "@/lib/posts";

function PostsInner() {
  const { user } = useAuth();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user.id)
        .in("status", ["approved", "published", "rejected"])
        .order("updated_at", { ascending: false });
      setItems((data ?? []) as Post[]);
      setLoading(false);
    })();
  }, [user?.id]);

  return (
    <AccountLayout
      eyebrow="Yazılar"
      title="Yazılarım"
      description="Yayımlanmış ve onay sürecindeki yazılarınız."
    >
      {loading ? (
        <div className="text-muted-foreground text-sm py-10">Yükleniyor…</div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-hairline py-16 text-center text-sm text-muted-foreground">
          Henüz yayımlanmış yazınız yok.
        </div>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {items.map((p) => (
            <li key={p.id} className="py-5">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-lg truncate">{p.title}</h3>
                <Badge variant="outline" className={STATUS_TONES[p.status]}>{STATUS_LABELS[p.status]}</Badge>
              </div>
              {p.excerpt && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-1">{p.excerpt}</p>}
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                {p.published_at && <span>Yayımlandı: {new Date(p.published_at).toLocaleDateString("tr-TR")}</span>}
                <span>·</span>
                <span>{p.read_minutes} dk</span>
                {p.status === "published" && p.slug && (
                  <>
                    <span>·</span>
                    <Link to={`/yazi/${p.slug}`} className="text-accent hover:underline">Görüntüle</Link>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  );
}

export default function Posts() {
  return <AccountGuard><PostsInner /></AccountGuard>;
}