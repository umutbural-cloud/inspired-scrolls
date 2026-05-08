import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookmarkCheck,
  TreePine,
  Shuffle,
  Headphones,
  Mail,
  Quote,
  Brain,
  Users,
  Microscope,
  Compass,
  Flame,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Activity,
  CalendarDays,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles, recent, categories } from "@/data/mock";
import { studies } from "@/data/studies";
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
  const [readStreak, setReadStreak] = useState(0);

  /* Embla — hero article carousel (manual nav, no autoplay) */
  const [heroRef, heroApi] = useEmblaCarousel({ loop: true, align: "start", duration: 30 });

  /* Embla — yatay kategori şeridi */
  const [stripRef] = useEmblaCarousel({ loop: false, align: "start", dragFree: true });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: rp }, { data: cs }, { data: lists }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
        supabase.from("recovery_profiles").select("start_date").eq("user_id", user.id).maybeSingle(),
        supabase.from("completed_articles").select("article_slug, completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }),
        supabase.from("reading_lists").select("id").eq("user_id", user.id),
      ]);
      if (p?.display_name) setDisplayName(p.display_name);
      if (rp?.start_date) setDays(Math.max(0, Math.floor((Date.now() - +new Date(rp.start_date)) / dayMs)));
      const cset = new Set((cs ?? []).map((x) => x.article_slug));
      setCompletedSlugs(cset);

      // Reading streak: ardışık günler (bugün veya dün ile başlamalı)
      const dayKeys = new Set(
        (cs ?? []).map((x: any) => {
          const d = new Date(x.completed_at);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }),
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let cursor = today.getTime();
      let streak = 0;
      if (!dayKeys.has(cursor)) cursor -= dayMs; // dünden başlat
      while (dayKeys.has(cursor)) {
        streak += 1;
        cursor -= dayMs;
      }
      setReadStreak(streak);

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

  const greet = displayName?.split(" ")[0] || user?.email?.split("@")[0] || "yolcu";
  const pendingSlugs = articles.map((a) => a.slug).filter((s) => !completedSlugs.has(s));
  const nextSlug = savedSlugs.find((s) => !completedSlugs.has(s)) ?? pendingSlugs[0];

  const latest = useMemo(() => articles.slice(0, 5), []);
  const grid = useMemo(() => articles.slice(5, 11), []);
  const collective = useMemo(() => articles.filter((a) => a.kind === "Kolektif").slice(0, 4), []);
  const essays = useMemo(() => articles.filter((a) => a.kind === "Deneme").slice(0, 3), []);
  const research = useMemo(() => articles.filter((a) => a.kind === "Araştırma").slice(0, 3), []);
  const heroSlides = useMemo(() => articles.slice(0, 6), []);

  return (
    <SiteLayout>
      {/* ============ 1. HERO — Manifesto carousel + Süreç kartı ============ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-accent/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-secondary/40 blur-3xl" />

        <div className="wide-column relative px-4 md:px-6 pt-10 md:pt-14 pb-10 md:pb-14">
          <div className="grid lg:grid-cols-12 gap-6 items-stretch lg:h-[855px]">
            {/* Left: Article carousel — 8/12 (16:9) */}
            <div className="lg:col-span-8 h-full">
              <div className="surface-card relative overflow-hidden h-full bg-background group">
                <div ref={heroRef} className="overflow-hidden h-full">
                  <div className="flex h-full">
                    {heroSlides.map((a) => (
                      <div key={a.slug} className="flex-[0_0_100%] min-w-0 h-full">
                        <Link to={`/yazi/${a.slug}`} className="relative block h-full w-full">
                          <img
                            src={a.cover}
                            alt={a.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" />
                          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 lg:p-14 text-background">
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                              <span className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground">{a.kind}</span>
                              <span className="text-background/80">{a.category}</span>
                              <span className="text-background/60">· {a.readMinutes} dk okuma</span>
                            </div>
                            <h1 className="mt-5 font-display font-extrabold text-3xl md:text-5xl lg:text-[3.2rem] leading-[1.05] tracking-[-0.035em] text-balance max-w-3xl">
                              {a.title}
                            </h1>
                            <p className="mt-4 text-base md:text-lg text-background/80 max-w-2xl leading-relaxed line-clamp-2">
                              {a.excerpt}
                            </p>
                            <div className="mt-6 flex items-center gap-3 text-sm">
                              <img src={a.author.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-background/30" />
                              <span className="font-semibold">{a.author.name}</span>
                              <span className="text-background/60">· {a.publishedAt}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual nav buttons */}
                <button
                  type="button"
                  aria-label="Önceki"
                  onClick={() => heroApi?.scrollPrev()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-background/90 backdrop-blur text-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Sonraki"
                  onClick={() => heroApi?.scrollNext()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-background/90 backdrop-blur text-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right: Süreç bölümü — 4/12 */}
            <aside className="lg:col-span-4 h-full">
              <div className="surface-card h-full p-6 md:p-7 bg-background flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-accent">Sürecin</span>
                  <Link to="/profil/surecim" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                    Detay <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                <h2 className="mt-2 font-display font-extrabold text-2xl tracking-[-0.02em]">
                  Merhaba, {greet}.
                </h2>
                <p className="text-sm text-muted-foreground">Bugün de buradasın. Bu önemli.</p>

                {/* Hero stat — Ağaç sayısı */}
                <div className="mt-5 rounded-2xl p-5 bg-gradient-to-br from-accent/10 via-secondary/60 to-background border border-hairline">
                  <div className="flex items-center gap-2 eyebrow text-accent">
                    <TreePine className="h-3.5 w-3.5" /> Bağımlılıktan uzak
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <div className="font-display font-extrabold text-5xl tracking-[-0.03em] leading-none">{days}</div>
                    <div className="text-base font-bold text-muted-foreground">Ağaç</div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Her gün dikilen bir ağaç. İlerlemen büyüyor.</p>
                </div>

                {/* Streak */}
                <div className="mt-4 rounded-2xl p-4 bg-surface-sunken border border-hairline flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Flame className="h-5 w-5 text-accent" strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-extrabold text-2xl tracking-[-0.02em] leading-none">
                      {readStreak} <span className="text-sm text-muted-foreground font-bold">gün</span>
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                      Kesintisiz okuma serisi
                    </div>
                  </div>
                </div>

                {/* Mini stats */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <MiniStat icon={BookmarkCheck} value={completedSlugs.size} label="Okunan" />
                  <MiniStat icon={BookOpen} value={pendingSlugs.length} label="Bekleyen" />
                </div>

                {/* Filler — bugün ne okumalıyım */}
                <div className="mt-4 rounded-2xl p-4 bg-secondary/40 border border-hairline flex-1 flex flex-col justify-end">
                  <div className="flex items-center gap-2 eyebrow text-accent">
                    <Activity className="h-3.5 w-3.5" /> Bugünün önerisi
                  </div>
                  <p className="mt-2 text-sm text-foreground/85 leading-relaxed line-clamp-3">
                    Küçük adımlar büyük dönüşümler yaratır. Bekleyen okuma listenden bir yazıyla başla.
                  </p>
                </div>

                <button
                  onClick={() => nextSlug && navigate(`/yazi/${nextSlug}`)}
                  disabled={!nextSlug}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  <Shuffle className="h-4 w-4" /> Sıradaki yazıya geç
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============ 2. DERLENEN BİLİMSEL ÇALIŞMALAR — CAROUSEL ============ */}
      <section className="border-y border-hairline bg-surface-sunken/40">
        <div className="wide-column px-4 md:px-6 py-8 md:py-10">
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="eyebrow text-accent">Derlenen Bilimsel Çalışmalar</span>
              <h2 className="mt-1 font-display font-extrabold text-xl md:text-2xl tracking-[-0.02em]">
                Hakemli araştırmalar, sade Türkçe değerlendirmelerle
              </h2>
            </div>
            <Link to="/bilimsel" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-accent font-semibold items-center gap-1">
              Tümü <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div ref={stripRef} className="overflow-hidden">
            <div className="flex gap-4">
              {studies.map((s) => (
                <Link
                  key={s.slug}
                  to={`/bilimsel/${s.slug}`}
                  className="group shrink-0 w-[300px] md:w-[340px] surface-card p-5 bg-background hover:-translate-y-0.5 transition-transform flex flex-col"
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Microscope className="h-3.5 w-3.5 text-accent" />
                    <span className="text-accent">{s.journal}</span>
                    <span>· {s.year}</span>
                  </div>
                  <h3 className="mt-3 font-display font-bold text-base leading-snug tracking-tight text-foreground group-hover:text-accent transition-colors line-clamp-3">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {s.findings}
                  </p>
                  <div className="mt-3 pt-3 border-t border-hairline flex flex-wrap gap-1.5">
                    {s.categories.slice(0, 2).map((c) => (
                      <span key={c} className="tag text-[10px]">{c}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. SON YAZILAR + BAŞARI HİKAYELERİ ============ */}
      <section className="wide-column px-4 md:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sol: liste */}
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="eyebrow text-accent">Akış</span>
                <h2 className="mt-1 font-display font-extrabold text-3xl md:text-4xl tracking-[-0.03em]">
                  Son Yazılar
                </h2>
              </div>
              <Link to="/arastirmalar" className="text-sm text-muted-foreground hover:text-accent font-semibold inline-flex items-center gap-1">
                Tümü <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <ul className="space-y-5">
              {latest.map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`/yazi/${a.slug}`}
                    className="surface-card group grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-5 p-4 md:p-5 hover:-translate-y-0.5 transition-transform"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-secondary">
                      <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                          <span className="text-accent">{a.category}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">{a.readMinutes} dk okuma</span>
                        </div>
                        <h3 className="mt-2 font-display font-bold text-lg md:text-xl leading-snug tracking-tight group-hover:text-accent transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {a.excerpt}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <img src={a.author.avatar} alt={a.author.name} className="h-5 w-5 rounded-full object-cover" />
                        <span className="font-semibold text-foreground/80">{a.author.name}</span>
                        <span>· {a.publishedAt}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sağ: Kolektif yazıları */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="eyebrow text-accent">Kolektif</span>
                <h2 className="mt-1 font-display font-extrabold text-2xl md:text-3xl tracking-[-0.03em]">
                  Yolun gerçek sesi
                </h2>
              </div>
              <Link to="/kolektif" className="text-xs text-muted-foreground hover:text-accent font-semibold inline-flex items-center gap-1">
                Tümü <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {collective.map((a) => (
                <Link
                  key={a.slug}
                  to={`/yazi/${a.slug}`}
                  className="surface-card group block p-4 bg-background hover:-translate-y-0.5 transition"
                >
                  <div className="flex gap-3">
                    <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-secondary">
                      <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                        <Users className="h-3 w-3" /> Kolektif
                      </div>
                      <h3 className="mt-1 font-display font-bold text-sm leading-snug tracking-tight group-hover:text-accent transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <img src={a.author.avatar} alt="" className="h-4 w-4 rounded-full object-cover" />
                        <span className="font-semibold text-foreground/80 truncate">{a.author.name}</span>
                        <span>· {a.readMinutes} dk</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ============ 4. ÜÇ ANA BÖLÜM (BİLİMSEL / ARAŞTIRMALAR / KOLEKTİF) ============ */}
      <section className="wide-column px-4 md:px-6 pb-12 md:pb-16">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <SectionTile
            to="/bilimsel"
            tone="neutral"
            tag="Bilimsel"
            title="Kanıta dayalı bilgi"
            desc="Bağımlılık nörobilimi, hakemli çalışmalar ve sade Türkçe özetlerle."
            icon={Microscope}
          />
          <SectionTile
            to="/arastirmalar"
            tone="academic"
            tag="Araştırmalar"
            title="Derinlemesine analizler"
            desc="Uzun form yazılar, vaka çalışmaları ve uygulamalı çerçeveler."
            icon={BookOpen}
          />
          <SectionTile
            to="/kolektif"
            tone="warm"
            tag="Kolektif"
            title="Yolun gerçek sesi"
            desc="Birlikte yürüyenlerden ilk elden anlatılar, mektuplar, notlar."
            icon={Users}
          />
        </div>
      </section>

      {/* ============ 5. İÇERİK GRİDİ + SIDEBAR ============ */}
      <section className="wide-column px-4 md:px-6 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="eyebrow text-accent">Editöryal seçki</span>
                <h2 className="mt-1 font-display font-extrabold text-2xl md:text-3xl tracking-[-0.03em]">
                  Bu hafta okumanı öneririz
                </h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {grid.map((a) => (
                <Link
                  key={a.slug}
                  to={`/yazi/${a.slug}`}
                  className="surface-card group overflow-hidden flex flex-col bg-background hover:-translate-y-0.5 transition-transform"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-secondary">
                    <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span className="text-accent">{a.category}</span>
                      <span>· {a.publishedAt}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg leading-snug tracking-tight group-hover:text-accent transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{a.excerpt}</p>
                    <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground pt-2">
                      <img src={a.author.avatar} alt={a.author.name} className="h-5 w-5 rounded-full object-cover" />
                      <span className="font-semibold text-foreground/80">{a.author.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Kategoriler */}
            <div className="surface-card p-6 bg-background">
              <span className="eyebrow text-accent">Kategoriler</span>
              <ul className="mt-4 space-y-2">
                {categories.slice(0, 7).map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={`/kategori/${c.slug}`}
                      className="flex items-center justify-between py-1.5 text-sm font-semibold text-foreground hover:text-accent transition"
                    >
                      <span>{c.name}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Podcast */}
            <div className="surface-card p-6 bg-secondary/40">
              <Headphones className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-display font-bold text-lg tracking-tight">Podcast Kısayolu</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                15 dakikalık sade konuşmalar — yürürken, yolda, yatmadan önce.
              </p>
              <Link to="/kolektif" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                Dinlemeye başla <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* E-posta */}
            <div className="surface-card p-6 bg-background">
              <Mail className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-display font-bold text-lg tracking-tight">Haftalık Mektup</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Pazar sabahları kısa bir not. Spam yok, satış yok.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-4 flex gap-2"
              >
                <input
                  type="email"
                  placeholder="E-posta adresin"
                  className="flex-1 px-3 py-2 rounded-full text-sm bg-surface-sunken border border-hairline focus:outline-none focus:border-accent/50"
                />
                <button className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition">
                  Katıl
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ 6. MANIFESTO CTA — büyük dark ============ */}
      <section className="px-4 md:px-6 pb-16 md:pb-24">
        <div className="wide-column">
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-16">
            <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/40 blur-3xl" />
            <div aria-hidden className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-accent-glow/30 blur-3xl" />
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
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/profil/surecim" className="btn-pill bg-accent text-accent-foreground hover:opacity-90">
                  Süreci başlat <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/bilimsel" className="btn-pill bg-background/10 text-background hover:bg-background/15">
                  Bilimsel temele bak
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 7. AKADEMİ ÇÖZÜMLERİ ============ */}
      <section className="wide-column px-4 md:px-6 pb-20 md:pb-28">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow text-accent">Akademi</span>
            <h2 className="mt-1 font-display font-extrabold text-3xl md:text-4xl tracking-[-0.03em]">
              Yolculuğun farklı evreleri için
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Her biri farklı bir ihtiyaca dokunan dört yol. Hangisi sana uygunsa oradan başla.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <AcademyCard icon={Compass} title="Özgürlüğe Giden Yol" desc="Yeni başlayanlar için temel çerçeve ve günlük pratikler." cta="Başla" />
          <AcademyCard icon={Flame} title="90 Günlük Reset" desc="Beynin ödül sistemini yeniden kalibre eden 90 günlük yapı." cta="Katıl" highlight />
          <AcademyCard icon={Brain} title="Gelişim Bilimi" desc="Davranış değişiminin nörobilim temelleri, sade dilde." cta="İncele" />
          <AcademyCard icon={Users} title="Seçkin Topluluk" desc="Anonim, yargılamayan, yürüyen bir grup. Sadece üyelere açık." cta="Katıl" dark />
        </div>
      </section>

      {/* ============ 8. ZİHİN & NÖROBİLİM ŞERİDİ ============ */}
      <section className="wide-column px-4 md:px-6 pb-16 md:pb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="eyebrow text-accent">Zihin & Nörobilim</span>
            <h2 className="mt-1 font-display font-extrabold text-2xl md:text-3xl tracking-[-0.03em]">
              Beyninin nasıl çalıştığını anla
            </h2>
          </div>
          <Link to="/arastirmalar" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-accent font-semibold items-center gap-1">
            Tümü <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {research.map((a) => (
            <Link
              key={a.slug}
              to={`/yazi/${a.slug}`}
              className="surface-card group overflow-hidden flex flex-col bg-background hover:-translate-y-0.5 transition-transform"
            >
              <div className="aspect-[16/10] overflow-hidden bg-secondary">
                <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                  <Brain className="h-3 w-3" /> {a.category}
                </div>
                <h3 className="font-display font-bold text-base leading-snug tracking-tight group-hover:text-accent transition-colors line-clamp-2">
                  {a.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 9. GÜNLÜK PRATİKLER + ALINTI ============ */}
      <section className="wide-column px-4 md:px-6 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 surface-card p-7 md:p-9 bg-secondary/40">
            <span className="eyebrow text-accent">Günlük Pratikler</span>
            <h2 className="mt-2 font-display font-extrabold text-2xl md:text-3xl tracking-[-0.03em]">
              Bugün denenebilecek küçük şeyler
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                { t: "5 dakikalık nefes molası", d: "Tetikleyici geldiğinde önce nefes; sonra karar." },
                { t: "Telefonu odadan çıkar", d: "Uyku öncesi tek kural. Bir hafta dene." },
                { t: "Yürüyüş + ses kaydı", d: "20 dakika yürü, kafandakini sesli not et." },
                { t: "Sabah üç satır", d: "Uyanır uyanmaz üç cümle yaz. Filtresiz." },
              ].map((p, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-background border border-hairline flex items-center justify-center font-display font-extrabold text-sm text-accent">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-display font-bold text-base tracking-tight">{p.t}</div>
                    <p className="text-sm text-muted-foreground mt-0.5">{p.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 surface-card p-7 md:p-9 bg-foreground text-background flex flex-col justify-between">
            <Quote className="h-8 w-8 text-accent" />
            <p className="font-display font-extrabold text-xl md:text-2xl leading-snug tracking-[-0.02em] text-balance">
              "İrade gücü bir kas değil, bir ortamdır. Ortamı değiştir, davranış değişir."
            </p>
            <div className="text-xs font-semibold tracking-wider uppercase text-background/60">
              Haftanın notu
            </div>
          </div>
        </div>
      </section>

      {/* ============ 10. DENEMELER & UZUN OKUMA ============ */}
      <section className="wide-column px-4 md:px-6 pb-20 md:pb-28">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="eyebrow text-accent">Uzun okuma</span>
            <h2 className="mt-1 font-display font-extrabold text-2xl md:text-3xl tracking-[-0.03em]">
              Denemeler & düşünce yazıları
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Hızdan uzak, yavaş, sindirilerek okunmak için yazılmış metinler.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-hairline border-y border-hairline">
          {essays.map((a) => (
            <Link
              key={a.slug}
              to={`/yazi/${a.slug}`}
              className="group p-6 md:p-8 hover:bg-surface-sunken/40 transition flex flex-col"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                <GraduationCap className="h-3 w-3" /> {a.category}
              </div>
              <h3 className="mt-3 font-display font-extrabold text-xl leading-snug tracking-[-0.02em] group-hover:text-accent transition-colors line-clamp-3">
                {a.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{a.excerpt}</p>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <img src={a.author.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
                <span className="font-semibold text-foreground/80">{a.author.name}</span>
                <span>· {a.readMinutes} dk</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

/* ---------------- subcomponents ---------------- */

const MiniStat = ({ icon: Icon, value, label }: { icon: any; value: number; label: string }) => (
  <div className="rounded-xl p-4 bg-surface-sunken border border-hairline">
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
      <Icon className="h-3 w-3 text-accent" /> {label}
    </div>
    <div className="mt-1 font-display font-extrabold text-2xl tracking-[-0.02em]">{value}</div>
  </div>
);

const SectionTile = ({
  to,
  tag,
  title,
  desc,
  icon: Icon,
  tone,
}: {
  to: string;
  tag: string;
  title: string;
  desc: string;
  icon: any;
  tone: "neutral" | "academic" | "warm";
}) => {
  const toneClasses =
    tone === "warm"
      ? "bg-secondary/50"
      : tone === "academic"
      ? "bg-surface-sunken"
      : "bg-background";
  return (
    <Link
      to={to}
      className={`group surface-card p-7 md:p-8 ${toneClasses} hover:-translate-y-1 transition-transform flex flex-col`}
    >
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-background border border-hairline flex items-center justify-center">
          <Icon className="h-5 w-5 text-accent" strokeWidth={2} />
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:rotate-12 transition-all" />
      </div>
      <span className="eyebrow text-accent mt-6">{tag}</span>
      <h3 className="mt-2 font-display font-extrabold text-2xl md:text-[1.7rem] tracking-[-0.02em] group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </Link>
  );
};

const AcademyCard = ({
  icon: Icon,
  title,
  desc,
  cta,
  highlight,
  dark,
}: {
  icon: any;
  title: string;
  desc: string;
  cta: string;
  highlight?: boolean;
  dark?: boolean;
}) => {
  const cls = dark
    ? "bg-foreground text-background border-foreground"
    : highlight
    ? "bg-accent/5 border-accent/30"
    : "bg-background";
  const ctaCls = dark
    ? "bg-background text-foreground hover:opacity-90"
    : highlight
    ? "bg-accent text-accent-foreground hover:opacity-90"
    : "bg-foreground text-background hover:bg-foreground/90";
  return (
    <div className={`surface-card p-6 flex flex-col gap-4 ${cls}`}>
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${dark ? "bg-background/10" : "bg-secondary/60"}`}>
        <Icon className={`h-5 w-5 ${dark ? "text-background" : "text-accent"}`} strokeWidth={2} />
      </div>
      <div>
        <h3 className={`font-display font-extrabold text-lg tracking-tight ${dark ? "text-background" : "text-foreground"}`}>
          {title}
        </h3>
        <p className={`mt-1.5 text-sm leading-relaxed ${dark ? "text-background/70" : "text-muted-foreground"}`}>
          {desc}
        </p>
      </div>
      <button className={`mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition ${ctaCls}`}>
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default Home;
