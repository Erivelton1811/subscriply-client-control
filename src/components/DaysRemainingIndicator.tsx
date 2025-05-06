
import { cn } from "@/lib/utils";

interface DaysRemainingIndicatorProps {
  days: number;
  className?: string;
}

export function DaysRemainingIndicator({ days, className }: DaysRemainingIndicatorProps) {
  const getColorClass = () => {
    if (days <= 0) return "text-status-expired";
    if (days <= 5) return "text-status-warning";
    return "text-status-active";
  };

  return (
    <div className={cn("flex items-center", className)}>
      <span className={cn("font-medium", getColorClass())}>
        {days <= 0
          ? "Vencido"
          : `${days} ${days === 1 ? "dia" : "dias"} restante${days === 1 ? "" : "s"}`}
      </span>
    </div>
  );
}
