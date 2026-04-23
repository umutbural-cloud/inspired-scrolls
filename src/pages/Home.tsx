import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArticleCard } from "@/components/site/ArticleCard";
import { featured, recent, popular, articles } from "@/data/mock";
import heroImg from "@/assets/hero-feature.jpg";

const Home = () => {
  return (
    <SiteLayout>
      {/* Hero — Bugünün Yazısı */}
      <section className="border-b border-hairline">
        <div className="wide-column px-6 pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 animate-fade-up order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="eyebrow text-accent">Bugünün Yazısı</span>
                <span className="h-px w-16 bg-hairline" />
                <span className="text-xs text-muted-foreground font-mono-jb">
                  {featured.publishedAt.toUpperCase()}
                </span>
              </div>
              <Link to={`/yazi/${featured.slug}`} className="group block">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-balance">
                  {featured.title}
                </h1>
                <p className="mt-5 text-lg md:text-xl leading-snug text-muted-foreground text-balance max-w-xl">
                  {featured.subtitle}
                </p>
              </Link>
              <p className="mt-5 text-[0.98rem] md:text-base leading-relaxed text-foreground/80 max-w-xl text-pretty">
                {featured.excerpt}
              </p>
              <div className="mt-8 flex items-center gap-5 flex-wrap">
                <Link
                  to={`/yazi/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium px-4 h-10 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md"
                >
                  Okumaya başla <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
                <span className="text-xs text-muted-foreground">
                  {featured.author.name} · {featured.readMinutes} dakika
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 animate-scale-in order-1 lg:order-2">
              <Link to={`/yazi/${featured.slug}`} className="block group">
                <div className="aspect-[3/4] overflow-hidden bg-secondary">
                  <img
                    src={heroImg}
                    alt={featured.title}
                    width={1600}
                    height={2000}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Editörün seçimi · {featured.category}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Son Yazılar + Haftanın Çok Okunanları */}
      <section className="wide-column px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Son Yazılar */}
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-display text-3xl md:text-4xl">Son Yazılar</h2>
              <Link to="/arastirmalar" className="text-sm link-quiet text-muted-foreground hover:text-foreground">
                Hepsini gör
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-14">
              {recent.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>

          {/* Haftanın çok okunanları */}
          <aside className="lg:col-span-4 lg:border-l lg:border-hairline lg:pl-12">
            <h2 className="font-display text-2xl mb-8">Haftanın Çok Okunanları</h2>
            <ol className="space-y-7">
              {popular.map((a, i) => (
                <li key={a.slug} className="flex gap-4">
                  <span className="font-display text-3xl text-accent leading-none w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link to={`/yazi/${a.slug}`} className="group flex-1 min-w-0">
                    <span className="eyebrow text-muted-foreground text-[0.65rem]">{a.category}</span>
                    <h3 className="font-display text-base leading-snug mt-1 group-hover:text-accent transition-colors text-balance">
                      {a.title}
                    </h3>
                    <div className="mt-1.5 text-xs text-muted-foreground">
                      {a.author.name} · {a.readMinutes} dk
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* Manifesto banner */}
      <section className="border-y border-hairline bg-surface-sunken/40">
        <div className="content-column px-6 py-20 md:py-28 text-center">
          <span className="eyebrow text-accent">Yaklaşımımız</span>
          <p className="mt-6 font-display font-semibold text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight text-balance max-w-3xl mx-auto">
            Kişisel gelişim hızlı tüketilen bir tavsiye değildir.
            Düşünmek, denemek ve uygulamak için zaman ister.
          </p>
          <div className="mt-8 text-xs text-muted-foreground font-mono-jb tracking-wider">
            DÜŞÜN · UYGULA · İLERLE
          </div>
        </div>
      </section>

      {/* İki şerit — Araştırmalar & Kolektif */}
      <section className="wide-column px-6 py-20 md:py-24">
        <div className="grid md:grid-cols-2 gap-px bg-hairline border border-hairline">
          <Link
            to="/arastirmalar"
            className="group bg-background p-10 md:p-12 hover:bg-surface-sunken transition-colors"
          >
            <span className="eyebrow text-accent">Bölüm</span>
            <h3 className="mt-3 font-display text-3xl md:text-4xl group-hover:text-accent transition-colors">
              Araştırmalar
            </h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Kanıta dayalı, derinlemesine incelemeler. Her yazı kaynakları ve
              uygulanabilir çıkarımlarıyla birlikte gelir.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm border-b border-foreground/40 pb-0.5 group-hover:border-accent group-hover:text-accent transition-colors">
              Tüm araştırmalar <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </Link>
          <Link
            to="/kolektif"
            className="group bg-background p-10 md:p-12 hover:bg-surface-sunken transition-colors"
          >
            <span className="eyebrow text-accent">Bölüm</span>
            <h3 className="mt-3 font-display text-3xl md:text-4xl group-hover:text-accent transition-colors">
              Kolektif
            </h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Yazarların ilk elden deneyim ve denemelerine dayanan yazılar.
              Pratiğin içinden gelen sesler.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm border-b border-foreground/40 pb-0.5 group-hover:border-accent group-hover:text-accent transition-colors">
              Tüm kolektif <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </Link>
        </div>
      </section>

      {/* Arşivden */}
      <section className="wide-column px-6 pb-20">
        <div className="flex items-baseline justify-between mb-8 pt-12 border-t border-hairline">
          <h2 className="font-display text-2xl">Arşivden</h2>
          <Link to="/arastirmalar" className="text-sm link-quiet text-muted-foreground">
            Hepsini gör
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-x-12">
          {articles.slice(0, 6).map((a) => (
            <ArticleCard key={a.slug} article={a} variant="minimal" />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Home;
