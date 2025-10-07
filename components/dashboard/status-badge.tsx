import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Open" | "In Progress" | "Remediated" | "Ignored";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    Open: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
    "In Progress": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
    Remediated: "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20",
    Ignored: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20",
  };

  return (
    <Badge variant="outline" className={cn(variants[status], className)}>
      {status}
    </Badge>
  );
}
