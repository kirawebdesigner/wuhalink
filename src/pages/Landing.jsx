import Logo from "@/components/shared/Logo";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DriverCTA from "@/components/landing/DriverCTA";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function Landing() {
  const { lang } = useLanguage();
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
            {t(lang, "tagline")}
          </span>
          <LanguageSwitcher />
        </div>
      </header>

      <HeroSection />
      <FeaturesSection />
      <DriverCTA />

      <footer className="text-center text-xs text-muted-foreground py-6 border-t border-border/50">
        {t(lang, "copyright")}
      </footer>
    </div>
  );
}
