import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { SiteLayout } from "./SiteLayout";
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Users,
  Settings,
  Bell,
  Tags,
} from "lucide-react";

const sections = [
  {
    label: "Genel",
    items: [{ to: "/profil", label: "Genel Bakış", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Okuma Odası",
    items: [
      { to: "/profil/listeler", label: "Okuma Listeleri", icon: Bookmark },
      { to: "/profil/tamamlanan", label: "Tamamladığım Yazılar", icon: CheckCircle2 },
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
  return (
    <SiteLayout>
      <div className="wide-column px-6 pt-12 md:pt-16 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div>
                <span className="eyebrow text-accent flex items-center gap-2">
                  <BookOpen className="h-3 w-3" strokeWidth={1.5} /> Hesabım
                </span>
              </div>
              <nav className="space-y-7">
                {sections.map((sec) => (
                  <div key={sec.label}>
                    <div className="eyebrow mb-3 text-muted-foreground">{sec.label}</div>
                    <ul className="space-y-1">
                      {sec.items.map((it) => (
                        <li key={it.to}>
                          <NavLink
                            to={it.to}
                            end={"end" in it && it.end}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-3 py-2 -mx-3 text-sm transition-colors ${
                                isActive
                                  ? "text-foreground bg-surface-sunken/60"
                                  : "text-muted-foreground hover:text-foreground"
                              }`
                            }
                          >
                            <it.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                            <span>{it.label}</span>
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
          <section className="lg:col-span-9 min-w-0">
            <header className="pb-8 border-b border-hairline mb-10 flex items-end justify-between gap-6 flex-wrap">
              <div>
                {eyebrow && <span className="eyebrow text-accent">{eyebrow}</span>}
                <h1 className="mt-2 font-display text-3xl md:text-4xl tracking-tight text-balance">
                  {title}
                </h1>
                {description && (
                  <p className="mt-3 font-serif-body text-muted-foreground max-w-xl text-pretty">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </header>
            {children}
          </section>
        </div>
      </div>
    </SiteLayout>
  );
};