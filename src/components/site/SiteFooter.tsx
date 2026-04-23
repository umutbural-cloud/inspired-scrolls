import { Link } from "react-router-dom";

export const SiteFooter = () => (
  <footer className="mt-32 border-t border-hairline bg-surface-sunken/40">
    <div className="wide-column px-6 py-16 grid gap-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-2xl">
          Gelişim <span className="italic text-accent">Yolcuları</span>
        </div>
        <p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
          Düşünmek için bir yer. Uzun form yazıları, araştırmalar ve denemeler —
          yavaşça okumak ve derinleşmek için.
        </p>
      </div>

      <div>
        <h4 className="eyebrow mb-4">Keşfet</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/arastirmalar" className="link-quiet">Araştırmalar</Link></li>
          <li><Link to="/kolektif" className="link-quiet">Kolektif</Link></li>
          <li><Link to="/yazarlar" className="link-quiet">Yazarlar</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="eyebrow mb-4">Hakkında</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/manifesto" className="link-quiet">Manifesto</Link></li>
          <li><Link to="/iletisim" className="link-quiet">İletişim</Link></li>
          <li><Link to="/gizlilik" className="link-quiet">Gizlilik</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-hairline">
      <div className="wide-column px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Gelişim Yolcuları. Tüm yazılar yazarlarına aittir.</span>
        <span className="font-mono-jb tracking-wider">YAVAŞÇA OKU · DERİNLEŞ</span>
      </div>
    </div>
  </footer>
);
