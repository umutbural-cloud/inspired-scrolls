import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { Loader2, Trash2, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getArticleBySlug } from "@/data/articleStore";
import { toast } from "sonner";

type Item = { article_slug: string; added_at: string; position: number };

const ListDetailInner = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      const { data: list } = await supabase
        .from("reading_lists")
        .select("name, is_default")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!list) {
        setNotFound(true);
        return;
      }
      setName(list.name);
      setIsDefault(list.is_default);
      const { data: it } = await supabase
        .from("reading_list_items")
        .select("article_slug, added_at, position")
        .eq("list_id", id)
        .order("position", { ascending: true })
        .order("added_at", { ascending: false });
      setItems(it ?? []);
      setLoading(false);
    })();
  }, [user, id]);

  if (notFound) return <Navigate to="/profil/listeler" replace />;

  const removeItem = async (slug: string) => {
    if (!id) return;
    setItems((xs) => xs.filter((x) => x.article_slug !== slug));
    const { error } = await supabase
      .from("reading_list_items")
      .delete()
      .eq("list_id", id)
      .eq("article_slug", slug);
    if (error) toast.error(error.message);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    // Reassign positions sequentially
    const updated = next.map((it, i) => ({ ...it, position: i }));
    setItems(updated);
    if (!id) return;
    // Persist both swapped rows
    const a = updated[index];
    const b = updated[target];
    await Promise.all([
      supabase.from("reading_list_items").update({ position: a.position }).eq("list_id", id).eq("article_slug", a.article_slug),
      supabase.from("reading_list_items").update({ position: b.position }).eq("list_id", id).eq("article_slug", b.article_slug),
    ]);
  };

  const deleteList = async () => {
    if (!id || isDefault) return;
    if (!confirm("Bu liste silinsin mi?")) return;
    const { error } = await supabase.from("reading_lists").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Liste silindi.");
    navigate("/profil/listeler");
  };

  return (
    <AccountLayout
      eyebrow="Okuma Listesi"
      title={name || "…"}
      description={isDefault ? "Kaydet butonuyla eklenen yazıların varsayılan listesi." : undefined}
      actions={
        <>
          <Link
            to="/profil/listeler"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Tüm listeler
          </Link>
          {!isDefault && (
            <button
              onClick={deleteList}
              className="inline-flex items-center gap-1.5 text-xs text-destructive hover:opacity-80 transition-opacity"
            >
              <Trash2 className="h-3 w-3" /> Listeyi sil
            </button>
          )}
        </>
      }
    >
      {loading ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
        </div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center border-y border-hairline">
          Bu listede henüz yazı yok. Bir yazıyı okurken kaydet butonuyla ekleyebilirsin.
        </p>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {items.map((it, idx) => {
            const a = getArticleBySlug(it.article_slug);
            if (!a) return null;
            return (
              <li key={it.article_slug} className="py-6 flex gap-5 items-start group">
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Yukarı taşı"
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    aria-label="Aşağı taşı"
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Link to={`/yazi/${a.slug}`} className="w-24 h-24 shrink-0 overflow-hidden bg-secondary">
                  <img src={a.cover} alt="" className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/yazi/${a.slug}`}>
                    <span className="eyebrow text-accent">{a.kind}</span>
                    <h3 className="mt-1 font-display text-xl leading-snug hover:text-accent transition-colors text-balance">
                      {a.title}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {a.excerpt}
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {a.author.name} · {a.readMinutes} dk · Eklendi{" "}
                    {new Date(it.added_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(it.article_slug)}
                  aria-label="Listeden kaldır"
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-2"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AccountLayout>
  );
};

const ListDetail = () => (
  <AccountGuard>
    <ListDetailInner />
  </AccountGuard>
);

export default ListDetail;