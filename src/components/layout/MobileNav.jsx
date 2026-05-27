import { Link, useLocation } from "react-router-dom";
import { Home, Search, Truck, Shield } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function MobileNav() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  const [role, setRole] = useState(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (isAuthed) => {
      setAuthed(isAuthed);
      if (isAuthed) {
        const me = await base44.auth.me();
        setRole(me.role);
      }
    });
  }, []);

  const driverPath = authed ? "/driver" : "/driver-login";

  const navItems = [
    { path: "/", icon: Home, label: t(lang, "home") },
    { path: "/find", icon: Search, label: t(lang, "find") },
    { path: driverPath, icon: Truck, label: t(lang, "driver") },
    ...(role === "admin" ? [{ path: "/admin", icon: Shield, label: t(lang, "admin") }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 border-t border-border backdrop-blur-lg">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path || (path === driverPath && (pathname === "/driver" || pathname === "/driver-login"));
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
