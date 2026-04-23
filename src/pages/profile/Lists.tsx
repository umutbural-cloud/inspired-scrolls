import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus, Lock, BookmarkCheck } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ListRow = {
  id: string;
  name: string;
  is_default: boolean;
  count: number;
};

const ListsInner = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState<ListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const load = async () => {
    if (!user) return;
    const { data: l } = await supabase
      .from("reading_lists")
      .select("id, name, is_default, created_at")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });
    if (!l) return;
    const ids = l.map((x) => x.id);
    const { data: items } = await supabase
      .from("reading_list_items")
      .select("list_id")
      .in("list_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
    const counts = new Map<string, number>();
    (items ?? []).forEach((it) => {
      counts.set(it.list_id, (counts.get(it.list_id) ?? 0) + 1);
    });
    setLists(
      l.map((x) => ({
        id: x.id,
        name: x.name,
        is_default: x.is_default,
        count: counts.get(x.id) ?? 0,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim()) return;
    setCreating(true);
    const { error } = await supabase
      .from("reading_lists")
      .insert({ user_id: user.id, name: newName.trim() });
    setCreating(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewName("");
    toast.success("Liste oluşturuldu.");
    load();
  };

  return (
    <AccountLayout
      eyebrow="Okuma Odası"
      title="Okuma Listeleri"
      description="Kaydettiklerin ve kendi adlandırdığın koleksiyonlar."
    >
      {loading ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
        </div>
      ) : (
        <>
          <ul className="divide-y divide-hairline border-y border-hairline">
            {lists.map((l) => (
              <li key={l.id}>
                <Link
                  to={`/profil/listeler/${l.id}`}
                  className="group flex items-center justify-between py-5 gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="mt-1 h-10 w-10 border border-hairline flex items-center justify-center text-muted-foreground group-hover:border-foreground transition-colors">
                      {l.is_default ? (
                        <BookmarkCheck className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <span className="font-mono-jb text-xs">{l.count.toString().padStart(2, "0")}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-xl group-hover:text-accent transition-colors flex items-center gap-2">
                        {l.name}
                        {l.is_default && (
                          <Lock className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {l.count} yazı
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <form onSubmit={create} className="mt-10 flex gap-3 items-stretch max-w-lg">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Yeni liste adı (örn. Yaz Okumaları)"
              className="flex-1 h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none text-sm font-serif-body"
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="h-11 px-4 bg-foreground text-background hover:bg-foreground/90 text-sm transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              {creating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              )}
              Oluştur
            </button>
          </form>
        </>
      )}
    </AccountLayout>
  );
};

const Lists = () => (
  <AccountGuard>
    <ListsInner />
  </AccountGuard>
);

export default Lists;