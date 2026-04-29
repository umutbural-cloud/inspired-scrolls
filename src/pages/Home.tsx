import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, Flame, TrendingUp } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArticleCard } from "@/components/site/ArticleCard";
import { featured, recent, popular, articles } from "@/data/mock";
import heroImg from "@/assets/hero-feature.jpg";

const Home = () => {
  return (
    <SiteLayout>
      {/* Hero — modern, dinamik */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-accent-glow/10 blur-3xl" />

        <div className="wide-column relative px-6 pt-10 pb-12 md:pt-20 md:pb-24">
          {/* Top tagline pill */}
          <div className="flex justify-center mb-6 md:mb-10 animate-fade-in">
            <Link to="/manifesto" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 backdrop-blur text-xs font-medium text-foreground/80 hover:bg-secondary transition-colors">
              <Sparkles className="h-3 w-3 text-accent" strokeWidth={2.5} />
              <span>Yeni nesil için kişisel gelişim</span>
              <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Big headline */}
          <div className="text-center max-w-4xl mx-auto animate-fade-up">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.04em] text-balance">
              Düşün. Dene. <span className="text-accent">İlerle.</span>
            </h1>
            <p className="mt-5 md:mt-7 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-snug">
              Genç yetişkinler için derin ama enerjik kişisel gelişim yazıları.
              Tavsiye değil — gerçek deneyimler, araştırmalar ve denemeler.
            </p>
            <div className="mt-7 md:mt-9 flex items-center justify-center gap-3 flex-wrap">
              <Link to="/arastirmalar" className="btn-pill btn-pill-accent">
                Keşfetmeye başla <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link to="/kolektif" className="btn-pill btn-pill-ghost">
                Kolektif yazılar
              </Link>
            </div>
          </div>

          {/* Featured card — glass */}
          <div className="mt-12 md:mt-20 animate-scale-in">
            <Link to={`/yazi/${featured.slug}`} className="group block surface-card overflow-hidden p-3 md:p-4">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-stretch">
                <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden rounded-xl bg-secondary">
                  <img
                    src={heroImg}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="tag bg-background/95 backdrop-blur-sm">
                      <Flame className="h-3 w-3 mr-1" strokeWidth={2.5} />
                      Bugünün yazısı
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <span>{featured.category}</span>
                      <span>·</span>
                      <span>{featured.readMinutes} dk okuma</span>
                    </div>
                    <h2 className="card-title mt-3 font-display font-bold text-2xl md:text-3xl lg:text-4xl leading-[1.05] tracking-tight text-balance">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={featured.author.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-background" />
                      <div className="text-xs">
                        <div className="font-semibold text-foreground">{featured.author.name}</div>
                        <div className="text-muted-foreground">{featured.publishedAt}</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                      Oku <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Son Yazılar + Haftanın Çok Okunanları */}
      <section className="wide-column px-6 py-12 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Son Yazılar */}
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between mb-6 md:mb-10">
              <div>
                <span className="eyebrow">Son Yazılar</span>
                <h2 className="mt-2 font-display font-bold text-2xl md:text-4xl tracking-tight">Yeni çıkanlar</h2>
              </div>
              <Link to="/arastirmalar" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-accent transition-colors">
                Tümü <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </div>
            {/* Mobile: compact list */}
            <div className="grid grid-cols-1 gap-5 sm:hidden">
              {recent.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="compact" />
              ))}
            </div>
            {/* Desktop / tablet: full cards */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-x-8 gap-y-12">
              {recent.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>

          {/* Haftanın çok okunanları */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start pt-10 lg:pt-0 border-t lg:border-t-0 border-hairline">
            <div className="surface-card p-6 md:p-7 bg-gradient-to-br from-accent-soft/40 to-secondary/40">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="h-4 w-4 text-accent" strokeWidth={2.5} />
                <span className="eyebrow">Trend</span>
              </div>
              <h2 className="font-display font-bold text-xl md:text-2xl mb-6 tracking-tight">
                Bu hafta çok okunanlar
              </h2>
              <ol className="space-y-5">
                {popular.map((a, i) => (
                  <li key={a.slug}>
                    <Link to={`/yazi/${a.slug}`} className="group flex gap-3 items-start">
                      <span className="font-display text-xl font-extrabold text-accent leading-none w-7 shrink-0 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-sm md:text-[0.95rem] leading-snug group-hover:text-accent transition-colors text-balance">
                          {a.title}
                        </h3>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {a.author.name} · {a.readMinutes} dk
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      {/* Manifesto banner — bold, modern */}
      <section className="px-6 py-10 md:py-20">
        <div className="wide-column">
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-16">
            <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/40 blur-3xl" />
            <div aria-hidden className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-accent-glow/30 blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full bg-background/10 text-xs font-semibold tracking-wide text-background/80">
                YAKLAŞIMIMIZ
              </span>
              <p className="mt-5 font-display font-extrabold text-2xl md:text-5xl leading-[1.05] tracking-[-0.03em] text-balance">
                Kişisel gelişim, hızlı tüketilen bir <span className="text-accent">hayat hack'i</span> değildir.
              </p>
              <p className="mt-4 text-base md:text-lg text-background/70 max-w-xl leading-relaxed">
                Düşünmek, denemek ve gerçekten ilerlemek için zaman ister.
                Biz o zamanı yaratmak için yazıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* İki şerit — Araştırmalar & Kolektif */}
      <section className="wide-column px-6 py-10 md:py-20">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <Link
            to="/arastirmalar"
            className="group surface-card p-6 md:p-10 hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="tag">Bölüm</span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:rotate-12 transition-all" strokeWidth={2} />
            </div>
            <h3 className="mt-4 font-display font-bold text-2xl md:text-3xl tracking-tight group-hover:text-accent transition-colors">
              Araştırmalar
            </h3>
            <p className="mt-3 text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed max-w-sm">
              Kanıta dayalı, derinlemesine incelemeler. Kaynaklarla birlikte,
              uygulanabilir çıkarımlar.
            </p>
          </Link>
          <Link
            to="/kolektif"
            className="group surface-card p-6 md:p-10 hover:-translate-y-1 transition-transform bg-gradient-to-br from-accent-soft/30 to-transparent"
          >
            <div className="flex items-center justify-between">
              <span className="tag">Bölüm</span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:rotate-12 transition-all" strokeWidth={2} />
            </div>
            <h3 className="mt-4 font-display font-bold text-2xl md:text-3xl tracking-tight group-hover:text-accent transition-colors">
              Kolektif
            </h3>
            <p className="mt-3 text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed max-w-sm">
              Yazarların ilk elden deneyim ve denemeleri. Pratiğin içinden
              gelen, gerçek sesler.
            </p>
          </Link>
        </div>
      </section>

      {/* Arşivden */}
      <section className="wide-column px-6 pb-16 md:pb-24">
        <div className="flex items-end justify-between mb-6 md:mb-8 pt-10 md:pt-12 border-t border-hairline">
          <div>
            <span className="eyebrow">Arşiv</span>
            <h2 className="mt-2 font-display font-bold text-2xl md:text-3xl tracking-tight">Daha fazla oku</h2>
          </div>
          <Link to="/arastirmalar" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-accent transition-colors">
            Tümü <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
        {/* Mobile: compact list (image + title) */}
        <div className="grid grid-cols-1 gap-5 md:hidden">
          {articles.slice(0, 6).map((a) => (
            <ArticleCard key={a.slug} article={a} variant="compact" />
          ))}
        </div>
        {/* Desktop / tablet: minimal list */}
        <div className="hidden md:grid md:grid-cols-2 gap-x-12">
          {articles.slice(0, 6).map((a) => (
            <ArticleCard key={a.slug} article={a} variant="minimal" />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Home;
