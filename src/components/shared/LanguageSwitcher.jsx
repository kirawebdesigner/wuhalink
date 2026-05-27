import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          lang === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("am")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          lang === "am"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        አማ
      </button>
    </div>
  );
}
