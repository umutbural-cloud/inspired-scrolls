import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, Flame, Trophy, RotateCcw, AlertTriangle, TrendingUp } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Relapse = { id: string; occurred_at: string };

const dayMs = 24 * 60 * 60 * 1000;

const RecoveryInner = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<string>("");
  const [savedStart, setSavedStart] = useState<string | null>(null);
  const [relapses, setRelapses] = useState<Relapse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const [{ data: rp }, { data: rs }] = await Promise.all([
      supabase.from("recovery_profiles").select("start_date").eq("user_id", user.id).maybeSingle(),
      supabase.from("relapses").select("id, occurred_at").eq("user_id", user.id).order("occurred_at", { ascending: false }),
    ]);
    if (rp?.start_date) {
      setSavedStart(rp.start_date);
      setStartDate(rp.start_date.slice(0, 10));
    }
    setRelapses(rs ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const saveStart = async () => {
    if (!user || !startDate) return;
    const iso = new Date(startDate).toISOString();
    const { error } = await supabase
      .from("recovery_profiles")
      .upsert({ user_id: user.id, start_date: iso }, { onConflict: "user_id" });
    if (error) {
      toast({ title: "Kaydedilemedi", description: error.message, variant: "destructive" });
      return;
    }
    setSavedStart(iso);
    toast({ title: "Başlangıç tarihi güncellendi" });
  };

  const triggerRelapse = async () => {
    if (!user) return;
    if (!confirm("Relapse kaydedilecek ve sayaç sıfırlanacak. Devam edilsin mi?")) return;
    const now = new Date().toISOString();
    const { error: e1 } = await supabase.from("relapses").insert({ user_id: user.id, occurred_at: now });
    const { error: e2 } = await supabase
      .from("recovery_profiles")
      .upsert({ user_id: user.id, start_date: now }, { onConflict: "user_id" });
    if (e1 || e2) {
      toast({ title: "Hata", description: (e1 || e2)!.message, variant: "destructive" });
      return;
    }
    toast({ title: "Sıfırlandı. Yeniden başlıyoruz." });
    await load();
  };

  const stats = useMemo(() => {
    const now = Date.now();
    const startTs = savedStart ? new Date(savedStart).getTime() : now;
    const currentDays = Math.max(0, Math.floor((now - startTs) / dayMs));

    // streaks between relapses (from oldest to newest)
    const sorted = [...relapses].sort((a, b) => +new Date(a.occurred_at) - +new Date(b.occurred_at));
    let prev = sorted.length ? new Date(sorted[0].occurred_at).getTime() : startTs;
    let maxStreak = 0;
    // gaps between relapses
    for (let i = 1; i < sorted.length; i++) {
      const t = new Date(sorted[i].occurred_at).getTime();
      const gap = Math.floor((t - prev) / dayMs);
      if (gap > maxStreak) maxStreak = gap;
      prev = t;
    }
    if (currentDays > maxStreak) maxStreak = currentDays;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthRelapses = relapses.filter((r) => new Date(r.occurred_at) >= monthStart).length;

    return {
      currentDays,
      maxStreak,
      total: relapses.length,
      monthRelapses,
    };
  }, [savedStart, relapses]);

  return (
    <AccountLayout
      eyebrow="Sürecim"
      title="Bağımlılıktan kurtulma yolculuğun"
      description="Süreni takip et, geri düşüşleri kaydet, ilerlemeni gör."
    >
      {loading ? (
        <div className="text-muted-foreground">Yükleniyor…</div>
      ) : (
        <div className="space-y-8">
          {/* Big counter */}
          <div className="surface-card p-8 md:p-12 bg-gradient-to-br from-accent-soft/50 to-transparent text-center">
            <div className="eyebrow text-accent">Mevcut Süre</div>
            <div className="mt-3 font-display font-extrabold text-6xl md:text-8xl tracking-[-0.04em]">
              {stats.currentDays}
              <span className="text-2xl md:text-3xl text-muted-foreground font-bold ml-3">gün</span>
            </div>
            {savedStart && (
              <p className="mt-3 text-sm text-muted-foreground">
                {new Date(savedStart).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} tarihinden bu yana
              </p>
            )}
            <button
              onClick={triggerRelapse}
              disabled={!savedStart}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-destructive text-destructive-foreground font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" /> Relapse — sayacı sıfırla
            </button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat icon={Trophy} label="Maksimum Süre" value={`${stats.maxStreak} gün`} />
            <Stat icon={Flame} label="Toplam Relapse" value={String(stats.total)} />
            <Stat icon={TrendingUp} label="Bu Ay" value={`${stats.monthRelapses} relapse`} />
          </div>

          {/* Start date editor */}
          <div className="surface-card p-6">
            <div className="flex items-center gap-2 eyebrow mb-3">
              <CalendarIcon className="h-3.5 w-3.5 text-accent" />
              Başlangıç Tarihi
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="px-3 py-2 rounded-lg border border-hairline bg-background text-sm"
              />
              <button
                onClick={saveStart}
                className="btn-pill btn-pill-accent text-sm"
              >
                Kaydet
              </button>
            </div>
            {!savedStart && (
              <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-accent" />
                Süreni takip etmeye başlamak için bir başlangıç tarihi gir.
              </div>
            )}
          </div>

          {/* History */}
          {relapses.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-xl mb-4">Relapse geçmişi</h2>
              <ul className="space-y-2">
                {relapses.map((r) => (
                  <li key={r.id} className="surface-card px-4 py-3 text-sm flex justify-between">
                    <span>{new Date(r.occurred_at).toLocaleString("tr-TR")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </AccountLayout>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="surface-card p-5">
    <div className="flex items-center gap-2 eyebrow text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-accent" /> {label}
    </div>
    <div className="mt-2 font-display font-extrabold text-3xl tracking-[-0.02em]">{value}</div>
  </div>
);

const Recovery = () => (
  <AccountGuard>
    <RecoveryInner />
  </AccountGuard>
);

export default Recovery;