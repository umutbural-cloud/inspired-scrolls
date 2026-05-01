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
      <div className="flex flex-col px-6 sm:px-10 py-8 lg:py-12 relative">
        <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl lg:hidden" />
        <header className="flex items-center justify-between relative">
          <Link to="/" className="flex items-baseline gap-1.5">
            <span className="font-display text-lg tracking-tight font-bold">Gelişim</span>
            <span className="font-display text-lg tracking-tight font-bold text-accent">
              Yolcuları
            </span>
          </Link>
          <Link
            to="/"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-secondary"
          >
            ← Ana sayfa
          </Link>
        </header>

        <div className="flex-1 flex items-center relative">
          <div className="w-full max-w-md mx-auto py-12">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mt-3 font-display font-extrabold text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] text-balance">
              {title}
            </h1>
            <p className="mt-3 text-muted-foreground text-balance text-[0.95rem]">
              {subtitle}
            </p>

            <div className="mt-10">{children}</div>
          </div>
        </div>

        <footer className="text-xs text-muted-foreground flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between relative">
          <div className="font-medium tracking-wider">DÜŞÜN · DENE · İLERLE</div>
          <div>{footer}</div>
        </footer>
      </div>

      {/* Sağ — modern energetic */}
      <aside className="hidden lg:flex relative overflow-hidden bg-foreground text-background">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div aria-hidden className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-accent-glow/30 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <span className="inline-flex w-fit px-3 py-1 rounded-full bg-background/10 backdrop-blur text-xs font-semibold tracking-wide text-background/80">
            YAKLAŞIMIMIZ
          </span>
          <blockquote className="font-display font-extrabold text-3xl xl:text-[2.5rem] leading-[1.1] tracking-[-0.03em] text-balance max-w-xl">
            {quote.text}
          </blockquote>
          <div className="text-xs text-background/70 font-medium tracking-wider">
            — {quote.attribution.toUpperCase()}
          </div>
        </div>
      </aside>
    </div>
  );
};