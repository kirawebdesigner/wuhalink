import { t } from "@/lib/i18n";

export default function StatusBadge({ status, lang = "en" }) {
  const isAvailable = status === "available";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
        isAvailable
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-600 border-red-200"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
      {isAvailable ? t(lang, "availableStatus") : t(lang, "busyStatus")}
    </span>
  );
}
