import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, User as UserIcon, PenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/", label: "Ana Sayfa", end: true },
  { to: "/arastirmalar", label: "Araştırmalar" },
  { to: "/kolektif", label: "Kolektif" },
];

export const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { session, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 bg-background/80 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "border-b border-hairline shadow-[0_1px_0_hsl(var(--hairline))]" : "border-b border-transparent"
      }`}
    >
      <div className="wide-column flex items-center justify-between gap-8 px-6 py-4">
        <Link to="/" className="flex items-baseline gap-1.5 group">
          <span className="font-display text-xl md:text-[1.35rem] tracking-tight font-extrabold text-foreground">
            Gelişim
          </span>
          <span className="font-display text-xl md:text-[1.35rem] tracking-tight font-extrabold text-accent">
            Yolcuları
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-secondary/60 rounded-full p-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/ara"
            aria-label="Ara"
            className={`p-2 rounded-full transition-colors ${
              location.pathname === "/ara"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Search className="h-4 w-4" strokeWidth={2} />
          </Link>
          {loading ? null : session ? (
            <>
              <Link
                to="/profil/yaz/yeni"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full text-foreground hover:bg-secondary transition-colors"
              >
                <PenLine className="h-3.5 w-3.5" strokeWidth={2} />
                Yaz
              </Link>
              <Link
                to="/profil"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/85 transition-colors"
              >
                <UserIcon className="h-3.5 w-3.5" strokeWidth={2} />
                Profil
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/giris"
                className="hidden sm:inline-flex items-center text-sm font-medium px-3 py-2 rounded-full text-foreground hover:bg-secondary transition-colors"
              >
                Giriş
              </Link>
              <Link
                to="/kayit"
                className="btn-pill btn-pill-accent text-sm"
              >
                Kayıt ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
