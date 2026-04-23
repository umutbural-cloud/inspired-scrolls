import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, BookOpen, Clock, ArrowRight, type LucideIcon } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getArticleBySlug } from "@/data/articleStore";

type Stats = {
  total_completed: number;
  total_minutes: number;
  current_streak: number;
  last_completed_at: string | null;
};

const OverviewInner = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<{ slug: string; completed_at: string }[]>([]);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: s }, { data: r }, { data: p }] = await Promise.all([
        supabase.rpc("get_user_reading_stats", { _user_id: user.id }).maybeSingle(),
        supabase
          .from("completed_articles")
          .select("article_slug, completed_at")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })
          .limit(4),
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
      ]);
      if (s) setStats(s as Stats);
      if (r) setRecent(r.map((x) => ({ slug: x.article_slug, completed_at: x.completed_at })));
      if (p?.display_name) setDisplayName(p.display_name);
    })();
  }, [user]);

  const greet =
    displayName?.split(" ")[0] || user?.email?.split("@")[0] || "okuyucu";

  return (
    <AccountLayout
      eyebrow="Genel Bakış"
      title={`Merhaba, ${greet}.`}
      description="Okuma yolculuğunun bugünkü özeti."
      actions={
        <button
          onClick={signOut}
          className="text-xs font-mono-jb tracking-wider text-muted-foreground hover:text-foreground border-b border-hairline hover:border-foreground pb-1 transition-colors"
        >
          ÇIKIŞ YAP
        </button>
      }
    >
      {/* İstatistikler */}
      <div className="grid sm:grid-cols-3 gap-px bg-hairline border border-hairline">
        <StatCell
          icon={Flame}
          value={`${stats?.current_streak ?? 0} gün`}
          label="Streak"
          hint="Her gün en az bir yazı"
        />
        <StatCell
          icon={BookOpen}
          value={String(stats?.total_completed ?? 0)}
          label="Tamamlanan"
          hint="Sonuna kadar okudukların"
        />
        <StatCell
          icon={Clock}
          value={`${stats?.total_minutes ?? 0} dk`}
          label="Toplam Süre"
          hint="Birikmiş okuma süresi"
        />
      </div>

      {/* Son tamamlananlar */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl">Son Tamamladıkların</h2>
          <Link
            to="/profil/tamamlanan"
            className="text-sm link-quiet text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
          >
            Hepsini gör <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted-foreground italic py-8 border-y border-hairline text-center">
            Henüz tamamladığın bir yazı yok. Bir yazıyı sonuna kadar okuyup
            "Kaydır ve tamamla" ile bu listeye ekleyebilirsin.
          </p>
        ) : (
          <ul className="divide-y divide-hairline border-y border-hairline">
            {recent.map((r) => {
              const a = getArticleBySlug(r.slug);
              if (!a) return null;
              return (
                <li key={r.slug}>
                  <Link
                    to={`/yazi/${a.slug}`}
                    className="group flex gap-5 py-5 items-center"
                  >
                    <div className="w-16 h-16 shrink-0 overflow-hidden bg-secondary">
                      <img src={a.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg leading-snug group-hover:text-accent transition-colors">
                        {a.title}
                      </h3>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {new Date(r.completed_at).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        · {a.readMinutes} dk
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AccountLayout>
  );
};

const StatCell = ({
  icon: Icon,
  value,
  label,
  hint,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  hint: string;
}) => (
  <div className="bg-background p-6">
    <div className="flex items-center gap-2 eyebrow text-muted-foreground">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      {label}
    </div>
    <div className="mt-3 font-display text-3xl text-accent">{value}</div>
    <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
  </div>
);

const Overview = () => (
  <AccountGuard>
    <OverviewInner />
  </AccountGuard>
);

export default Overview;