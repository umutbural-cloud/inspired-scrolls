import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/site/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) navigate("/profil", { replace: true });
  }, [session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(
        error.message === "Invalid login credentials"
          ? "E-posta veya şifre hatalı."
          : error.message
      );
      return;
    }
    toast.success("Hoş geldin.");
    navigate("/profil", { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Giriş"
      title="Tekrar hoş geldin."
      subtitle="Okumalarına ve listelerine kaldığın yerden devam et."
      footer={
        <>
          Hesabın yok mu?{" "}
          <Link to="/kayit" className="text-foreground underline underline-offset-4">
            Kayıt ol
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold text-foreground/80">E-posta</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="elif@ornek.com"
            className="w-full h-12 px-4 rounded-xl bg-secondary/60 border border-transparent focus:border-accent focus:bg-background outline-none transition-all text-base"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="text-xs font-semibold text-foreground/80">Şifre</label>
            <Link to="/sifremi-unuttum" className="text-xs text-accent hover:underline">
              Şifremi unuttum
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full h-12 px-4 rounded-xl bg-secondary/60 border border-transparent focus:border-accent focus:bg-background outline-none transition-all text-base"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-full bg-accent text-accent-foreground hover:bg-accent-glow transition-all text-sm font-semibold inline-flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed shadow-[var(--shadow-pop)]"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Giriliyor…
            </>
          ) : (
            <>
              Giriş yap
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
};

export default SignIn;