import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FlaskConical, Filter, Microscope, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

type Study = {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  findings: string;
  categories: string[];
  topics: string[];
};

const studies: Study[] = [
  {
    slug: "porn-consumption-sexual-choking",
    title: "Pornografi Tüketimi ve Cinsel Boğma: Teorik Mekanizmaların Bir Değerlendirmesi",
    authors: ["Wright, Paul J.", "Herbenick, Debby", "Tokunaga, Robert S."],
    year: 2021,
    journal: "Health Communication",
    findings:
      "Pornografi tüketiminin, cinsel partneri boğma olasılığını öngördüğü; bunun pornografide boğma davranışının normalleştirilmesinden kaynaklandığı düşünülüyor.",
    categories: ["İlişkiler", "Toplum"],
    topics: ["Saldırı Kültürü", "Cinsiyet Eşitsizliği", "Riskli Cinsel Davranış", "Cinsel Saldırganlık"],
  },
  {
    slug: "porn-vs-sexual-science",
    title: "Pornografi ve Cinsel Bilim: ABD'deki Gençlerin Cinsel Cehaletinde Pornografi Kullanımının Rolü",
    authors: ["Wright, Paul J.", "Tokunaga, Robert S.", "Herbenick, Debby", "Paul, Bryant"],
    year: 2021,
    journal: "Communication Monographs",
    findings:
      "Pornografi tüketimi cinsel yanlış bilgilere inanmayla ilişkili; pornografi gençleri cinsel olarak daha bilgisiz hale getiriyor.",
    categories: ["Bireyler", "İlişkiler", "Toplum"],
    topics: ["Riskli Cinsel Davranış", "Cinsel Tutumlar", "Gençler"],
  },
  {
    slug: "dehumanization-sexual-aggression",
    title: "Pornografi Kullanımı, İki Tür İnsanlıktan Çıkarma ve Cinsel Saldırganlık",
    authors: ["Zhou, Yanyan", "Liu, Tuo", "Yan, Yaojun", "Paul, Bryant"],
    year: 2021,
    journal: "Journal of Sex & Marital Therapy",
    findings:
      "Pornografi tüketimi hem hayvansal hem mekanik insanlıktan çıkarma ile ilişkili; bunlar saldırgan cinsel tutum ve davranışları öngörüyor.",
    categories: ["Toplum"],
    topics: ["Saldırı Kültürü", "Nesneleştirme", "Cinsel Saldırganlık"],
  },
  {
    slug: "motivational-basis-of-porn-use",
    title: "İnsanlar Neden Pornografi İzler? Pornografi Kullanımının Motivasyon Temelleri",
    authors: ["Bőthe, Beáta", "Tóth-Király, István", "Potenza, Marc N.", "Demetrovics, Zsolt"],
    year: 2021,
    journal: "Psychology of Addictive Behaviors",
    findings:
      "Stres azaltma, duygu bastırma, can sıkıntısından kaçınma ve fantezi motivasyonları Problemli Pornografi Kullanımı ile ilişkili. Stres en güçlü öngörücü.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Mental Sağlık", "Cinsel Tutumlar"],
  },
  {
    slug: "adolescent-pornography-exposure",
    title: "ABD Gençlerinde Pornografiye Maruz Kalma, Medya Psikolojisi ve Cinsel Saldırganlık",
    authors: ["Wright, Paul J.", "Paul, Bryant", "Herbenick, Debby"],
    year: 2021,
    journal: "Journal of Health Communication",
    findings:
      "14-18 yaş arası erkeklerin %84,4'ü, kızların %57,1'i pornografi izlemiş. Pornografiye maruz kalma cinsel saldırganlıkla anlamlı şekilde ilişkili.",
    categories: ["Toplum"],
    topics: ["Yaygınlık", "Cinsel Saldırganlık", "Cinsel Tutumlar", "Gençler"],
  },
  {
    slug: "ppu-and-mental-health",
    title: "Problemli Pornografi Kullanımı, Depresyon ve Anksiyete Arasındaki İlişki",
    authors: ["Camilleri, Christian", "Perry, John T.", "Sammut, Stephen"],
    year: 2021,
    journal: "Frontiers in Psychology",
    findings:
      "Problemli pornografi kullanımı; depresyon, anksiyete ve düşük yaşam doyumu ile güçlü şekilde ilişkili bulundu.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Mental Sağlık", "Depresyon"],
  },
  {
    slug: "social-media-addiction-teens",
    title: "Ergenlerde Sosyal Medya Bağımlılığı ve Akademik Performans",
    authors: ["Andreassen, Cecilie S.", "Pallesen, Ståle"],
    year: 2020,
    journal: "Computers in Human Behavior",
    findings:
      "Yoğun sosyal medya kullanımı akademik performansta düşüş, uyku bozukluğu ve dikkat eksikliği ile ilişkili.",
    categories: ["Bireyler", "Toplum"],
    topics: ["Davranışsal Bağımlılık", "Dikkat", "Gençler"],
  },
  {
    slug: "smartphone-dopamine-loop",
    title: "Akıllı Telefon Kullanımı, Dopamin Döngüleri ve Ödül Sistemleri",
    authors: ["Lembke, Anna"], 
    year: 2021,
    journal: "Dopamine Nation Reviews",
    findings:
      "Sürekli bildirim ve sonsuz kaydırma mekanizmaları, beynin ödül sistemini bağımlılık benzeri kalıplara sokuyor.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Dikkat", "Mental Sağlık"],
  },
  {
    slug: "neuroscience-of-internet-pornography",
    title: "İnternet Pornografisinin Sinirbilimi: Sistematik Bir Derleme",
    authors: ["Love, Todd", "Laier, Christian", "Brand, Matthias", "Hatch, Linda", "Hajela, Raju"],
    year: 2015,
    journal: "Behavioral Sciences",
    findings:
      "Sürekli pornografi tüketimi, beynin ön korteks ve ödül devrelerinde madde bağımlılığına benzer değişiklikler yaratıyor.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Beyin Plastisitesi", "Mental Sağlık"],
  },
  {
    slug: "porn-and-relationship-satisfaction",
    title: "Pornografi Kullanımı ve İlişki Doyumu: Boylamsal Bir Çalışma",
    authors: ["Perry, Samuel L."],
    year: 2020,
    journal: "Archives of Sexual Behavior",
    findings:
      "Pornografi tüketiminin zaman içinde evlilik kalitesi ve ilişki doyumunda belirgin düşüşle ilişkili olduğu bulundu.",
    categories: ["İlişkiler"],
    topics: ["İlişki Doyumu", "Partner Etkileri"],
  },
  {
    slug: "gaming-disorder-who",
    title: "Oyun Bozukluğu: DSÖ Sınıflandırması ve Klinik Sonuçları",
    authors: ["Pontes, Halley M.", "Griffiths, Mark D."],
    year: 2020,
    journal: "International Journal of Mental Health and Addiction",
    findings:
      "DSÖ tarafından tanınan oyun bozukluğu; uyku, akademik başarı ve sosyal işlevsellikte ciddi bozulmalarla ilişkili.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Mental Sağlık", "Gençler"],
  },
  {
    slug: "porn-recovery-self-report",
    title: "Pornografi Kullanımını Bırakmaya Çalışan Bireylerde Toparlanma Süreci",
    authors: ["Fernandez, David P.", "Tee, Eugene Y. J.", "Fernandez, Elaine F."],
    year: 2017,
    journal: "Sexual Addiction & Compulsivity",
    findings:
      "Bırakma girişimleri sırasında geri tepme döngüleri yaygın; sosyal destek ve farkındalık temelli yaklaşımlar başarıyı artırıyor.",
    categories: ["Bireyler"],
    topics: ["Davranışsal Bağımlılık", "Toparlanma", "Mental Sağlık"],
  },
];

const allCategories = Array.from(new Set(studies.flatMap((s) => s.categories))).sort();
const allTopics = Array.from(new Set(studies.flatMap((s) => s.topics))).sort();

const Scientific = () => {
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [activeTopics, setActiveTopics] = useState<string[]>([]);

  const toggle = (val: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  };

  const filtered = useMemo(() => {
    return studies.filter((s) => {
      const catOk = activeCats.length === 0 || activeCats.some((c) => s.categories.includes(c));
      const topOk = activeTopics.length === 0 || activeTopics.some((t) => s.topics.includes(t));
      return catOk && topOk;
    });
  }, [activeCats, activeTopics]);

  const clearAll = () => {
    setActiveCats([]);
    setActiveTopics([]);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-accent-glow/10 blur-3xl" />
        <div className="wide-column relative px-6 pt-14 md:pt-20 pb-10 md:pb-14">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 backdrop-blur text-xs font-medium text-foreground/80">
              <Microscope className="h-3 w-3 text-accent" strokeWidth={2.5} />
              Bağımlılık üzerine bilimsel çalışmalar
            </span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.04em] text-balance">
              Bilimsel <span className="text-accent">Çalışmalar</span>
            </h1>
            <p className="mt-5 md:mt-7 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-snug">
              Bağımlılık üzerine yapılan akademik makalelerin değerlendirildiği,
              kategorilere ayrılmış ve özetlenmiş bir kütüphane.
            </p>
            <div className="mt-7 flex items-center justify-center gap-4 flex-wrap text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4 text-accent" strokeWidth={2.5} />
                {studies.length} çalışma
              </span>
              <span>·</span>
              <span>{allCategories.length} kategori</span>
              <span>·</span>
              <span>{allTopics.length} konu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + List */}
      <section className="wide-column px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Sidebar filters */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="inline-flex items-center gap-2">
                  <Filter className="h-4 w-4 text-accent" strokeWidth={2.5} />
                  <span className="eyebrow">Filtreler</span>
                </div>
                {(activeCats.length > 0 || activeTopics.length > 0) && (
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" /> Temizle
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-display font-bold text-sm mb-3">Kategoriler</h3>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((c) => {
                    const active = activeCats.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => toggle(c, activeCats, setActiveCats)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          active
                            ? "bg-accent text-accent-foreground border-accent"
                            : "border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/30"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm mb-3">Konular</h3>
                <div className="flex flex-wrap gap-2">
                  {allTopics.map((t) => {
                    const active = activeTopics.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggle(t, activeTopics, setActiveTopics)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          active
                            ? "bg-accent text-accent-foreground border-accent"
                            : "border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/30"
                        }`}
                      >
                        #{t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Studies list */}
          <div className="lg:col-span-8 min-w-0">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="eyebrow">Sonuçlar</span>
                <h2 className="mt-2 font-display font-bold text-2xl md:text-3xl tracking-tight">
                  {filtered.length} çalışma
                </h2>
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="text-muted-foreground py-20 text-center">
                Bu filtrelere uygun çalışma bulunamadı.
              </p>
            ) : (
              <ol className="space-y-5 md:space-y-6">
                {filtered.map((s) => (
                  <li key={s.slug} className="surface-card p-6 md:p-7 group">
                    <Link to="#" className="inline-flex items-start gap-2 group/title">
                      <h3 className="font-display font-bold text-lg md:text-xl leading-snug tracking-tight text-balance group-hover/title:text-accent transition-colors">
                        {s.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 mt-1 shrink-0 text-muted-foreground group-hover/title:text-accent transition-colors" strokeWidth={2.5} />
                    </Link>

                    <div className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                      <div>
                        <div className="eyebrow text-muted-foreground mb-1.5">Yazar(lar)</div>
                        <p className="text-foreground/85 leading-relaxed">
                          {s.authors.join("; ")}
                        </p>
                      </div>
                      <div>
                        <div className="eyebrow text-muted-foreground mb-1.5">Yayım</div>
                        <p className="text-foreground/85">
                          {s.year} · <span className="italic">{s.journal}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="eyebrow text-muted-foreground mb-1.5">Temel Bulgular</div>
                      <p className="text-sm md:text-[0.95rem] text-foreground/90 leading-relaxed">
                        {s.findings}
                      </p>
                    </div>

                    <div className="mt-5 pt-5 border-t border-hairline grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="eyebrow text-muted-foreground mb-2">Kategoriler</div>
                        <div className="flex flex-wrap gap-1.5">
                          {s.categories.map((c) => (
                            <span key={c} className="tag">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="eyebrow text-muted-foreground mb-2">Konular</div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          {s.topics.map((t) => (
                            <span key={t}>#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Scientific;