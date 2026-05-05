import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Microscope, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { studies } from "@/data/studies";

const StudyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const study = studies.find((s) => s.slug === slug);

  if (!study) {
    return (
      <SiteLayout>
        <section className="wide-column px-6 py-24 text-center">
          <h1 className="font-display font-bold text-3xl mb-4">Çalışma bulunamadı</h1>
          <Link to="/bilimsel" className="text-accent hover:underline">
            ← Bilimsel sayfasına dön
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="reading-column px-6 pt-10 md:pt-14 pb-10 md:pb-14 relative">
          <Link
            to="/bilimsel"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Bilimsel
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur text-xs font-medium text-foreground/80 mb-5">
            <Microscope className="h-3 w-3 text-accent" strokeWidth={2.5} />
            Bilimsel Çalışma
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl leading-[1.05] tracking-[-0.03em] text-balance">
            {study.title}
          </h1>
          <div className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <div className="eyebrow text-muted-foreground mb-1.5">Yazar(lar)</div>
              <p className="text-foreground/85 leading-relaxed">{study.authors.join("; ")}</p>
            </div>
            <div>
              <div className="eyebrow text-muted-foreground mb-1.5">Yayım</div>
              <p className="text-foreground/85">
                {study.year} · <span className="italic">{study.journal}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="reading-column px-6 py-12 md:py-16 space-y-10">
        {/* Abstract */}
        <div className="surface-card p-7 md:p-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-accent" strokeWidth={2.5} />
            <span className="eyebrow">Özet</span>
          </div>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">{study.abstract}</p>
        </div>

        {/* Findings */}
        <div className="surface-card p-7 md:p-8">
          <div className="eyebrow mb-3">Temel Bulgular</div>
          <p className="text-base text-foreground/90 leading-relaxed">{study.findings}</p>
        </div>

        {/* Categories & topics */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="surface-card p-6">
            <div className="eyebrow mb-3">Kategoriler</div>
            <div className="flex flex-wrap gap-1.5">
              {study.categories.map((c) => (
                <span key={c} className="tag">{c}</span>
              ))}
            </div>
          </div>
          <div className="surface-card p-6">
            <div className="eyebrow mb-3">Etiketler</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
              {study.topics.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Neverfap review */}
        <div className="surface-card p-7 md:p-8 border-accent/30 bg-accent/5">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" strokeWidth={2.5} />
            <span className="eyebrow text-accent">Neverfap Değerlendirmesi</span>
          </div>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            {study.neverfapReview}
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default StudyDetail;
