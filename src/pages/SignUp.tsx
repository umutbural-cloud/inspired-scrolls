import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/site/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) navigate("/profil", { replace: true });
  }, [session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalı.");
      return;
    }
    setSubmitting(true);
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/profil`,
        data: { display_name: name.trim() || null },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(
        error.message === "User already registered"
          ? "Bu e-posta zaten kayıtlı. Giriş yapmayı dene."
          : error.message
      );
      return;
    }
    // Demo seed: birkaç tamamlanmış yazı + kaydedilmiş yazı
    const newUserId = signUpData.user?.id;
    if (newUserId) {
      try {
        await supabase.from("completed_articles").insert([
          { user_id: newUserId, article_slug: "sehrin-grameri", read_minutes: 11,
            completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
          { user_id: newUserId, article_slug: "annemin-mektuplari", read_minutes: 8,
            completed_at: new Date().toISOString() },
        ]);
        const { data: defList } = await supabase
          .from("reading_lists")
          .select("id")
          .eq("user_id", newUserId)
          .eq("is_default", true)
          .maybeSingle();
        if (defList) {
          await supabase.from("reading_list_items").insert([
            { list_id: defList.id, article_slug: "dikkat-ve-zaman" },
            { list_id: defList.id, article_slug: "okumanin-bicimi" },
          ]);
        }
        await supabase.from("author_follows").insert({
          user_id: newUserId,
          author_slug: "elif-yildirim",
        });
      } catch {
        // seed sessizce başarısız olabilir, kritik değil
      }
    }
    toast.success("Hoş geldin. Hesabın oluşturuldu.");
    navigate("/profil", { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Kayıt"
      title="Bir okuma odası kur."
      subtitle="Yazıları kaydet, kendi listelerini oluştur, yazarları takip et."
      footer={
        <>
          Zaten üye misin?{" "}
          <Link to="/giris" className="text-foreground underline underline-offset-4">
            Giriş yap
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="name" className="eyebrow">Ad ve soyad</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Elif Yıldırım"
            className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="eyebrow">E-posta</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="elif@ornek.com"
            className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="eyebrow">Şifre</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body"
          />
          <p className="text-xs text-muted-foreground">
            Şifren cihazlar arasında senin yanında kalır.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm inline-flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Oluşturuluyor…
            </>
          ) : (
            <>
              Hesabımı oluştur
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Devam ederek{" "}
          <Link to="/gizlilik" className="underline underline-offset-2 hover:text-foreground">
            Gizlilik
          </Link>{" "}
          ve{" "}
          <Link to="/kosullar" className="underline underline-offset-2 hover:text-foreground">
            Kullanım Koşulları
          </Link>
          'nı kabul etmiş olursun.
        </p>
      </form>
    </AuthShell>
  );
};

export default SignUp;