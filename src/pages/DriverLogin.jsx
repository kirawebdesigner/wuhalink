import { useState } from "react";
import { Droplets, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { t } from "@/lib/i18n";
import { Link } from "react-router-dom";

export default function DriverLogin() {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    base44.auth.redirectToLogin(window.location.origin + "/driver");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-xl p-1.5">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            Wuha<span className="text-primary">Link</span>
          </span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        {/* Icon */}
        <div className="bg-primary rounded-3xl p-5 shadow-xl shadow-primary/20 mb-8">
          <Droplets className="w-14 h-14 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center tracking-tight">
          {lang === "am" ? "የሹፌር መግቢያ" : "Driver Login"}
        </h1>
        <p className="text-muted-foreground text-sm text-center mt-3 max-w-xs leading-relaxed">
          {lang === "am"
            ? "ዝግጁነትዎን ለማስተዳደር እና ስታቲስቲክስ ለማየት ይግቡ።"
            : "Sign in to manage your availability and view your performance stats."}
        </p>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-10 w-full max-w-xs h-16 rounded-2xl bg-primary text-white text-lg font-extrabold shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-70"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {lang === "am" ? "ግባ" : "Sign In"}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Info cards */}
        <div className="mt-10 w-full max-w-xs space-y-3">
          <InfoCard
            icon="🟢"
            title={lang === "am" ? "ዝግጁነት ያስተዳድሩ" : "Manage Availability"}
            desc={lang === "am" ? "ዝግጁ ወይም ስራ ላይ ብለው ይቀናበሩ" : "Toggle available or busy with one tap"}
          />
          <InfoCard
            icon="📊"
            title={lang === "am" ? "ስታቲስቲክስ ይመልከቱ" : "View Statistics"}
            desc={lang === "am" ? "ጥሪዎች እና ዋትሳፕ መልዕክቶችዎን ይከታተሉ" : "Track your calls and WhatsApp contacts"}
          />
          <InfoCard
            icon="💳"
            title={lang === "am" ? "ምዝገባ ሁኔታ" : "Subscription Status"}
            desc={lang === "am" ? "የምዝገባዎን ሁኔታ ያረጋግጡ" : "Check your current subscription status"}
          />
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground pb-6">
        {lang === "am" ? "መለያ ለማሟሟት አስተዳዳሪን ያግኙ" : "Contact admin to get your account set up"}
      </p>
    </div>
  );
}

function InfoCard({ icon, title, desc }) {
  return (
    <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
