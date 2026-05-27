import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Droplets, Loader2 } from "lucide-react";
import Logo from "@/components/shared/Logo";
import DriverCard from "@/components/drivers/DriverCard";
import DriverFilters from "@/components/drivers/DriverFilters";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function FindWater() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { lang } = useLanguage();

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => base44.entities.Driver.filter({ is_approved: true }),
  });

  const logContact = async (driverId, type) => {
    try {
      await base44.entities.CallLog.create({ driver_id: driverId, type });
    } catch {}
  };

  const filtered = useMemo(() => {
    let result = [...drivers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.area?.toLowerCase().includes(q)
      );
    }

    if (filter === "available") {
      result = result.filter((d) => d.status === "available");
    } else if (filter === "cheapest") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filter === "fastest") {
      result.sort((a, b) => {
        const getMin = (t) => parseInt(t?.replace(/\D/g, "") || "99");
        return getMin(a.delivery_time) - getMin(b.delivery_time);
      });
    } else if (filter === "top_rated") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Featured first
    result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    return result;
  }, [drivers, search, filter]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <LanguageSwitcher />
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-bold">{t(lang, "findWaterTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {drivers.length} {t(lang, "driversNearYou")}
          </p>
        </div>

        <DriverFilters
          search={search}
          onSearchChange={setSearch}
          activeFilter={filter}
          onFilterChange={setFilter}
          lang={lang}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Droplets className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground mt-3">{t(lang, "noDriversFound")}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{t(lang, "tryDifferentSearch")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((driver) => (
              <DriverCard key={driver.id} driver={driver} onContact={logContact} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
