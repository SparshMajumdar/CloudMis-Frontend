import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: "Critical" | "High" | "Medium" | "Low";
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const variants = {
    Critical: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
    High: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20",
    Low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
  };

  return (
    <Badge variant="outline" className={cn(variants[severity], className)}>
      {severity}
    </Badge>
  );
}
