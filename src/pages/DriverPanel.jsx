import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Droplets, PhoneCall, MessageCircle, BadgeCheck, AlertCircle, Camera, CheckCircle2, Clock, Loader2 } from "lucide-react";
import Logo from "@/components/shared/Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function DriverPanel() {
  const queryClient = useQueryClient();
  const { lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        setIsAuth(true);
      }
      setChecking(false);
    });
  }, []);

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["my-driver", user?.email],
    queryFn: () => base44.entities.Driver.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const driver = drivers[0];

  const { data: callLogs = [] } = useQuery({
    queryKey: ["driver-calls", driver?.id],
    queryFn: () => base44.entities.CallLog.filter({ driver_id: driver?.id }),
    enabled: !!driver?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Driver.update(driver.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-driver"] });
    },
  });

  const handleToggle = (newStatus) => {
    updateMutation.mutate({ status: newStatus });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.info("Uploading...");
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    updateMutation.mutate({ photo_url: file_url });
    toast.success("Photo updated!");
  };

  if (checking || (isAuth && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-primary/10 rounded-3xl p-6 mb-6">
          <Droplets className="w-14 h-14 text-primary mx-auto" />
        </div>
        <h2 className="text-2xl font-extrabold">{t(lang, "driverPanel")}</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
          {t(lang, "signInPrompt")}
        </p>
        <button
          className="mt-8 w-full max-w-xs bg-primary text-primary-foreground rounded-2xl h-14 text-base font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          onClick={() => base44.auth.redirectToLogin()}
        >
          {t(lang, "signIn")}
        </button>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold">{t(lang, "notADriver")}</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
          {t(lang, "notADriverDesc")}
        </p>
      </div>
    );
  }

  const totalCalls = callLogs.filter((c) => c.type === "call").length;
  const totalWA = callLogs.filter((c) => c.type === "whatsapp").length;
  const isAvailable = driver.status === "available";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <LanguageSwitcher />
      </header>

      <div className="px-4 py-5 max-w-sm mx-auto space-y-4">
        {/* Profile Header */}
        <div className="bg-card rounded-3xl border border-border p-5 flex items-center gap-4">
          <div className="relative">
            {driver.photo_url ? (
              <img src={driver.photo_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Droplets className="w-7 h-7 text-primary" />
              </div>
            )}
            <label className="absolute -bottom-1.5 -right-1.5 bg-white border border-border rounded-full p-1 cursor-pointer shadow-sm">
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-base truncate">{driver.name}</h2>
              {driver.is_verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">{driver.area || "—"}</p>
            <div className="flex items-center gap-2 mt-1.5">
              {driver.is_approved ? (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />{t(lang, "approved")}
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />{t(lang, "pendingApproval")}
                </span>
              )}
              <Badge
                variant={driver.subscription_status === "active" ? "default" : "destructive"}
                className="rounded-full text-[10px] h-5"
              >
                {driver.subscription_status === "active" ? t(lang, "active") : t(lang, "unpaid")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pending Notice */}
        {!driver.is_approved && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">{t(lang, "pendingApprovalDesc")}</p>
          </div>
        )}

        {/* Subscription Notice */}
        {driver.subscription_status !== "active" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 leading-relaxed">{t(lang, "contactAdmin")}</p>
          </div>
        )}

        {/* BIG Availability Toggle */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            {t(lang, "yourStatus")}
          </h3>
          <button
            onClick={() => handleToggle("available")}
            disabled={updateMutation.isPending}
            className={`w-full rounded-3xl h-20 flex items-center justify-center gap-3 text-lg font-extrabold transition-all active:scale-95 shadow-lg ${
              isAvailable
                ? "bg-emerald-500 text-white shadow-emerald-200"
                : "bg-card border-2 border-border text-muted-foreground"
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${isAvailable ? "bg-white" : "bg-muted-foreground"} ${isAvailable ? "animate-pulse" : ""}`} />
            {t(lang, "availableStatus")}
          </button>
          <button
            onClick={() => handleToggle("busy")}
            disabled={updateMutation.isPending}
            className={`w-full rounded-3xl h-20 flex items-center justify-center gap-3 text-lg font-extrabold transition-all active:scale-95 shadow-lg ${
              !isAvailable
                ? "bg-red-500 text-white shadow-red-200"
                : "bg-card border-2 border-border text-muted-foreground"
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${!isAvailable ? "bg-white" : "bg-muted-foreground"}`} />
            {t(lang, "busyStatus")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl border border-border p-5 text-center">
            <PhoneCall className="w-6 h-6 text-primary mx-auto" />
            <p className="text-3xl font-extrabold mt-2">{totalCalls}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t(lang, "totalCalls")}</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5 text-center">
            <MessageCircle className="w-6 h-6 text-emerald-500 mx-auto" />
            <p className="text-3xl font-extrabold mt-2">{totalWA}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t(lang, "totalWhatsapp")}</p>
          </div>
        </div>

        {/* Read-only Profile Info */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold">{t(lang, "profileInfo")}</h3>
          <InfoRow label={t(lang, "phone")} value={driver.phone} />
          <InfoRow label={t(lang, "truckSize")} value={`${(driver.truck_size || 0).toLocaleString()} ${t(lang, "liters")}`} />
          <InfoRow label={t(lang, "price")} value={`${(driver.price || 0).toLocaleString()} ${t(lang, "etb")}`} />
          <InfoRow label={t(lang, "deliveryTime")} value={driver.delivery_time || "—"} />
          <InfoRow label={t(lang, "area")} value={driver.area || "—"} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-semibold">{value}</span>
    </div>
  );
}
