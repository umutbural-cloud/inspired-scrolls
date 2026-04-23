import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/site/AuthShell";
import { SocialAuth } from "@/components/site/SocialAuth";

const SignIn = () => {
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
      <SocialAuth mode="signin" />

      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-hairline" />
        <span className="eyebrow text-muted-foreground">veya e-posta</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="email" className="eyebrow">E-posta</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="elif@ornek.com"
            className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="eyebrow">Şifre</label>
            <Link to="/sifremi-unuttum" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Şifremi unuttum
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm inline-flex items-center justify-center gap-2 group"
        >
          Giriş yap
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
        </button>
      </form>
    </AuthShell>
  );
};

export default SignIn;