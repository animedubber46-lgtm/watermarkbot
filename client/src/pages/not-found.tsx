import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive/50 bg-destructive/5 backdrop-blur-md">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive items-center justify-center">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-display">404 ERROR</h1>
          </div>
          
          <p className="mt-4 text-center text-muted-foreground font-mono">
            The requested resource could not be found within the system matrix.
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/" className="px-6 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/50 rounded-md transition-colors font-mono uppercase text-sm font-bold">
              Return to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
