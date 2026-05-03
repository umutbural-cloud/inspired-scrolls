import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Highlighter, NotebookPen, ArrowRight } from "lucide-react";
import { AccountGuard } from "@/components/site/AccountGuard";
import { AccountLayout } from "@/components/site/AccountLayout";
import { articles } from "@/data/mock";

type Item = {
  slug: string;
  title: string;
  cover: string;
  highlights: { id: string; text: string; createdAt: number }[];
  notes: { id: string; text: string; createdAt: number }[];
};

const Inner = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const list: Item[] = [];
    for (const a of articles) {
      let hl: any[] = [];
      let nt: any[] = [];
      try {
        hl = JSON.parse(localStorage.getItem(`hl:${a.slug}`) || "[]");
      } catch {}
      try {
        nt = JSON.parse(localStorage.getItem(`notes:${a.slug}`) || "[]");
      } catch {}
      if ((hl?.length || 0) + (nt?.length || 0) === 0) continue;
      list.push({
        slug: a.slug,
        title: a.title,
        cover: a.cover,
        highlights: hl,
        notes: nt,
      });
    }
    setItems(list);
  }, []);

  const totalH = items.reduce((s, i) => s + i.highlights.length, 0);
  const totalN = items.reduce((s, i) => s + i.notes.length, 0);

  return (
    <AccountLayout
      eyebrow="Okuma Odası"
      title="Notlarım"
      description={`${totalH} vurgu · ${totalN} not — tüm yazılarındaki birikim.`}
    >
      {items.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center surface-card">
          Henüz vurgu veya not almadın. Bir yazıyı okurken metni seçerek vurgulayabilir, yan panelden not bırakabilirsin.
        </p>
      ) : (
        <div className="space-y-10">
          {items.map((it) => (
            <section key={it.slug} className="surface-card overflow-hidden">
              <Link
                to={`/profil/tamamlanan/${it.slug}`}
                className="flex items-center gap-4 p-4 border-b border-hairline hover:bg-secondary/40 transition-colors group"
              >
                <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  <img src={it.cover} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg leading-snug group-hover:text-accent transition-colors line-clamp-1">
                    {it.title}
                  </h3>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {it.highlights.length} vurgu · {it.notes.length} not
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" strokeWidth={2.5} />
              </Link>

              <div className="p-5 grid md:grid-cols-2 gap-5">
                {it.highlights.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Highlighter className="h-3 w-3 text-accent" strokeWidth={2.5} />
                      Vurgular
                    </div>
                    <ul className="space-y-2">
                      {it.highlights.slice(0, 5).map((h) => (
                        <li key={h.id} className="text-sm leading-relaxed">
                          <span className="user-highlight">{h.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {it.notes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <NotebookPen className="h-3 w-3 text-accent" strokeWidth={2.5} />
                      Notlar
                    </div>
                    <ul className="space-y-2">
                      {it.notes.slice(0, 5).map((n) => (
                        <li
                          key={n.id}
                          className="text-sm leading-relaxed border-l-2 border-accent/40 pl-3 whitespace-pre-wrap"
                        >
                          {n.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

const Notes = () => (
  <AccountGuard>
    <Inner />
  </AccountGuard>
);

export default Notes;
