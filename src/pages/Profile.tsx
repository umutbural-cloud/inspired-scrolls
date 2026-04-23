import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
};

const Profile = () => {
  const { session, user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, username, bio, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) toast.error(error.message);
      setProfile(
        data ?? {
          id: user.id,
          display_name: null,
          username: null,
          bio: null,
          avatar_url: null,
        }
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="content-column px-6 py-32 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </SiteLayout>
    );
  }

  if (!session) return <Navigate to="/giris" replace />;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: profile.display_name,
        username: profile.username,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profil güncellendi.");
  };

  return (
    <SiteLayout>
      <section className="border-b border-hairline">
        <div className="content-column px-6 pt-20 md:pt-24 pb-12">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <span className="eyebrow text-accent">Okuma Odası</span>
              <h1 className="mt-3 font-display text-4xl md:text-5xl tracking-tight">
                {profile?.display_name || user?.email}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="text-xs font-mono-jb tracking-wider text-muted-foreground hover:text-foreground border-b border-hairline hover:border-foreground pb-1 transition-colors"
            >
              ÇIKIŞ YAP
            </button>
          </div>
        </div>
      </section>

      {/* İstatistik şeridi (placeholder) */}
      <section className="border-b border-hairline">
        <div className="content-column px-6 py-8 grid grid-cols-3 gap-6 text-center">
          <Stat label="Streak" value="0 gün" />
          <Stat label="Tamamlanan" value="0" />
          <Stat label="Toplam Süre" value="0 dk" />
        </div>
      </section>

      {/* Profil ayarları */}
      <section className="content-column px-6 py-14">
        <h2 className="font-display text-2xl mb-8">Profil Ayarları</h2>

        {loading || !profile ? (
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
          </div>
        ) : (
          <form onSubmit={onSave} className="space-y-6 max-w-xl">
            <Field label="Görünen ad">
              <input
                type="text"
                value={profile.display_name ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, display_name: e.target.value })
                }
                placeholder="Elif Yıldırım"
                className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body"
              />
            </Field>
            <Field label="Kullanıcı adı">
              <input
                type="text"
                value={profile.username ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                placeholder="elifyildirim"
                className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body"
              />
            </Field>
            <Field label="Biyografi">
              <textarea
                value={profile.bio ?? ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                placeholder="Kısa bir tanıtım…"
                className="w-full px-3 py-2.5 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body resize-none leading-relaxed"
              />
            </Field>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="h-11 px-6 bg-foreground text-background hover:bg-foreground/90 text-sm transition-colors inline-flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Kaydediliyor…
                  </>
                ) : (
                  "Değişiklikleri kaydet"
                )}
              </button>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Vazgeç
              </Link>
            </div>
          </form>
        )}
      </section>
    </SiteLayout>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-display text-3xl text-accent">{value}</div>
    <div className="mt-1 eyebrow">{label}</div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="eyebrow">{label}</label>
    {children}
  </div>
);

export default Profile;