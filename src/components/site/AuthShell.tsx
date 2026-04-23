import { Link } from "react-router-dom";
import { ReactNode } from "react";
import heroImg from "@/assets/hero-feature.jpg";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  quote?: { text: string; attribution: string };
};

const defaultQuote = {
  text:
    "Kişisel gelişim hızlı tüketilen bir tavsiye değildir. Düşünmek, denemek ve uygulamak için zaman ister.",
  attribution: "Yaklaşımımız · Gelişim Yolcuları",
};

export const AuthShell = ({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  quote = defaultQuote,
}: Props) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Sol — form kolonu */}
      <div className="flex flex-col px-6 sm:px-10 py-8 lg:py-12">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-1.5">
            <span className="font-display text-lg tracking-tight font-semibold">Gelişim</span>
            <span className="font-display text-lg tracking-tight font-semibold text-accent">
              Yolcuları
            </span>
          </Link>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono-jb tracking-wider"
          >
            ← ANA SAYFA
          </Link>
        </header>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto py-12">
            <span className="eyebrow text-accent">{eyebrow}</span>
            <h1 className="mt-3 font-display font-semibold text-3xl md:text-4xl tracking-tight leading-[1.08] text-balance">
              {title}
            </h1>
            <p className="mt-3 text-muted-foreground text-balance text-[0.95rem]">
              {subtitle}
            </p>

            <div className="mt-10">{children}</div>
          </div>
        </div>

        <footer className="text-xs text-muted-foreground flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="font-mono-jb tracking-wider">DÜŞÜN · UYGULA · İLERLE</div>
          <div>{footer}</div>
        </footer>
      </div>

      {/* Sağ — editöryal alıntı */}
      <aside className="hidden lg:flex relative bg-surface-sunken border-l border-hairline overflow-hidden">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-background/55" aria-hidden />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <span className="eyebrow text-accent">Yaklaşımımız</span>
          <blockquote className="font-display font-semibold text-2xl xl:text-[2rem] leading-[1.2] tracking-tight text-balance max-w-lg">
            {quote.text}
          </blockquote>
          <div className="text-xs text-muted-foreground font-mono-jb tracking-wider">
            — {quote.attribution.toUpperCase()}
          </div>
        </div>
      </aside>
    </div>
  );
};