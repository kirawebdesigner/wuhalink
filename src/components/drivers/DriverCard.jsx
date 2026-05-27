import { Phone, MessageCircle, Clock, Droplets, BadgeCheck, Sparkles } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import StarRating from "@/components/shared/StarRating";
import { t } from "@/lib/i18n";

export default function DriverCard({ driver, onContact, lang = "en" }) {
  const handleCall = () => {
    onContact?.(driver.id, "call");
    window.location.href = `tel:${driver.phone}`;
  };

  const handleWhatsApp = () => {
    onContact?.(driver.id, "whatsapp");
    const phone = driver.whatsapp || driver.phone;
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(`Hi, I found you on WuhaLink. I need water delivery.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm active:scale-[0.99] transition-transform">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {driver.photo_url ? (
            <img src={driver.photo_url} alt={driver.name} className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
          )}
          {driver.is_verified && (
            <BadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-primary fill-white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-sm truncate">{driver.name}</h3>
            {driver.is_featured && <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
          </div>
          <StarRating rating={driver.rating} count={driver.total_reviews} />
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {(driver.truck_size || 0).toLocaleString()}{t(lang, "liters")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {driver.delivery_time || `~30 ${t(lang, "min")}`}
            </span>
          </div>
        </div>

        {/* Price & Status */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={driver.status} lang={lang} />
          <span className="text-lg font-bold">
            {(driver.price || 0).toLocaleString()}
            <span className="text-[10px] font-normal text-muted-foreground ml-0.5">{t(lang, "etb")}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleCall}
          className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm shadow-primary/30"
        >
          <Phone className="w-3.5 h-3.5" />
          {t(lang, "call")}
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 h-10 rounded-xl border border-emerald-300 text-emerald-700 bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {t(lang, "whatsapp")}
        </button>
      </div>
    </div>
  );
}
