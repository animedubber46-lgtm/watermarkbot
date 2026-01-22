import { useJobs } from "@/hooks/use-dashboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, Film, CheckCircle2, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function RecentJobs() {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-border bg-card/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 gap-1"><CheckCircle2 className="w-3 h-3" /> COMPLETED</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 gap-1"><Loader2 className="w-3 h-3 animate-spin" /> PROCESSING</Badge>;
      case 'failed':
        return <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10 gap-1"><XCircle className="w-3 h-3" /> FAILED</Badge>;
      default:
        return <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground bg-muted/10 gap-1"><Clock className="w-3 h-3" /> PENDING</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-border/50 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      <div className="p-6 border-b border-border/50 flex justify-between items-center bg-gradient-to-r from-background to-transparent">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground font-display">Recent Operations</h3>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">LIVE FEED</Badge>
      </div>
      
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-[100px] text-primary/80 font-display">JOB ID</TableHead>
              <TableHead className="text-primary/80 font-display">USER ID</TableHead>
              <TableHead className="text-primary/80 font-display">TYPE</TableHead>
              <TableHead className="text-primary/80 font-display">STATUS</TableHead>
              <TableHead className="text-right text-primary/80 font-display">CREATED</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs && jobs.length > 0 ? (
              jobs.slice(0, 10).map((job) => (
                <TableRow key={job.id} className="border-border/20 hover:bg-primary/5 transition-colors font-mono text-sm">
                  <TableCell className="font-medium text-primary">#{job.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell>{job.telegramId}</TableCell>
                  <TableCell className="uppercase">{job.watermarkType || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {job.createdAt ? format(new Date(job.createdAt), 'MMM dd HH:mm:ss') : '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No jobs found. Start the bot to see activity.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
