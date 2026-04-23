import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { categories, tags } from "@/data/mock";
import { toast } from "sonner";

type Tab = "kategori" | "etiket";

const ContentInner = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("kategori");
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [tagSet, setTagSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: c }, { data: t }] = await Promise.all([
        supabase
          .from("content_preferences")
          .select("category_slug")
          .eq("user_id", user.id),
        supabase
          .from("tag_preferences")
          .select("tag_slug")
          .eq("user_id", user.id),
      ]);
      setCats(new Set((c ?? []).map((d) => d.category_slug)));
      setTagSet(new Set((t ?? []).map((d) => d.tag_slug)));
      setLoading(false);
    })();
  }, [user]);

  const toggleCategory = async (slug: string) => {
    if (!user || pending) return;
    setPending(slug);
    const isOn = cats.has(slug);
    const next = new Set(cats);
    if (isOn) {
      next.delete(slug);
      setCats(next);
      const { error } = await supabase
        .from("content_preferences")
        .delete()
        .eq("user_id", user.id)
        .eq("category_slug", slug);
      if (error) {
        toast.error(error.message);
        next.add(slug);
        setCats(new Set(next));
      }
    } else {
      next.add(slug);
      setCats(next);
      const { error } = await supabase
        .from("content_preferences")
        .insert({ user_id: user.id, category_slug: slug });
      if (error) {
        toast.error(error.message);
        next.delete(slug);
        setCats(new Set(next));
      }
    }
    setPending(null);
  };

  const toggleTag = async (slug: string) => {
    if (!user || pending) return;
    setPending(slug);
    const isOn = tagSet.has(slug);
    const next = new Set(tagSet);
    if (isOn) {
      next.delete(slug);
      setTagSet(next);
      const { error } = await supabase
        .from("tag_preferences")
        .delete()
        .eq("user_id", user.id)
        .eq("tag_slug", slug);
      if (error) {
        toast.error(error.message);
        next.add(slug);
        setTagSet(new Set(next));
      }
    } else {
      next.add(slug);
      setTagSet(next);
      const { error } = await supabase
        .from("tag_preferences")
        .insert({ user_id: user.id, tag_slug: slug });
      if (error) {
        toast.error(error.message);
        next.delete(slug);
        setTagSet(new Set(next));
      }
    }
    setPending(null);
  };

  return (
    <AccountLayout
      eyebrow="Ayarlar"
      title="İçerik Tercihleri"
      description="Kategorileri ve etiketleri seç — ana sayfa ve önerilerde bunlara öncelik veririz."
    >
      {/* Sekmeler */}
      <div className="flex gap-1 border border-hairline w-fit mb-10">
        {(
          [
            { id: "kategori" as Tab, label: "Kategoriler", n: cats.size },
            { id: "etiket" as Tab, label: "Etiketler", n: tagSet.size },
          ]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs font-mono-jb tracking-wider transition-colors ${
              tab === t.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label.toUpperCase()} <span className="opacity-60">{t.n}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
        </div>
      ) : tab === "kategori" ? (
        <div className="grid sm:grid-cols-2 gap-px bg-hairline border border-hairline max-w-2xl">
          {categories.map((c) => {
            const on = cats.has(c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => toggleCategory(c.slug)}
                disabled={pending === c.slug}
                className={`text-left p-6 transition-colors ${
                  on ? "bg-surface-sunken" : "bg-background hover:bg-surface-sunken/60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl">{c.name}</h3>
                  <span
                    className={`h-5 w-5 border flex items-center justify-center ${
                      on
                        ? "bg-foreground border-foreground text-background"
                        : "border-hairline"
                    }`}
                  >
                    {on && <Check className="h-3 w-3" strokeWidth={2.5} />}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {c.description}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-5 max-w-xl">
            Daha ince bir filtre — etiketler bir yazının içindeki kelimelerdir.
            Birkaç tanesini seç, takip ettiklerinden bağımsız olarak öne çıkaralım.
          </p>
          <div className="flex flex-wrap gap-2 max-w-3xl">
            {tags.map((t) => {
              const on = tagSet.has(t.slug);
              return (
                <button
                  key={t.slug}
                  onClick={() => toggleTag(t.slug)}
                  disabled={pending === t.slug}
                  className={`text-sm px-3 py-1.5 border transition-colors ${
                    on
                      ? "bg-foreground text-background border-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/60"
                  }`}
                >
                  {on ? "✓ " : "+ "}#{t.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

const ContentPreferences = () => (
  <AccountGuard>
    <ContentInner />
  </AccountGuard>
);

export default ContentPreferences;