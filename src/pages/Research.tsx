import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { articles } from "@/data/mock";

const Research = () => {
  const list = articles.filter((a) => a.kind === "Araştırma");

  return (
    <SiteLayout>
      {/* Akademik başlık */}
      <section className="border-b border-hairline">
        <div className="content-column px-6 pt-20 md:pt-28 pb-14">
          <div className="font-mono-jb text-[0.7rem] tracking-[0.22em] text-muted-foreground">
            VOL. I · NO. 04 · NİSAN 2025 · GELİŞİM YOLCULARI
          </div>
          <div className="mt-8 grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <span className="eyebrow text-accent">Bölüm</span>
              <h1 className="mt-3 font-display text-5xl md:text-6xl tracking-tight leading-[1.02]">
                Araştırmalar
              </h1>
              <p className="mt-5 text-xl text-muted-foreground max-w-xl text-balance">
                Kıdemli yazarlardan kaynaklara dayalı, derinlemesine incelemeler.
                Her metin bir metodoloji notu ve kaynakça ile birlikte gelir.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right text-xs text-muted-foreground space-y-1 font-mono-jb tracking-wider">
              <div>{list.length.toString().padStart(2, "0")} MAKALE</div>
              <div>HAKEMLİ EDİTORYAL SÜREÇ</div>
              <div>KAYNAKÇA ZORUNLU</div>
            </div>
          </div>
        </div>
      </section>

      {/* İçindekiler — akademik tablo */}
      <section className="content-column px-6 py-16">
        <div className="mb-8 flex items-baseline justify-between border-b border-foreground pb-3">
          <h2 className="eyebrow">İçindekiler</h2>
          <span className="eyebrow">Sayfa</span>
        </div>
        <ol className="divide-y divide-hairline">
          {list.map((a, i) => (
            <li key={a.slug}>
              <Link
                to={`/yazi/${a.slug}`}
                className="group grid grid-cols-12 gap-6 py-8 items-baseline"
              >
                <div className="col-span-1 font-mono-jb text-sm text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-11 md:col-span-9">
                  <div className="flex flex-wrap items-baseline gap-3 text-xs text-muted-foreground font-mono-jb tracking-wider">
                    <span className="text-accent">{a.category.toUpperCase()}</span>
                    <span>·</span>
                    <span>{a.tags.slice(0, 2).join(" / ").toUpperCase()}</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl md:text-3xl leading-snug group-hover:text-accent transition-colors text-balance">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground max-w-2xl text-pretty leading-relaxed">
                    {a.subtitle}
                  </p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{a.author.name}</span>
                    <span> — {a.author.title}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.7rem] font-mono-jb tracking-wider text-muted-foreground">
                    <span>YAYIN · {a.publishedAt.toUpperCase()}</span>
                    <span>OKUMA · {a.readMinutes} DK</span>
                    <span>KAYNAKÇA · MEVCUT</span>
                  </div>
                </div>
                <div className="hidden md:block md:col-span-2 text-right font-mono-jb text-sm text-muted-foreground tabular-nums">
                  p. {(i + 1) * 12}
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-16 border-t border-hairline pt-8 text-xs text-muted-foreground font-mono-jb tracking-wider leading-relaxed max-w-2xl">
          <span className="text-foreground">METODOLOJİ —</span> Bu bölümde
          yayımlanan her makale, en az iki bağımsız kaynak referansı içerir ve
          editörlerimizin hakem değerlendirmesinden geçer. Veriler ve alıntılar
          orijinal bağlamlarına bağlanmıştır.
        </div>
      </section>
    </SiteLayout>
  );
};

export default Research;