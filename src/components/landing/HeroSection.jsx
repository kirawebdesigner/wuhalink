import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function HeroSection() {
  const { lang } = useLanguage();
  return (
    <section className="relative overflow-hidden px-5 pt-12 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-10 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-lg mx-auto text-center"
      >
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          {lang === "am" ? "ሹፌሮች አሁን ዝግጁ ናቸው" : "Live drivers available now"}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-foreground">
          {lang === "am" ? (
            <>ጊዜ አያጥፉ<br /><span className="text-primary">ውሃ ፈጠን አግኙ።</span></>
          ) : (
            <>Stop wasting time<br /><span className="text-primary">calling for water.</span></>
          )}
        </h1>

        <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {t(lang, "heroSubtitle")}
        </p>

        <Link to="/find">
          <button className="mt-8 h-13 px-8 py-3 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 bg-primary text-primary-foreground flex items-center gap-2 mx-auto hover:bg-primary/90 transition-all active:scale-95">
            <Search className="w-5 h-5" />
            {t(lang, "findNow")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>

        <p className="mt-3 text-xs text-muted-foreground">
          {lang === "am" ? "ነጻ · ምዝገባ አያስፈልግም" : "Free to use · No registration needed"}
        </p>
      </motion.div>
    </section>
  );
}
