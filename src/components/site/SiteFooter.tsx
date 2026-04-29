import { Link } from "react-router-dom";

export const SiteFooter = () => (
  <footer className="mt-20 md:mt-32 border-t border-hairline bg-surface-sunken/60">
    <div className="wide-column px-6 py-14 md:py-16 grid gap-10 md:gap-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display font-extrabold text-2xl tracking-tight">
          Gelişim <span className="text-accent">Yolcuları</span>
        </div>
        <p className="mt-4 max-w-sm text-muted-foreground leading-relaxed text-sm">
          Genç yetişkinler için kişisel gelişim. Düşün, dene, ilerle —
          kestirmesi olmayan bir yolculuk.
        </p>
      </div>

      <div>
        <h4 className="eyebrow mb-4 text-foreground">Keşfet</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/arastirmalar" className="text-muted-foreground hover:text-accent transition-colors">Araştırmalar</Link></li>
          <li><Link to="/kolektif" className="text-muted-foreground hover:text-accent transition-colors">Kolektif</Link></li>
          <li><Link to="/yazarlar" className="text-muted-foreground hover:text-accent transition-colors">Yazarlar</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="eyebrow mb-4 text-foreground">Hakkında</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/manifesto" className="text-muted-foreground hover:text-accent transition-colors">Manifesto</Link></li>
          <li><Link to="/iletisim" className="text-muted-foreground hover:text-accent transition-colors">İletişim</Link></li>
          <li><Link to="/gizlilik" className="text-muted-foreground hover:text-accent transition-colors">Gizlilik</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-hairline">
      <div className="wide-column px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Gelişim Yolcuları. Tüm yazılar yazarlarına aittir.</span>
        <span className="font-mono-jb tracking-[0.2em] text-accent font-medium">DÜŞÜN · DENE · İLERLE</span>
      </div>
    </div>
  </footer>
);
