import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Profile = {
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
};

const SettingsInner = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, username, bio, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(
        data ?? { display_name: null, username: null, bio: null, avatar_url: null }
      );
      setLoading(false);
    })();
  }, [user]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...profile,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profil güncellendi.");
  };

  return (
    <AccountLayout
      eyebrow="Ayarlar"
      title="Profil Ayarları"
      description="Yazarken ve okurken görünen kimlik bilgilerin."
    >
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
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              placeholder="Elif Yıldırım"
              className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base "
            />
          </Field>
          <Field label="Kullanıcı adı">
            <input
              type="text"
              value={profile.username ?? ""}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              placeholder="elifyildirim"
              className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base "
            />
          </Field>
          <Field label="Profil fotoğrafı (URL)">
            <input
              type="url"
              value={profile.avatar_url ?? ""}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              placeholder="https://…"
              className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base "
            />
          </Field>
          <Field label="Biyografi">
            <textarea
              value={profile.bio ?? ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              placeholder="Kısa bir tanıtım…"
              className="w-full px-3 py-2.5 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base  resize-none leading-relaxed"
            />
          </Field>

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
        </form>
      )}
    </AccountLayout>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="eyebrow">{label}</label>
    {children}
  </div>
);

const Settings = () => (
  <AccountGuard>
    <SettingsInner />
  </AccountGuard>
);

export default Settings;