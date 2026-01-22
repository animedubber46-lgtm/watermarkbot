import { useStats } from "@/hooks/use-dashboard";
import { StatsCard } from "@/components/StatsCard";
import { RecentJobs } from "@/components/RecentJobs";
import { BotPreview } from "@/components/BotPreview";
import { Users, Video, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats } = useStats();

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary text-glow">
            NEXUS DASHBOARD
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm md:text-base">
            Video Watermark Bot Control Center // System Active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-mono text-xs text-green-400">SYSTEM OPERATIONAL</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="primary"
          delay={0.1}
        />
        <StatsCard
          title="Jobs Processed"
          value={stats?.totalJobs || 0}
          icon={Video}
          color="secondary"
          delay={0.2}
        />
        <StatsCard
          title="Active Now"
          value={stats?.activeJobs || 0}
          icon={Activity}
          color="accent"
          delay={0.3}
        />
        <StatsCard
          title="Efficiency"
          value="99.8%"
          icon={Zap}
          color="primary" // Reusing primary for a balanced look
          delay={0.4}
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentJobs />
        </div>
        <div className="lg:col-span-1">
          <BotPreview />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="pt-8 border-t border-border/20 text-center text-xs font-mono text-muted-foreground/50">
        <p>SYSTEM ID: {Math.random().toString(36).substring(7).toUpperCase()} // SECURE CONNECTION</p>
      </footer>
    </div>
  );
}
