import { Droplets } from "lucide-react";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { icon: "w-5 h-5", text: "text-lg" },
    md: { icon: "w-7 h-7", text: "text-2xl" },
    lg: { icon: "w-10 h-10", text: "text-4xl" },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary rounded-xl p-1.5">
        <Droplets className={`${s.icon} text-primary-foreground`} />
      </div>
      <span className={`${s.text} font-extrabold tracking-tight text-foreground`}>
        Wuha<span className="text-primary">Link</span>
      </span>
    </div>
  );
}
