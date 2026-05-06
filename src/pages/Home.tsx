import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, BookOpen, BookmarkCheck, TreePine, Shuffle } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles, recent } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const dayMs = 24 * 60 * 60 * 1000;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [days, setDays] = useState(0);
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  const slides = useMemo(() => [recent[0] ?? articles[0], ...articles.slice(0, 5)].filter(Boolean).slice(0, 6), []);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: rp }, { data: cs }, { data: lists }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
        supabase.from("recovery_profiles").select("start_date").eq("user_id", user.id).maybeSingle(),
        supabase.from("completed_articles").select("article_slug").eq("user_id", user.id),
        supabase.from("reading_lists").select("id").eq("user_id", user.id),
      ]);
      if (p?.display_name) setDisplayName(p.display_name);
      if (rp?.start_date) setDays(Math.max(0, Math.floor((Date.now() - +new Date(rp.start_date)) / dayMs)));
      const cset = new Set((cs ?? []).map((x) => x.article_slug));
      setCompletedSlugs(cset);
      const ids = (lists ?? []).map((l) => l.id);
      if (ids.length) {
        const { data: items } = await supabase
          .from("reading_list_items")
          .select("article_slug")
          .in("list_id", ids);
        setSavedSlugs([...new Set((items ?? []).map((i) => i.article_slug))]);
      }
    })();
  }, [user]);

  const greet = displayName?.split(" ")[0] || user?.email?.split("@")[0] || "okuyucu";
  const pendingSlugs = articles.map((a) => a.slug).filter((s) => !completedSlugs.has(s));
  const nextSlug = savedSlugs.find((s) => !completedSlugs.has(s)) ?? pendingSlugs[0];

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-accent-glow/10 blur-3xl" />

        <div className="wide-column relative px-4 md:px-6 pt-10 md:pt-16 pb-12 md:pb-20">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Slider — left, ~7/12 */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden surface-card p-0" ref={emblaRef}>
                <div className="flex">
                  {slides.map((a) => (
                    <div key={a.slug} className="flex-[0_0_100%] min-w-0">
                      <Link to={`/yazi/${a.slug}`} className="group block relative">
                        <div className="aspect-[16/10] overflow-hidden bg-secondary">
                          <img src={a.cover} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-background/80">
                            <Sparkles className="h-3 w-3 text-accent" /> {a.category}
                          </span>
                          <h2 className="mt-2 font-display font-extrabold text-xl md:text-3xl text-background leading-tight tracking-tight text-balance">
                            {a.title}
                          </h2>
                          <p className="mt-2 text-xs md:text-sm text-background/80 line-clamp-2 max-w-2xl">
                            {a.excerpt}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right widget */}
            <aside className="lg:col-span-5">
              <div className="surface-card h-full p-6 md:p-7 bg-gradient-to-br from-accent-soft/40 to-secondary/40 flex flex-col">
                <div>
                  <span className="eyebrow text-accent">Hoş geldin</span>
                  <h2 className="mt-1 font-display font-extrabold text-2xl md:text-3xl tracking-[-0.02em]">
                    Merhaba, {greet}.
                  </h2>
                </div>

                <div className="mt-6 surface-card p-5 bg-background/80">
                  <div className="flex items-center gap-3">
                    <TreePine className="h-8 w-8 text-accent" strokeWidth={2} />
                    <div>
                      <div className="font-display font-extrabold text-3xl tracking-[-0.02em]">
                        {days} <span className="text-base text-muted-foreground font-bold">Ağaç</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Bağımlılıktan uzak gün</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniStat icon={BookmarkCheck} value={completedSlugs.size} label="Okunan" />
                  <MiniStat icon={BookOpen} value={pendingSlugs.length} label="Bekleyen" />
                </div>

                <button
                  onClick={() => nextSlug && navigate(`/yazi/${nextSlug}`)}
                  disabled={!nextSlug}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  <Shuffle className="h-4 w-4" /> Sıradaki yazıya geç
                </button>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <Link to="/profil/surecim" className="font-semibold text-foreground hover:text-accent inline-flex items-center gap-1">
                    Sürecimi gör <ArrowUpRight className="h-3 w-3" />
                  </Link>
                  <Link to="/profil/listeler" className="text-muted-foreground hover:text-foreground">
                    Okuma listem
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Section bands */}
      <section className="wide-column px-4 md:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <SectionTile to="/bilimsel" title="Bilimsel" desc="Bağımlılığa dair makaleler, kategorilenmiş ve özetlenmiş." />
          <SectionTile to="/arastirmalar" title="Araştırmalar" desc="Derinlemesine, kanıta dayalı uzun yazılar." />
          <SectionTile to="/kolektif" title="Kolektif" desc="Toparlanma yolculuğundan ilk elden anlatılar." />
        </div>
      </section>

      {/* Manifesto */}
      <section className="px-4 md:px-6 pb-16 md:pb-24">
        <div className="wide-column">
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-16">
            <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/40 blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full bg-background/10 text-xs font-semibold tracking-wide text-background/80">
                YAKLAŞIMIMIZ
              </span>
              <p className="mt-5 font-display font-extrabold text-2xl md:text-5xl leading-[1.05] tracking-[-0.03em] text-balance">
                Bağımlılıktan kurtulmak <span className="text-accent">tek seferlik bir karar</span> değil, her gün yenilenen bir pratiktir.
              </p>
              <p className="mt-4 text-base md:text-lg text-background/70 max-w-xl leading-relaxed">
                Oku, düşün, dene. Geri düştüğünde tekrar başla. Burada yargı yok — yalnızca sen ve süreç.
              </p>
              <div className="mt-6">
                <Link to="/profil/surecim" className="btn-pill bg-accent text-accent-foreground hover:opacity-90">
                  Süreci başlat <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

const MiniStat = ({ icon: Icon, value, label }: { icon: any; value: number; label: string }) => (
  <div className="surface-card p-4 bg-background/70">
    <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
      <Icon className="h-3.5 w-3.5 text-accent" /> {label}
    </div>
    <div className="mt-1 font-display font-extrabold text-2xl tracking-[-0.02em]">{value}</div>
  </div>
);

const SectionTile = ({ to, title, desc }: { to: string; title: string; desc: string }) => (
  <Link to={to} className="group surface-card p-6 md:p-8 hover:-translate-y-1 transition-transform">
    <div className="flex items-center justify-between">
      <span className="tag">Bölüm</span>
      <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:rotate-12 transition-all" />
    </div>
    <h3 className="mt-4 font-display font-bold text-2xl md:text-3xl tracking-tight group-hover:text-accent transition-colors">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </Link>
);

export default Home;
