import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ResultBadgeProps {
  status: "success" | "warning" | "destructive";
  label: string;
  className?: string;
}

export function ResultBadge({ status, label, className }: ResultBadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    warning: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    destructive: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  };

  const Icon = status === "success" ? CheckCircle2 : status === "warning" ? AlertTriangle : XCircle;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium animate-in fade-in zoom-in duration-300",
      variants[status],
      className
    )}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}
