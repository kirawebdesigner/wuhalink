import { Badge } from "@/components/ui/badge";
import { Check, X, Star, DollarSign, BadgeCheck, Pencil, ShieldCheck } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { t } from "@/lib/i18n";

export default function AdminDriverRow({ driver, lang, onApprove, onRemove, onEdit, onToggleFeatured, onToggleVerified, onTogglePaid }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {driver.photo_url ? (
            <img src={driver.photo_url} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
              {driver.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm truncate">{driver.name}</h3>
              {driver.is_verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">{driver.phone} · {driver.area || "No area"}</p>
          </div>
        </div>
        <StatusBadge status={driver.status} />
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <Badge variant="outline" className="text-[10px] rounded-full">{(driver.truck_size || 0).toLocaleString()}L</Badge>
        <Badge variant="outline" className="text-[10px] rounded-full">{(driver.price || 0).toLocaleString()} ETB</Badge>
        <Badge
          variant={driver.subscription_status === "active" ? "default" : "destructive"}
          className="text-[10px] rounded-full"
        >
          {driver.subscription_status === "active" ? t(lang, "paid") : t(lang, "unpaid")}
        </Badge>
        {driver.is_featured && (
          <Badge className="text-[10px] rounded-full bg-amber-100 text-amber-700 border-amber-200">{t(lang, "featured")}</Badge>
        )}
        {driver.is_approved && (
          <Badge className="text-[10px] rounded-full bg-emerald-50 text-emerald-700 border-emerald-200">{t(lang, "approved")}</Badge>
        )}
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        <ActionBtn
          onClick={() => onEdit(driver)}
          className="bg-primary/10 text-primary border-primary/20"
        >
          <Pencil className="w-3 h-3 mr-1" /> Edit
        </ActionBtn>

        {!driver.is_approved ? (
          <ActionBtn onClick={() => onApprove(driver)} className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Check className="w-3 h-3 mr-1" /> {t(lang, "approve")}
          </ActionBtn>
        ) : (
          <ActionBtn onClick={() => onRemove(driver)} className="bg-red-50 text-red-600 border-red-200">
            <X className="w-3 h-3 mr-1" /> {t(lang, "remove")}
          </ActionBtn>
        )}

        <ActionBtn
          onClick={() => onToggleFeatured(driver)}
          className={driver.is_featured ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-muted text-muted-foreground border-border"}
        >
          <Star className="w-3 h-3 mr-1" />
          {driver.is_featured ? t(lang, "unfeature") : t(lang, "feature")}
        </ActionBtn>

        <ActionBtn
          onClick={() => onToggleVerified(driver)}
          className={driver.is_verified ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}
        >
          <ShieldCheck className="w-3 h-3 mr-1" />
          {driver.is_verified ? "Unverify" : t(lang, "verified")}
        </ActionBtn>

        <ActionBtn
          onClick={() => onTogglePaid(driver)}
          className={driver.subscription_status === "active" ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}
        >
          <DollarSign className="w-3 h-3 mr-1" />
          {driver.subscription_status === "active" ? t(lang, "markUnpaid") : t(lang, "markPaid")}
        </ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, className, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center h-7 px-2.5 rounded-lg text-[11px] font-semibold border transition-opacity hover:opacity-80 ${className}`}
    >
      {children}
    </button>
  );
}
