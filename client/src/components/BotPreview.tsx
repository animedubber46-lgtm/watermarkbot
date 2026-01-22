import { motion } from "framer-motion";
import { MessageSquare, Image as ImageIcon } from "lucide-react";

export function BotPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="h-full rounded-xl border border-border/50 bg-black/40 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-bold text-foreground font-display">Bot Preview</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-border/50 rounded-lg bg-background/30 gap-4">
        <div className="w-full max-w-[280px] bg-[#1c1c1c] rounded-lg overflow-hidden shadow-lg border border-white/5">
          {/* Bot Welcome Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-black">
             {/* Bot welcome message image - cyberpunk hacker aesthetic */}
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReiunZS61De94G_EZk-re6vY-YfpEH1RA_ew&s"
              alt="Bot Welcome"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
              <span className="text-xs font-mono text-white/80">Welcome to WatermarkBot v2.0</span>
            </div>
          </div>
          
          <div className="p-3 space-y-2">
            <div className="h-2 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-2 w-1/2 bg-white/10 rounded animate-pulse" />
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-primary/20 text-primary text-[10px] py-2 text-center rounded hover:bg-primary/30 cursor-pointer font-bold uppercase transition-colors">Developer</div>
              <div className="bg-secondary/20 text-secondary text-[10px] py-2 text-center rounded hover:bg-secondary/30 cursor-pointer font-bold uppercase transition-colors">Update</div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground font-mono">Status: <span className="text-green-500 text-glow">ONLINE</span></h4>
          <p className="text-xs text-muted-foreground/50">Listening for new videos...</p>
        </div>
      </div>
    </motion.div>
  );
}
