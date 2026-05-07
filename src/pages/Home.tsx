import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  BookmarkCheck,
  TreePine,
  Shuffle,
  Calendar,
  Headphones,
  Mail,
  Quote,
  Brain,
  Users,
  Microscope,
  Compass,
  Flame,
  GraduationCap,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles, recent, categories } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const dayMs = 24 * 60 * 60 * 1000;

/* ---------- Manifesto carousel slides ---------- */
const manifestoSlides = [
  {
    eyebrow: "Manifesto",
    title: "İyileşmek tek seferlik bir karar değil. Her gün yeniden verilen küçük bir söz.",
    body: "Süreç çizgisel değildir; ama mümkündür. Burada yargı yok — sadece sen, bilim ve sabırla yürünen bir patika.",
  },
  {
    eyebrow: "Yaklaşım",
    title: "Bağımlılık bir karakter zaafı değil, öğrenilmiş bir döngüdür. Yeni döngüler kurulabilir.",
    body: "Nörobilim, davranış değişimi ve insan deneyimi; üçü birden, sade bir dille.",
  },
  {
    eyebrow: "Söz",
    title: "Geri düştüğünde de buradayız. Süreç tekrar başlar — sıfırdan değil, daha bilgili bir yerden.",
    body: "Küçük ilerleme, ilerlemedir. Kontrolü yeniden kazanmak mümkündür.",
  },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [days, setDays] = useState(0);
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  /* Embla — manifesto (left hero) */
  const [heroRef] = useEmblaCarousel({ loop: true, align: "start", duration: 30 }, [
    Autoplay({ delay: 6500, stopOnInteraction: false }),
  ]);

  /* Embla — yatay kategori şeridi */
  const [stripRef] = useEmblaCarousel({ loop: false, align: "start", dragFree: true });

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

  const greet = displayName?.split(" ")[0] || user?.email?.split("@")[0] || "yolcu";
  const pendingSlugs = articles.map((a) => a.slug).filter((s) => !completedSlugs.has(s));
  const nextSlug = savedSlugs.find((s) => !completedSlugs.has(s)) ?? pendingSlugs[0];

  const latest = useMemo(() => articles.slice(0, 5), []);
  const grid = useMemo(() => articles.slice(5, 11), []);
  const stripCats = useMemo(
    () => [
      { name: "Bilimsel Çalışmalar", to: "/bilimsel", icon: Microscope },
      { name: "Araştırmalar", to: "/arastirmalar", icon: BookOpen },
      { name: "Kolektif", to: "/kolektif", icon: Users },
      { name: "Nörobilim", to: "/kategori/bilim", icon: Brain },
      { name: "Alışkanlıklar", to: "/kategori/dusunce", icon: Compass },
      { name: "Motivasyon", to: "/kategori/edebiyat", icon: Flame },
      { name: "Akademi", to: "/profil/surecim", icon: GraduationCap },
    ],
    []
  );

  return (
    <SiteLayout>
      {/* ============ 1. HERO — Manifesto carousel + Süreç kartı ============ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-accent/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-secondary/40 blur-3xl" />

        <div className="wide-column relative px-4 md:px-6 pt-10 md:pt-14 pb-10 md:pb-14">
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Manifesto carousel — 8/12 */}
            <div className="lg:col-span-8">
              <div className="surface-card overflow-hidden h-full bg-gradient-to-br from-secondary/60 via-background to-background">
                <div ref={heroRef} className="overflow-hidden h-full">
                  <div className="flex h-full">
                    {manifestoSlides.map((s, i) => (
                      <div key={i} className="flex-[0_0_100%] min-w-0">
                        <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-between min-h-[360px] lg:min-h-[440px]">
                          <span className="eyebrow text-accent">{s.eyebrow}</span>
                          <div>
                            <h1 className="mt-6 font-display font-extrabold text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-[-0.035em] text-balance text-foreground max-w-3xl">
                              {s.title}
                            </h1>
                            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                              {s.body}
                            </p>
                          </div>
                          <div className="mt-8 flex items-center gap-3">
                            <Link
                              to="/profil/surecim"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition"
                            >
                              Sürece başla <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                              to="/bilimsel"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border border-hairline text-sm font-semibold text-foreground hover:border-accent/40 transition"
                            >
                              Bilimi keşfet
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Süreç bölümü — 4/12 */}
            <aside className="lg:col-span-4">
              <div className="surface-card h-full p-6 md:p-7 bg-background flex flex-col">
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

                <div className="mt-5 rounded-2xl p-5 bg-secondary/60 border border-hairline">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-background border border-hairline flex items-center justify-center">
                      <TreePine className="h-6 w-6 text-accent" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-display font-extrabold text-3xl tracking-[-0.02em] leading-none">
                        {days}
                        <span className="ml-1 text-sm text-muted-foreground font-bold">Ağaç</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Bağımlılıktan uzak gün</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <MiniStat icon={BookmarkCheck} value={completedSlugs.size} label="Okunan" />
                  <MiniStat icon={BookOpen} value={pendingSlugs.length} label="Bekleyen" />
                </div>

                <button
                  onClick={() => nextSlug && navigate(`/yazi/${nextSlug}`)}
                  disabled={!nextSlug}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  <Shuffle className="h-4 w-4" /> Sıradaki yazıya geç
                </button>

                <div className="mt-5 pt-5 border-t border-hairline">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Bugünkü check-in
                    </span>
                    <Link to="/profil/surecim" className="font-semibold text-accent hover:underline">
                      Yap →
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============ 2. KATEGORİ HIZLI GEÇİŞ ŞERİDİ ============ */}
      <section className="border-y border-hairline bg-surface-sunken/40">
        <div className="wide-column px-4 md:px-6 py-5">
          <div ref={stripRef} className="overflow-hidden">
            <div className="flex gap-3">
              {stripCats.map((c) => (
                <Link
                  key={c.name}
                  to={c.to}
                  className="group shrink-0 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-background border border-hairline hover:border-accent/40 hover:-translate-y-0.5 transition-all"
                >
                  <c.icon className="h-4 w-4 text-accent" strokeWidth={2} />
                  <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {c.name}
                  </span>
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

          {/* Sağ: Başarı hikayeleri */}
          <aside className="lg:col-span-4 space-y-6">
            <div>
              <span className="eyebrow text-accent">Kolektif</span>
              <h2 className="mt-1 font-display font-extrabold text-2xl md:text-3xl tracking-[-0.03em]">
                Son Başarı Hikayeleri
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { name: "Anonim · 92 gün", quote: "İlk kez 'belki yapabilirim' dedim. Sonra yaptım. Sonra tekrar yaptım." },
                { name: "M. K. · 184 gün", quote: "Geri düştüm, üzüldüm, devam ettim. Önemli olan tekrar başlamak." },
                { name: "E. · 31 gün", quote: "İlk ay en zorudur derler, doğruymuş. Ama yalnız değildim — bu yeterliydi." },
                { name: "Anonim · 365 gün", quote: "Bir yıl önce bunu okusam inanmazdım. Şimdi başkasına yazıyorum." },
              ].map((s, i) => (
                <article key={i} className="surface-card p-5 bg-background hover:-translate-y-0.5 transition">
                  <Quote className="h-4 w-4 text-accent" />
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{s.quote}</p>
                  <div className="mt-3 text-xs font-semibold text-muted-foreground">{s.name}</div>
                </article>
              ))}
            </div>

            <Link to="/kolektif" className="block text-center text-sm font-semibold text-accent hover:underline">
              Tüm hikayeler →
            </Link>
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
