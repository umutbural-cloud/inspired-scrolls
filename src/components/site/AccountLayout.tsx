import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { SiteLayout } from "./SiteLayout";
import {
  LayoutDashboard,
  Bookmark,
  CheckCircle2,
  Users,
  Settings,
  Bell,
  Tags,
  PenLine,
  FileText,
  FileCheck2,
  PanelLeftClose,
  PanelLeftOpen,
  StickyNote,
} from "lucide-react";

const sections = [
  {
    label: "Genel",
    items: [{ to: "/profil", label: "Genel Bakış", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Yazma",
    items: [
      { to: "/profil/yaz/yeni", label: "Yeni Yazı", icon: PenLine },
      { to: "/profil/taslaklar", label: "Taslaklarım", icon: FileText },
      { to: "/profil/yazilar", label: "Yazılarım", icon: FileCheck2 },
    ],
  },
  {
    label: "Okuma Odası",
    items: [
      { to: "/profil/listeler", label: "Okuma Listeleri", icon: Bookmark },
      { to: "/profil/tamamlanan", label: "Tamamladığım Yazılar", icon: CheckCircle2 },
      { to: "/profil/notlarim", label: "Notlarım", icon: StickyNote },
      { to: "/profil/takip", label: "Takip Ettiklerim", icon: Users },
    ],
  },
  {
    label: "Ayarlar",
    items: [
      { to: "/profil/ayarlar", label: "Profil Ayarları", icon: Settings, end: true },
      { to: "/profil/ayarlar/bildirim", label: "Bildirim Ayarları", icon: Bell },
      { to: "/profil/ayarlar/icerik", label: "İçerik Tercihleri", icon: Tags },
    ],
  },
] as const;

export const AccountLayout = ({
  title,
  eyebrow,
  description,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <SiteLayout>
      <div className="wide-column px-4 md:px-6 pt-8 md:pt-10 pb-24">
        <div className={`grid gap-8 lg:gap-12 transition-all duration-300 ${open ? "lg:grid-cols-[260px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 surface-card p-3">
              <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-hairline">
                {open && <span className="eyebrow">Hesabım</span>}
                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-label={open ? "Sidebar'ı kapat" : "Sidebar'ı aç"}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ml-auto"
                >
                  {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </button>
              </div>
              <nav className="space-y-5">
                {sections.map((sec) => (
                  <div key={sec.label}>
                    {open && (
                      <div className="eyebrow mb-2 px-2 text-muted-foreground text-[0.62rem]">
                        {sec.label}
                      </div>
                    )}
                    <ul className="space-y-0.5">
                      {sec.items.map((it) => (
                        <li key={it.to}>
                          <NavLink
                            to={it.to}
                            end={"end" in it && it.end}
                            title={it.label}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-accent/10 text-accent"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                              } ${open ? "" : "justify-center"}`
                            }
                          >
                            <it.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                            {open && <span className="truncate">{it.label}</span>}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <section className="min-w-0">
            <header className="pb-6 md:pb-8 border-b border-hairline mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
              <div>
                {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                <h1 className="mt-2 font-display font-extrabold text-3xl md:text-4xl tracking-[-0.03em] text-balance">
                  {title}
                </h1>
                {description && (
                  <p className="mt-3 text-muted-foreground max-w-xl text-pretty">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </header>
            {children}
          </section>
        </div>
      </div>
    </SiteLayout>
  );
};