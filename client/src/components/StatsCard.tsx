import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "secondary" | "accent";
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, trend, color = "primary", delay = 0 }: StatsCardProps) {
  const colorClasses = {
    primary: "text-primary border-primary/20 bg-primary/5",
    secondary: "text-secondary border-secondary/20 bg-secondary/5",
    accent: "text-accent border-accent/20 bg-accent/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm transition-all hover:scale-[1.02]",
        colorClasses[color]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground font-display">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight font-mono">
            {value}
          </h3>
          {trend && (
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              {trend}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-3 bg-background/50 border border-white/5", `text-${color}`)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative glow effect */}
      <div className={cn(
        "absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-20",
        `bg-${color}`
      )} />
    </motion.div>
  );
}
