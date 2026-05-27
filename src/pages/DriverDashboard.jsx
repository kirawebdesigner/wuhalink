import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import {
  Droplets, PhoneCall, MessageCircle, BadgeCheck, AlertCircle,
  Camera, CheckCircle2, Clock, Loader2, LogOut, TrendingUp, Shield
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";

export default function DriverDashboard() {
  const queryClient = useQueryClient();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      } else {
        navigate("/driver-login");
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-driver"] }),
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.info(lang === "am" ? "በመጫን ላይ..." : "Uploading...");
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    updateMutation.mutate({ photo_url: file_url });
    toast.success(lang === "am" ? "ፎቶ ተዘምኗል!" : "Photo updated!");
  };

  const handleLogout = () => {
    base44.auth.logout(window.location.origin + "/driver-login");
  };

  if (checking || (user && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button onClick={handleLogout} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <AlertCircle className="w-16 h-16 text-amber-400 mb-4" />
          <h2 className="text-xl font-bold">{t(lang, "notADriver")}</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">{t(lang, "notADriverDesc")}</p>
        </div>
      </div>
    );
  }

  const totalCalls = callLogs.filter((c) => c.type === "call").length;
  const totalWA = callLogs.filter((c) => c.type === "whatsapp").length;
  const isAvailable = driver.status === "available";

  const subColors = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    expired: "bg-red-50 text-red-600 border-red-200",
    unpaid: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50 px-5 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="px-4 py-5 max-w-sm mx-auto space-y-4 pb-24">

        {/* Profile Card */}
        <div className="bg-card rounded-3xl border border-border p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {driver.photo_url ? (
                <img src={driver.photo_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Droplets className="w-8 h-8 text-primary" />
                </div>
              )}
              <label className="absolute -bottom-1.5 -right-1.5 bg-white border border-border rounded-full p-1.5 cursor-pointer shadow-sm">
                <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-base truncate">{driver.name}</h2>
                {driver.is_verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{driver.area || "—"}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {driver.is_approved ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />{t(lang, "approved")}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />{t(lang, "pendingApproval")}
                  </span>
                )}
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${subColors[driver.subscription_status] || subColors.unpaid}`}>
                  {driver.subscription_status === "active" ? t(lang, "active") :
                   driver.subscription_status === "expired" ? (lang === "am" ? "ጊዜ ያለፈ" : "Expired") :
                   t(lang, "unpaid")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {!driver.is_approved && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">{t(lang, "pendingApprovalDesc")}</p>
          </div>
        )}
        {driver.subscription_status !== "active" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 leading-relaxed">{t(lang, "contactAdmin")}</p>
          </div>
        )}

        {/* Availability Toggle */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
            {t(lang, "yourStatus")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateMutation.mutate({ status: "available" })}
              disabled={updateMutation.isPending}
              className={`rounded-2xl h-24 flex flex-col items-center justify-center gap-2 font-extrabold text-sm transition-all active:scale-95 border-2 ${
                isAvailable
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-muted"}`} />
              {t(lang, "availableStatus")}
            </button>
            <button
              onClick={() => updateMutation.mutate({ status: "busy" })}
              disabled={updateMutation.isPending}
              className={`rounded-2xl h-24 flex flex-col items-center justify-center gap-2 font-extrabold text-sm transition-all active:scale-95 border-2 ${
                !isAvailable
                  ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${!isAvailable ? "bg-white" : "bg-muted"}`} />
              {t(lang, "busyStatus")}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
            {lang === "am" ? "ስታቲስቲክስ" : "Statistics"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<PhoneCall className="w-6 h-6 text-primary" />} value={totalCalls} label={t(lang, "totalCalls")} />
            <StatCard icon={<MessageCircle className="w-6 h-6 text-emerald-500" />} value={totalWA} label={t(lang, "totalWhatsapp")} />
            <StatCard icon={<TrendingUp className="w-6 h-6 text-violet-500" />} value={totalCalls + totalWA} label={lang === "am" ? "ጠቅላላ ግንኙነቶች" : "Total Contacts"} />
            <StatCard icon={<span className="text-2xl">⭐</span>} value={driver.rating?.toFixed(1) || "—"} label={t(lang, "rating")} />
          </div>
        </div>

        {/* Profile Info - Read Only */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold">{t(lang, "profileInfo")}</h3>
          </div>
          <div className="space-y-2.5">
            <InfoRow label={t(lang, "phone")} value={driver.phone} />
            <InfoRow label={t(lang, "truckSize")} value={`${(driver.truck_size || 0).toLocaleString()} ${t(lang, "liters")}`} />
            <InfoRow label={t(lang, "price")} value={`${(driver.price || 0).toLocaleString()} ${t(lang, "etb")}`} />
            <InfoRow label={t(lang, "deliveryTime")} value={driver.delivery_time || "—"} />
            <InfoRow label={t(lang, "area")} value={driver.area || "—"} />
            {driver.subscription_expiry && (
              <InfoRow
                label={lang === "am" ? "ምዝገባ ቀን" : "Sub. Expiry"}
                value={new Date(driver.subscription_expiry).toLocaleDateString()}
              />
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            {lang === "am" ? "የፕሮፋይል ለውጦች በአስተዳዳሪ ብቻ ይደረጋሉ" : "Profile changes are made by admin only"}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 text-center flex flex-col items-center gap-1">
      {icon}
      <p className="text-2xl font-extrabold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-semibold">{value}</span>
    </div>
  );
}
