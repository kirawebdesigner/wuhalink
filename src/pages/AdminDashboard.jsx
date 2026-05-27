import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Users, Truck, PhoneCall, ShieldCheck, Loader2, Plus, Search, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Logo from "@/components/shared/Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import StatCard from "@/components/admin/StatCard";
import AdminDriverRow from "@/components/admin/AdminDriverRow";
import DriverFormModal from "@/components/admin/DriverFormModal";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        setIsAdmin(me.role === "admin");
      }
      setChecking(false);
    });
  }, []);

  const { data: allDrivers = [], isLoading: driversLoading } = useQuery({
    queryKey: ["admin-drivers"],
    queryFn: () => base44.entities.Driver.list(),
    enabled: isAdmin,
  });

  const { data: callLogs = [] } = useQuery({
    queryKey: ["admin-calls"],
    queryFn: () => base44.entities.CallLog.list(),
    enabled: isAdmin,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => base44.entities.User.list(),
    enabled: isAdmin,
  });

  const updateDriver = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Driver.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      toast.success("Updated!");
    },
  });

  const deleteDriver = useMutation({
    mutationFn: (id) => base44.entities.Driver.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      toast.success("Driver removed");
    },
  });

  const createDriver = useMutation({
    mutationFn: (data) => base44.entities.Driver.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      toast.success("Driver added!");
      setShowForm(false);
      setEditingDriver(null);
    },
  });

  const saveDriver = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Driver.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      toast.success("Saved!");
      setShowForm(false);
      setEditingDriver(null);
    },
  });

  const handleFormSave = (data) => {
    if (editingDriver) {
      saveDriver.mutate({ id: editingDriver.id, data });
    } else {
      createDriver.mutate(data);
    }
  };

  const tabFiltered = tab === "all"
    ? allDrivers
    : tab === "pending"
    ? allDrivers.filter((d) => !d.is_approved)
    : tab === "approved"
    ? allDrivers.filter((d) => d.is_approved)
    : allDrivers.filter((d) => d.subscription_status !== "active");

  const filteredDrivers = search
    ? tabFiltered.filter((d) =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.area?.toLowerCase().includes(search.toLowerCase()) ||
        d.phone?.includes(search)
      )
    : tabFiltered;

  if (checking || driversLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">{t(lang, "adminOnly")}</h2>
        <p className="text-sm text-muted-foreground mt-2">{t(lang, "adminOnlyDesc")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Admin</span>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-5">
        <h1 className="text-xl font-bold">{t(lang, "adminDashboard")}</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Users} label={t(lang, "totalUsers")} value={allUsers.length} color="bg-primary/10 text-primary" />
          <StatCard icon={Truck} label={t(lang, "totalDrivers")} value={allDrivers.length} color="bg-emerald-50 text-emerald-600" />
          <StatCard icon={PhoneCall} label={t(lang, "totalContacts")} value={callLogs.length} color="bg-amber-50 text-amber-600" />
          <StatCard icon={ShieldCheck} label={t(lang, "totalApproved")} value={allDrivers.filter((d) => d.is_approved).length} color="bg-violet-50 text-violet-600" />
        </div>

        {/* Driver Management */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">{t(lang, "manageDrivers")}</h2>
            <button
              onClick={() => { setEditingDriver(null); setShowForm(true); }}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-xl h-9 px-3 text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t(lang, "addDriver")}
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, area, phone..."
              className="pl-9 h-10 rounded-xl"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-muted rounded-xl mb-4 w-full">
              <TabsTrigger value="all" className="rounded-lg text-xs flex-1">{t(lang, "all_tab")}</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg text-xs flex-1">{t(lang, "pending_tab")}</TabsTrigger>
              <TabsTrigger value="approved" className="rounded-lg text-xs flex-1">{t(lang, "approved_tab")}</TabsTrigger>
              <TabsTrigger value="unpaid" className="rounded-lg text-xs flex-1">{t(lang, "unpaid_tab")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3">
            {filteredDrivers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t(lang, "noDriversCategory")}</p>
            ) : (
              filteredDrivers.map((driver) => (
                <AdminDriverRow
                  key={driver.id}
                  driver={driver}
                  lang={lang}
                  onApprove={(d) => updateDriver.mutate({ id: d.id, data: { is_approved: true } })}
                  onRemove={(d) => deleteDriver.mutate(d.id)}
                  onEdit={(d) => { setEditingDriver(d); setShowForm(true); }}
                  onToggleFeatured={(d) => updateDriver.mutate({ id: d.id, data: { is_featured: !d.is_featured } })}
                  onToggleVerified={(d) => updateDriver.mutate({ id: d.id, data: { is_verified: !d.is_verified } })}
                  onTogglePaid={(d) =>
                    updateDriver.mutate({
                      id: d.id,
                      data: { subscription_status: d.subscription_status === "active" ? "unpaid" : "active" },
                    })
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <DriverFormModal
          driver={editingDriver}
          lang={lang}
          onSave={handleFormSave}
          onClose={() => { setShowForm(false); setEditingDriver(null); }}
          isSaving={createDriver.isPending || saveDriver.isPending}
        />
      )}
    </div>
  );
}
