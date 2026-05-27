import { MapPin, DollarSign, Zap, Wifi } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: MapPin,
    title: "Nearby Trucks",
    desc: "Find water suppliers in your area instantly",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    desc: "See prices upfront, no hidden fees",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Zap,
    title: "Fast Contact",
    desc: "Call or WhatsApp drivers with one tap",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Wifi,
    title: "Live Availability",
    desc: "Real-time status — know who's available now",
    color: "bg-violet-50 text-violet-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-5 py-10">
      <div className="max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-center mb-6">Why WuhaLink?</h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm mt-3">{f.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
