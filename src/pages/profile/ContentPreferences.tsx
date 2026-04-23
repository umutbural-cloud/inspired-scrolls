import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/mock";
import { toast } from "sonner";

const ContentInner = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("content_preferences")
        .select("category_slug")
        .eq("user_id", user.id);
      setSelected(new Set((data ?? []).map((d) => d.category_slug)));
      setLoading(false);
    })();
  }, [user]);

  const toggle = async (slug: string) => {
    if (!user || pending) return;
    setPending(slug);
    const isOn = selected.has(slug);
    const next = new Set(selected);
    if (isOn) {
      next.delete(slug);
      setSelected(next);
      const { error } = await supabase
        .from("content_preferences")
        .delete()
        .eq("user_id", user.id)
        .eq("category_slug", slug);
      if (error) {
        toast.error(error.message);
        next.add(slug);
        setSelected(new Set(next));
      }
    } else {
      next.add(slug);
      setSelected(next);
      const { error } = await supabase
        .from("content_preferences")
        .insert({ user_id: user.id, category_slug: slug });
      if (error) {
        toast.error(error.message);
        next.delete(slug);
        setSelected(new Set(next));
      }
    }
    setPending(null);
  };

  return (
    <AccountLayout
      eyebrow="Ayarlar"
      title="İçerik Tercihleri"
      description="İlgi alanlarını seç — ana sayfa ve önerilerde bunlara öncelik veririz."
    >
      {loading ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-px bg-hairline border border-hairline max-w-2xl">
          {categories.map((c) => {
            const on = selected.has(c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => toggle(c.slug)}
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