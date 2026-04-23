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
      className={`sticky top-0 z-40 bg-background/85 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-b border-hairline" : "border-b border-transparent"
      }`}
    >
      <div className="wide-column flex items-center justify-between gap-8 px-6 py-5">
        <Link to="/" className="flex items-baseline gap-1.5 group">
          <span className="font-display text-xl md:text-[1.35rem] tracking-tight font-semibold text-foreground">
            Gelişim
          </span>
          <span className="font-display text-xl md:text-[1.35rem] tracking-tight font-semibold text-accent">
            Yolcuları
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/ara"
            aria-label="Ara"
            className={`p-2 transition-colors ${
              location.pathname === "/ara"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          {loading ? null : session ? (
            <>
              <Link
                to="/profil/yaz/yeni"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <PenLine className="h-3.5 w-3.5" strokeWidth={1.5} />
                Yaz
              </Link>
              <Link
                to="/profil"
                className="inline-flex items-center gap-2 text-sm border border-foreground/80 px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                <UserIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                Profil
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/giris"
                className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Giriş
              </Link>
              <Link
                to="/kayit"
                className="text-sm border border-foreground/80 px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
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
