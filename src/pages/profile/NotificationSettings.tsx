import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Prefs = {
  notify_new_post: boolean;
  notify_followed_author: boolean;
  notify_comments: boolean;
  notify_system: boolean;
  email_digest: boolean;
};

const fields: { key: keyof Prefs; label: string; hint: string }[] = [
  {
    key: "notify_new_post",
    label: "Yeni yazı yayımlandı",
    hint: "Editöryal seçimler ve yeni yayınlar için anlık bildirim.",
  },
  {
    key: "notify_followed_author",
    label: "Takip ettiğim yazardan",
    hint: "Takip ettiğin bir yazar yeni bir şey yayımladığında.",
  },
  {
    key: "notify_comments",
    label: "Yorum etkileşimleri",
    hint: "Yazılarına ya da takip ettiğin tartışmalara gelen yanıtlar.",
  },
  {
    key: "notify_system",
    label: "Sistem bildirimleri",
    hint: "Hesap güvenliği, önemli güncellemeler ve duyurular.",
  },
  {
    key: "email_digest",
    label: "Haftalık e-posta özeti",
    hint: "Hafta içi öne çıkanları her pazar e-posta ile al.",
  },
];

const NotificationInner = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<keyof Prefs | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("notify_new_post, notify_followed_author, notify_comments, notify_system, email_digest")
        .eq("user_id", user.id)
        .maybeSingle();
      setPrefs(
        data ?? {
          notify_new_post: true,
          notify_followed_author: true,
          notify_comments: true,
          notify_system: true,
          email_digest: false,
        }
      );
      setLoading(false);
    })();
  }, [user]);

  const toggle = async (key: keyof Prefs) => {
    if (!prefs || !user) return;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setSavingKey(key);
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({ user_id: user.id, ...next });
    setSavingKey(null);
    if (error) {
      toast.error(error.message);
      setPrefs(prefs); // geri al
    }
  };

  return (
    <AccountLayout
      eyebrow="Ayarlar"
      title="Bildirim Ayarları"
      description="Hangi olaylar için bildirim almak istediğini seç."
    >
      {loading || !prefs ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
        </div>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline max-w-2xl">
          {fields.map((f) => (
            <li key={f.key} className="py-5 flex gap-5 items-start">
              <div className="flex-1">
                <div className="text-base font-medium">{f.label}</div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {f.hint}
                </p>
              </div>
              <Switch
                checked={prefs[f.key]}
                onChange={() => toggle(f.key)}
                loading={savingKey === f.key}
              />
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  );
};

const Switch = ({
  checked,
  onChange,
  loading,
}: {
  checked: boolean;
  onChange: () => void;
  loading: boolean;
}) => (
  <button
    type="button"
    onClick={onChange}
    disabled={loading}
    role="switch"
    aria-checked={checked}
    className={`shrink-0 mt-1 relative h-6 w-11 transition-colors ${
      checked ? "bg-foreground" : "bg-hairline"
    } disabled:opacity-60`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 bg-background transition-all ${
        checked ? "left-[1.375rem]" : "left-0.5"
      }`}
    />
  </button>
);

const NotificationSettings = () => (
  <AccountGuard>
    <NotificationInner />
  </AccountGuard>
);

export default NotificationSettings;