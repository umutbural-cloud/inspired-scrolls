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
    "Yavaşça okumak, çağdaş bir cesarettir. Bir cümlenin önünde durabilmek, bir hayatı yeniden okumakla aynı şeydir.",
  attribution: "Manifesto · Gelişim Yolcuları",
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
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-tight">Gelişim</span>
            <span className="font-display text-xl tracking-tight text-accent">
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
            <h1 className="mt-3 font-display text-4xl md:text-5xl tracking-tight leading-[1.05] text-balance">
              {title}
            </h1>
            <p className="mt-4 font-serif-body text-muted-foreground text-balance">
              {subtitle}
            </p>

            <div className="mt-10">{children}</div>
          </div>
        </div>

        <footer className="text-xs text-muted-foreground flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="font-mono-jb tracking-wider">YAVAŞÇA OKU · DERİNLEŞ</div>
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
          <span className="eyebrow text-accent">Manifesto</span>
          <blockquote className="font-display text-3xl xl:text-4xl leading-tight text-balance max-w-lg">
            "{quote.text}"
          </blockquote>
          <div className="text-sm text-muted-foreground font-mono-jb tracking-wider">
            — {quote.attribution.toUpperCase()}
          </div>
        </div>
      </aside>
    </div>
  );
};