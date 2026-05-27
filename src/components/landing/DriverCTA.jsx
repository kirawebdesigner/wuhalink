import { Link } from "react-router-dom";
import { Truck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function DriverCTA() {
  const { lang } = useLanguage();
  return (
    <section className="px-5 py-10">
      <div className="max-w-lg mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-6 text-center border border-primary/10">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-bold text-lg mt-4">
          {lang === "am" ? "የውሃ አቅራቢ ነዎት?" : "Are you a water supplier?"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          {lang === "am"
            ? "WuhaLink ይቀላቀሉ እና ያለ ማስታወቂያ ደንበኞችን ያግኙ።"
            : "Join WuhaLink and get customers without advertising. Simple setup, more business."}
        </p>
        <Link to="/driver">
          <button className="mt-5 rounded-2xl h-11 px-6 font-bold bg-primary text-primary-foreground flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors active:scale-95">
            {t(lang, "joinPlatform")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </section>
  );
}
