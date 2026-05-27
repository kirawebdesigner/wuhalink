import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";

export default function DriverFilters({ search, onSearchChange, activeFilter, onFilterChange, lang = "en" }) {
  const filters = [
    { value: "all", label: t(lang, "all") },
    { value: "available", label: t(lang, "available") },
    { value: "cheapest", label: t(lang, "cheapest") },
    { value: "fastest", label: t(lang, "fastest") },
    { value: "top_rated", label: t(lang, "topRated") },
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t(lang, "searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 rounded-xl bg-card border-border"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
