import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { t } from "@/lib/i18n";

const EMPTY_FORM = {
  name: "", phone: "", whatsapp: "", truck_size: 5000,
  price: 0, delivery_time: "30 min", area: "",
  status: "available", subscription_status: "unpaid",
  is_approved: false, is_verified: false, is_featured: false,
};

export default function DriverFormModal({ driver, lang, onSave, onClose, isSaving }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (driver) {
      setForm({
        name: driver.name || "",
        phone: driver.phone || "",
        whatsapp: driver.whatsapp || "",
        truck_size: driver.truck_size || 5000,
        price: driver.price || 0,
        delivery_time: driver.delivery_time || "30 min",
        area: driver.area || "",
        status: driver.status || "available",
        subscription_status: driver.subscription_status || "unpaid",
        is_approved: driver.is_approved || false,
        is_verified: driver.is_verified || false,
        is_featured: driver.is_featured || false,
        user_email: driver.user_email || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [driver]);

  const f = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4">
      <div className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-bold text-base">
            {driver ? t(lang, "editDriver") : t(lang, "addDriver")}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label={t(lang, "name")}>
            <Input value={form.name} onChange={(e) => f("name", e.target.value)} className="rounded-xl h-10" required />
          </Field>

          <Field label={t(lang, "phone")}>
            <Input value={form.phone} onChange={(e) => f("phone", e.target.value)} className="rounded-xl h-10" placeholder="+251..." required />
          </Field>

          <Field label="WhatsApp">
            <Input value={form.whatsapp} onChange={(e) => f("whatsapp", e.target.value)} className="rounded-xl h-10" placeholder="+251..." />
          </Field>

          <Field label={t(lang, "area")}>
            <Input value={form.area} onChange={(e) => f("area", e.target.value)} className="rounded-xl h-10" placeholder="Bole, Addis Ababa" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, "truckSize")}>
              <Select value={String(form.truck_size)} onValueChange={(v) => f("truck_size", Number(v))}>
                <SelectTrigger className="rounded-xl h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[3000, 5000, 8000, 10000, 15000, 20000].map((s) => (
                    <SelectItem key={s} value={String(s)}>{s.toLocaleString()} L</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={`${t(lang, "price")} (ETB)`}>
              <Input type="number" value={form.price} onChange={(e) => f("price", Number(e.target.value))} className="rounded-xl h-10" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, "deliveryTime")}>
              <Input value={form.delivery_time} onChange={(e) => f("delivery_time", e.target.value)} className="rounded-xl h-10" placeholder="30 min" />
            </Field>
            <Field label="User Email">
              <Input value={form.user_email || ""} onChange={(e) => f("user_email", e.target.value)} className="rounded-xl h-10" placeholder="driver@email.com" />
            </Field>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "is_approved", label: t(lang, "approved") },
              { key: "is_verified", label: t(lang, "verified") },
              { key: "is_featured", label: t(lang, "featured") },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => f(key, !form[key])}
                className={`rounded-xl py-2 text-xs font-semibold border transition-colors ${
                  form[key]
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Field label="Subscription">
            <Select value={form.subscription_status} onValueChange={(v) => f("subscription_status", v)}>
              <SelectTrigger className="rounded-xl h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t(lang, "active")}</SelectItem>
                <SelectItem value="unpaid">{t(lang, "unpaid")}</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {t(lang, "saveDriver")}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
