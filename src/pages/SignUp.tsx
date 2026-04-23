import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/site/AuthShell";
import { SocialAuth } from "@/components/site/SocialAuth";

const SignUp = () => {
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
      <SocialAuth mode="signup" />

      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-hairline" />
        <span className="eyebrow text-muted-foreground">veya e-posta ile</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="name" className="eyebrow">Ad ve soyad</label>
          <input
            id="name"
            type="text"
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
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            className="w-full h-11 px-3 bg-transparent border border-hairline focus:border-foreground outline-none transition-colors text-base font-serif-body"
          />
          <p className="text-xs text-muted-foreground">
            Şifren cihazlar arasında senin yanında kalır.
          </p>
        </div>

        <label className="flex gap-3 items-start text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-foreground"
            defaultChecked
          />
          <span>
            Yeni yazılar ve aylık manifestoyu e-posta ile almak istiyorum.
          </span>
        </label>

        <button
          type="submit"
          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm inline-flex items-center justify-center gap-2 group"
        >
          Hesabımı oluştur
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
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